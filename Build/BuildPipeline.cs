using System.Diagnostics;
using Soft.Compiler.Build.Bundler;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Emit;
using Soft.Compiler.Parser;

namespace Soft.Compiler.Build;

/// <summary>
/// Complete build pipeline that orchestrates:
/// 1. Soft source (.s) → Generated TypeScript
/// 2. TypeScript → JavaScript (via tsc)
/// 3. JavaScript → Bundle (via esbuild)
/// 4. Generate dist/ with index.html, bundle.js, assets
/// </summary>
public sealed class BuildPipeline
{
    private readonly BuildConfiguration _config;
    private readonly IDiagnosticReporter _diagnosticReporter;
    private readonly bool _verbose;

    public BuildPipeline(
        BuildConfiguration config,
        IDiagnosticReporter diagnosticReporter,
        bool verbose = false)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _diagnosticReporter = diagnosticReporter ?? throw new ArgumentNullException(nameof(diagnosticReporter));
        _verbose = verbose;
    }

    /// <summary>
    /// Execute the complete build pipeline.
    /// </summary>
    public BuildResult Build()
    {
        var stopwatch = Stopwatch.StartNew();
        _diagnosticReporter.Clear();

        // Step 1: Compile Soft sources to TypeScript
        Console.WriteLine("[BUILD] Step 1: Compiling Soft sources to TypeScript...");
        if (_verbose) Console.WriteLine("[VERBOSE] Starting Soft → TypeScript compilation...");
        var compileResult = CompileSoftSources();
        if (!compileResult.Success)
        {
            stopwatch.Stop();
            return new BuildResult(false, compileResult.FilesProcessed, 0, stopwatch.Elapsed, _diagnosticReporter.GetDiagnostics());
        }

        // Step 2: Compile TypeScript to JavaScript
        Console.WriteLine("[BUILD] Step 2: Compiling TypeScript to JavaScript...");
        if (_verbose) Console.WriteLine("[VERBOSE] Starting TypeScript → JavaScript compilation...");
        var tsResult = CompileTypeScript();
        if (!tsResult)
        {
            stopwatch.Stop();
            return new BuildResult(false, compileResult.FilesProcessed, compileResult.FilesGenerated, stopwatch.Elapsed, _diagnosticReporter.GetDiagnostics());
        }

        // Step 3: Bundle JavaScript
        Console.WriteLine("[BUILD] Step 3: Bundling JavaScript...");
        var bundleResult = BundleJavaScript().GetAwaiter().GetResult();
        if (!bundleResult.Success)
        {
            _diagnosticReporter.ReportError("BUILD010", $"Bundling failed: {bundleResult.Error}", null);
            stopwatch.Stop();
            return new BuildResult(false, compileResult.FilesProcessed, compileResult.FilesGenerated, stopwatch.Elapsed, _diagnosticReporter.GetDiagnostics());
        }

        // Step 4: Generate index.html and copy assets
        Console.WriteLine("[BUILD] Step 4: Generating dist files...");
        GenerateDistFiles();

        stopwatch.Stop();
        return new BuildResult(
            true,
            compileResult.FilesProcessed,
            compileResult.FilesGenerated,
            stopwatch.Elapsed,
            _diagnosticReporter.GetDiagnostics(),
            bundleResult.BundleSizeBytes);
    }

    /// <summary>
    /// Compile only Soft sources to TypeScript (for incremental builds).
    /// </summary>
    public CompileResult CompileSoftSources()
    {
        Console.WriteLine("[COMPILE] Getting source path...");
        var sourcePath = _config.GetSourcePath();
        if (_verbose) Console.WriteLine($"[VERBOSE] Source path: {sourcePath}");
        if (!Directory.Exists(sourcePath))
        {
            _diagnosticReporter.ReportError("BUILD004", $"Source directory not found: {sourcePath}", null);
            return new CompileResult(false, 0, 0);
        }

        Console.WriteLine($"[COMPILE] Scanning for .s files in {sourcePath}...");
        var sourceFiles = Directory.GetFiles(sourcePath, "*.s", SearchOption.AllDirectories);
        if (_verbose)
        {
            Console.WriteLine($"[VERBOSE] Found {sourceFiles.Length} .s files:");
            foreach (var file in sourceFiles)
            {
                Console.WriteLine($"[VERBOSE]   - {Path.GetFileName(file)}");
            }
        }
        if (sourceFiles.Length == 0)
        {
            _diagnosticReporter.ReportWarning("BUILD005", $"No .s files found in {sourcePath}", null);
        }

        var generatedPath = _config.GetGeneratedPath();
        Directory.CreateDirectory(generatedPath);

        // STAGE 1: Parse all files
        Console.WriteLine($"[COMPILE] Parsing {sourceFiles.Length} file(s)...");
        var softParser = new SoftParser();
        var units = new List<SoftFileUnit>();
        
        foreach (var sourceFile in sourceFiles)
        {
            Console.WriteLine($"[COMPILE] Parsing {Path.GetFileName(sourceFile)}...");
            try
            {
                var source = File.ReadAllText(sourceFile);
                var unit = softParser.Parse(source, sourceFile);
                units.Add(unit);
            }
            catch (Exception ex)
            {
                _diagnosticReporter.ReportError("BUILD006", $"Failed to parse {sourceFile}: {ex.Message}", null);
            }
        }

        // STAGE 2: Build page symbol table
        Console.WriteLine("[COMPILE] Building symbol table...");
        var symbolBuilder = new Semantics.PageSymbolBuilder();
        var pageSymbolTable = symbolBuilder.Build(units);

        // STAGE 3: Copy router runtime to generated folder
        Console.WriteLine("[COMPILE] Copying router runtime...");
        if (_verbose) Console.WriteLine("[VERBOSE] Copying router.js and router.d.ts to generated folder...");
        CopyRouterToGenerated(generatedPath);
        
        // Copy SoftComponent base class
        Console.WriteLine("[COMPILE] Copying SoftComponent runtime...");
        CopySoftComponentToGenerated(generatedPath);

        // STAGE 4: Auto-register all components in the project
        Console.WriteLine("[COMPILE] Registering components...");
        var componentRegistry = new Components.ComponentRegistry();
        foreach (var unit in units)
        {
            if (unit.Decorators.Any(d => d.Name == "Component"))
            {
                var componentName = unit.ClassName ?? Path.GetFileNameWithoutExtension(unit.FilePath);
                var relativePath = "./" + Path.GetFileNameWithoutExtension(unit.FilePath) + ".generated";
                Console.WriteLine($"[COMPILE] Registered component: {componentName}");
                componentRegistry.Register(new Parser.ComponentImport
                {
                    Path = relativePath,
                    Alias = componentName,
                    Line = 0
                });
            }
        }

        // STAGE 5: Generate TypeScript with symbol table
        Console.WriteLine("[COMPILE] Generating TypeScript...");
        int filesProcessed = 0;
        int filesGenerated = 0;

        foreach (var unit in units)
        {
            Console.WriteLine($"[COMPILE] Processing {Path.GetFileName(unit.FilePath)}...");
            if (_verbose) Console.WriteLine($"[VERBOSE] Generating TypeScript for {Path.GetFileName(unit.FilePath)}...");
            
            // Add timeout protection to prevent infinite hangs
            var cts = new System.Threading.CancellationTokenSource();
            var task = System.Threading.Tasks.Task.Run(() => ProcessSoftFile(unit, generatedPath, pageSymbolTable, componentRegistry), cts.Token);
            
            // Use 10s timeout for dev mode, 5s for production
            var timeoutSeconds = _config.IsProduction ? 5 : 10;
            
            bool success = false;
            if (task.Wait(TimeSpan.FromSeconds(timeoutSeconds)))
            {
                success = task.Result;
            }
            else
            {
                cts.Cancel();
                Console.WriteLine($"[COMPILE] ERROR: File processing timeout - {Path.GetFileName(unit.FilePath)} (took >{timeoutSeconds}s)");
                Console.WriteLine($"[COMPILE] This usually indicates an infinite loop or extremely complex template.");
                _diagnosticReporter.ReportError("BUILD007", $"File processing timeout (>{timeoutSeconds}s): {unit.FilePath}", null);
                return new CompileResult(false, filesProcessed, filesGenerated);
            }
            
            if (success)
            {
                filesProcessed++;
                filesGenerated++;
            }
            else
            {
                Console.WriteLine($"[COMPILE] ERROR: Failed to process {Path.GetFileName(unit.FilePath)}");
                return new CompileResult(false, filesProcessed, filesGenerated);
            }
        }

        return new CompileResult(!_diagnosticReporter.HasErrors, filesProcessed, filesGenerated);
    }
    
    private void CopyRouterToGenerated(string generatedPath)
    {
        // Bug #25: Ensure we copy the correct router.js with ES module exports
        // Try multiple locations in order of preference
        var currentDir = Directory.GetCurrentDirectory();
        var possiblePaths = new[]
        {
            Path.Combine(currentDir, "Runtime", "router.js"),           // Development location
            Path.Combine(AppContext.BaseDirectory, "Runtime", "router.js"), // Deployed location
            Path.Combine(currentDir, "..", "Runtime", "router.js")      // Alternative structure
        };
        
        string? runtimePath = null;
        foreach (var path in possiblePaths)
        {
            if (File.Exists(path))
            {
                runtimePath = path;
                break;
            }
        }
        
        if (runtimePath == null)
        {
            throw new FileNotFoundException("router.js not found in Runtime folder. Ensure Runtime/router.ts has been compiled to router.js");
        }
        
        var destPath = Path.Combine(generatedPath, "router.js");
        File.Copy(runtimePath, destPath, overwrite: true);
        
        // Copy router.d.ts for TypeScript type checking
        var runtimeDir = Path.GetDirectoryName(runtimePath);
        var typeDefPath = Path.Combine(runtimeDir!, "router.d.ts");
        if (File.Exists(typeDefPath))
        {
            var destTypeDefPath = Path.Combine(generatedPath, "router.d.ts");
            File.Copy(typeDefPath, destTypeDefPath, overwrite: true);
        }
    }
    
    private void CopySoftComponentToGenerated(string generatedPath)
    {
        var runtimeDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Runtime");
        var runtimePath = Path.Combine(runtimeDir, "SoftComponent.ts");
        
        if (!File.Exists(runtimePath))
        {
            throw new FileNotFoundException("SoftComponent.ts not found in Runtime folder");
        }
        
        var destPath = Path.Combine(generatedPath, "SoftComponent.ts");
        File.Copy(runtimePath, destPath, overwrite: true);
        
        if (_verbose) Console.WriteLine($"[VERBOSE] Copied SoftComponent.ts to {destPath}");
    }

    private bool ProcessSoftFile(SoftFileUnit unit, string outputDir, Semantics.PageSymbolTable symbolTable, Components.ComponentRegistry componentRegistry)
    {
        try
        {
            // Generate TypeScript with symbol table for navigation resolution
            var generator = new TypeScriptGenerator(componentRegistry);
            var tsCode = generator.GenerateWithSymbolTable(unit, symbolTable, out var sourceMap);
            
            var appName = Path.GetFileNameWithoutExtension(unit.FilePath);
            var outputFileName = $"{appName}.generated.ts";
            var outputPath = Path.Combine(outputDir, outputFileName);
            
            File.WriteAllText(outputPath, tsCode);
            
            // TODO: Store source map for diagnostic translation

            return true;
        }
        catch (Exception ex)
        {
            _diagnosticReporter.ReportError("BUILD006", $"Failed to process {unit.FilePath}: {ex.Message}", null);
            return false;
        }
    }

    private bool CompileTypeScript()
    {
        var tsCompiler = new TypeScriptCompilerHost(_config, _diagnosticReporter, _verbose);
        return tsCompiler.Compile();
    }

    private async Task<BundleResult> BundleJavaScript()
    {
        var bundler = new EsbuildBundler();
        
        if (!bundler.IsAvailable())
        {
            _diagnosticReporter.ReportWarning("BUILD011", "esbuild not found. Skipping bundling. Install with: npm install -g esbuild", null);
            // Copy JS files directly to dist instead
            CopyJsFilesToDist();
            return new BundleResult { Success = true };
        }

        var distPath = _config.GetOutputPath();
        var generatedPath = _config.GetGeneratedPath();
        
        // Generate bootstrap file that imports all pages
        var entryPoint = Path.Combine(distPath, "bootstrap.generated.js");
        GenerateBootstrapFile(entryPoint, distPath);

        var options = new BundleOptions
        {
            EntryPoint = entryPoint,
            OutputDirectory = distPath,
            OutputFileName = "bundle.js",
            Minify = _config.IsProduction,
            SourceMaps = _config.EnableSourceMaps && !_config.IsProduction
        };

        return await bundler.BundleAsync(options);
    }

    private void CopyJsFilesToDist()
    {
        // Fallback when bundler is not available
        var distPath = _config.GetOutputPath();
        Directory.CreateDirectory(distPath);
        
        // JS files are already in dist from TypeScript compilation
        // Just ensure they're there
    }

    private void GenerateDistFiles()
    {
        var distPath = _config.GetOutputPath();
        Directory.CreateDirectory(distPath);

        // Check if bundle.js exists, otherwise use bootstrap.generated.js
        var bundleFile = Path.Combine(distPath, "bundle.js");
        var bootstrapFile = Path.Combine(distPath, "bootstrap.generated.js");
        var bundleFileName = File.Exists(bundleFile) ? "bundle.js" : "bootstrap.generated.js";

        // Generate index.html
        var htmlGenerator = new HtmlGenerator();
        var htmlOptions = new HtmlGeneratorOptions
        {
            Title = GetProjectTitle(),
            ContainerId = "app",
            BundleFileName = bundleFileName,
            StyleSheets = _config.GlobalStyles.ToList()
        };

        var html = htmlGenerator.Generate(htmlOptions);
        File.WriteAllText(Path.Combine(distPath, "index.html"), html);

        // Copy router.js and router.d.ts from generated to dist
        var generatedRouterPath = Path.Combine(_config.GetGeneratedPath(), "router.js");
        var distRouterPath = Path.Combine(distPath, "router.js");
        if (File.Exists(generatedRouterPath))
        {
            File.Copy(generatedRouterPath, distRouterPath, overwrite: true);
        }
        
        var generatedRouterTypesPath = Path.Combine(_config.GetGeneratedPath(), "router.d.ts");
        var distRouterTypesPath = Path.Combine(distPath, "router.d.ts");
        if (File.Exists(generatedRouterTypesPath))
        {
            File.Copy(generatedRouterTypesPath, distRouterTypesPath, overwrite: true);
        }

        // Copy public assets if they exist
        CopyPublicAssets();
    }

    private void GenerateBootstrapFile(string outputPath, string distPath)
    {
        // Find all generated .js files (pages)
        var jsFiles = Directory.GetFiles(distPath, "*.generated.js", SearchOption.TopDirectoryOnly);
        
        var imports = new List<string>();
        foreach (var jsFile in jsFiles)
        {
            var fileName = Path.GetFileNameWithoutExtension(Path.GetFileNameWithoutExtension(jsFile)); // Remove .generated.js
            imports.Add($"import './{Path.GetFileName(jsFile)}';");
        }
        
        var bootstrapContent = string.Join("\n", imports) + "\n";
        File.WriteAllText(outputPath, bootstrapContent);
    }

    private string GetProjectTitle()
    {
        // Try to extract from project name or use default
        var projectName = Path.GetFileName(_config.ProjectRoot);
        return string.IsNullOrEmpty(projectName) ? "Soft Application" : projectName;
    }

    private void CopyPublicAssets()
    {
        var publicPath = Path.Combine(_config.ProjectRoot, "public");
        if (!Directory.Exists(publicPath)) return;

        var distPath = _config.GetOutputPath();
        
        foreach (var file in Directory.GetFiles(publicPath, "*", SearchOption.AllDirectories))
        {
            var relativePath = Path.GetRelativePath(publicPath, file);
            var destPath = Path.Combine(distPath, relativePath);
            
            Directory.CreateDirectory(Path.GetDirectoryName(destPath)!);
            File.Copy(file, destPath, true);
        }
    }

    private void CopyRuntimeFiles(string outputDir)
    {
        var assemblyDir = Path.GetDirectoryName(typeof(BuildPipeline).Assembly.Location);
        if (assemblyDir == null) return;

        var runtimeDir = Path.Combine(assemblyDir, "..", "..", "..", "..", "Runtime");
        if (!Directory.Exists(runtimeDir))
        {
            runtimeDir = Path.Combine(assemblyDir, "Runtime");
        }

        if (!Directory.Exists(runtimeDir))
        {
            var projectRoot = FindProjectRoot(assemblyDir);
            if (projectRoot != null)
            {
                runtimeDir = Path.Combine(projectRoot, "Runtime");
            }
        }

        if (Directory.Exists(runtimeDir))
        {
            var runtimeFile = Path.Combine(runtimeDir, "runtime.ts");
            var rendererFile = Path.Combine(runtimeDir, "renderer.ts");

            if (File.Exists(runtimeFile))
            {
                File.Copy(runtimeFile, Path.Combine(outputDir, "runtime.ts"), true);
            }

            if (File.Exists(rendererFile))
            {
                File.Copy(rendererFile, Path.Combine(outputDir, "renderer.ts"), true);
            }
        }
    }

    private string? FindProjectRoot(string startDir)
    {
        var dir = startDir;
        while (!string.IsNullOrEmpty(dir))
        {
            if (File.Exists(Path.Combine(dir, "Soft.Compiler.csproj")))
            {
                return dir;
            }
            dir = Path.GetDirectoryName(dir);
        }
        return null;
    }
}

public sealed record CompileResult(bool Success, int FilesProcessed, int FilesGenerated);
