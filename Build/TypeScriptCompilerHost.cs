using System.Diagnostics;
using Soft.Compiler.Diagnostics;

namespace Soft.Compiler.Build;

public sealed class TypeScriptCompilerHost
{
    private readonly BuildConfiguration _config;
    private readonly IDiagnosticReporter _diagnosticReporter;

    public TypeScriptCompilerHost(BuildConfiguration config, IDiagnosticReporter diagnosticReporter)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _diagnosticReporter = diagnosticReporter ?? throw new ArgumentNullException(nameof(diagnosticReporter));
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

        var output = process.StandardOutput.ReadToEnd();
        var errors = process.StandardError.ReadToEnd();
        process.WaitForExit();

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
