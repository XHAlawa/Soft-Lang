using System.Diagnostics;
using Soft.Compiler.Diagnostics;

namespace Soft.Compiler.Build;

public sealed class TypeScriptCompilerHost
{
    private readonly BuildConfiguration _config;
    private readonly IDiagnosticReporter _diagnosticReporter;
    private readonly bool _verbose;

    public TypeScriptCompilerHost(BuildConfiguration config, IDiagnosticReporter diagnosticReporter, bool verbose = false)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _diagnosticReporter = diagnosticReporter ?? throw new ArgumentNullException(nameof(diagnosticReporter));
        _verbose = verbose;
    }

    public bool Compile()
    {
        var tscPath = FindTypeScriptCompiler();
        if (tscPath == null)
        {
            _diagnosticReporter.ReportError(
                "BUILD001",
                "TypeScript compiler not found. Install with: npm install -g typescript",
                null);
            return false;
        }

        var generatedPath = _config.GetGeneratedPath();
        if (!Directory.Exists(generatedPath))
        {
            _diagnosticReporter.ReportError(
                "BUILD002",
                $"Generated directory not found: {generatedPath}",
                null);
            return false;
        }

        var args = BuildCompilerArguments();
        
        if (_verbose)
        {
            Console.WriteLine($"[VERBOSE] TypeScript compiler: {tscPath}");
            Console.WriteLine($"[VERBOSE] Arguments: {args}");
            Console.WriteLine($"[VERBOSE] Working directory: {_config.ProjectRoot}");
        }
        
        var startInfo = new ProcessStartInfo
        {
            FileName = tscPath,
            Arguments = args,
            WorkingDirectory = _config.ProjectRoot,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using var process = Process.Start(startInfo);
        if (process == null)
        {
            _diagnosticReporter.ReportError("BUILD003", "Failed to start TypeScript compiler", null);
            return false;
        }

        if (_verbose) Console.WriteLine("[VERBOSE] Waiting for TypeScript compiler to finish...");
        var startTime = DateTime.UtcNow;
        
        // Stream output in real-time if verbose
        var outputBuilder = new System.Text.StringBuilder();
        var errorBuilder = new System.Text.StringBuilder();
        
        if (_verbose)
        {
            process.OutputDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    Console.WriteLine($"[TS] {e.Data}");
                    outputBuilder.AppendLine(e.Data);
                }
            };
            process.ErrorDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    Console.WriteLine($"[TS ERROR] {e.Data}");
                    errorBuilder.AppendLine(e.Data);
                }
            };
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();
        }
        else
        {
            // CRITICAL FIX: Read output asynchronously to prevent deadlock
            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorsTask = process.StandardError.ReadToEndAsync();
            
            process.WaitForExit();
            
            outputBuilder.Append(outputTask.Result);
            errorBuilder.Append(errorsTask.Result);
        }
        
        // Add timeout: 60 seconds for TypeScript compilation
        var timeout = TimeSpan.FromSeconds(60);
        if (!process.WaitForExit((int)timeout.TotalMilliseconds))
        {
            process.Kill(true);
            _diagnosticReporter.ReportError(
                "BUILD004",
                $"TypeScript compilation timed out after {timeout.TotalSeconds} seconds. This usually indicates a configuration issue with tsconfig.json or circular dependencies.",
                null);
            return false;
        }
        
        var duration = (DateTime.UtcNow - startTime).TotalSeconds;
        if (_verbose) Console.WriteLine($"[VERBOSE] TypeScript compilation took {duration:F2}s");
        
        var output = outputBuilder.ToString();
        var errors = errorBuilder.ToString();

        // TypeScript outputs errors to stdout, not stderr
        if (!string.IsNullOrWhiteSpace(output))
        {
            ParseTypeScriptDiagnostics(output);
        }

        if (!string.IsNullOrWhiteSpace(errors))
        {
            ParseTypeScriptDiagnostics(errors);
        }

        return process.ExitCode == 0;
    }

    private string? FindTypeScriptCompiler()
    {
        var paths = new[]
        {
            "tsc",
            "tsc.cmd",
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "npm", "tsc.cmd"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "npm", "tsc")
        };

        foreach (var path in paths)
        {
            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = path,
                    Arguments = "--version",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(startInfo);
                if (process != null)
                {
                    process.WaitForExit();
                    if (process.ExitCode == 0)
                    {
                        return path;
                    }
                }
            }
            catch
            {
                continue;
            }
        }

        return null;
    }

    private string BuildCompilerArguments()
    {
        var args = new List<string>();

        // Check if tsconfig.json exists in project root
        var tsconfigPath = Path.Combine(_config.ProjectRoot, "tsconfig.json");
        if (File.Exists(tsconfigPath))
        {
            // Use tsconfig.json with absolute path
            var absolutePath = Path.GetFullPath(tsconfigPath);
            args.Add($"--project \"{absolutePath}\"");
            return string.Join(" ", args);
        }

        // Fallback to manual configuration
        args.Add($"--outDir \"{_config.GetOutputPath()}\"");
        args.Add($"--rootDir \"{_config.GetGeneratedPath()}\"");
        args.Add("--target ES2022");
        args.Add("--module ESNext");
        args.Add("--moduleResolution bundler");
        args.Add("--esModuleInterop");
        args.Add("--skipLibCheck");
        args.Add("--strict false");

        if (_config.EnableSourceMaps)
        {
            args.Add("--sourceMap");
        }

        if (!_config.IsProduction)
        {
            args.Add("--declaration");
        }

        // Add all TypeScript files from generated directory
        var generatedPath = _config.GetGeneratedPath();
        var tsFiles = Directory.GetFiles(generatedPath, "*.ts", SearchOption.AllDirectories);
        foreach (var file in tsFiles)
        {
            args.Add($"\"{file}\"");
        }

        return string.Join(" ", args);
    }

    private void ParseTypeScriptDiagnostics(string errors)
    {
        var lines = errors.Split('\n', StringSplitOptions.RemoveEmptyEntries);
        foreach (var line in lines)
        {
            if (line.Contains("error TS"))
            {
                _diagnosticReporter.ReportError("TS", line.Trim(), null);
            }
        }
    }
}
