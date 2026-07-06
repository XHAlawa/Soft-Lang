using System.Diagnostics;
using System.Text.Json;

namespace Soft.Compiler.Build.Bundler;

public sealed class EsbuildBundler : IBundler
{
    public string Name => "esbuild";

    public bool IsAvailable()
    {
        return FindEsbuild() != null;
    }

    public async Task<BundleResult> BundleAsync(BundleOptions options)
    {
        var stopwatch = Stopwatch.StartNew();
        
        var esbuildPath = FindEsbuild();
        if (esbuildPath == null)
        {
            return new BundleResult
            {
                Success = false,
                Error = "esbuild not found. Install with: npm install -g esbuild",
                Duration = stopwatch.Elapsed
            };
        }

        Directory.CreateDirectory(options.OutputDirectory);

        var args = BuildArguments(options);
        
        var startInfo = new ProcessStartInfo
        {
            FileName = esbuildPath,
            Arguments = args,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        try
        {
            using var process = Process.Start(startInfo);
            if (process == null)
            {
                return new BundleResult
                {
                    Success = false,
                    Error = "Failed to start esbuild process",
                    Duration = stopwatch.Elapsed
                };
            }

            var output = await process.StandardOutput.ReadToEndAsync();
            var errors = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();

            stopwatch.Stop();

            var outputPath = Path.Combine(options.OutputDirectory, options.OutputFileName);
            var bundleSize = File.Exists(outputPath) ? new FileInfo(outputPath).Length : 0;

            var warnings = new List<string>();
            if (!string.IsNullOrWhiteSpace(output))
            {
                warnings.AddRange(output.Split('\n', StringSplitOptions.RemoveEmptyEntries));
            }

            if (process.ExitCode != 0)
            {
                return new BundleResult
                {
                    Success = false,
                    Error = errors,
                    Duration = stopwatch.Elapsed,
                    Warnings = warnings
                };
            }

            return new BundleResult
            {
                Success = true,
                OutputPath = outputPath,
                BundleSizeBytes = bundleSize,
                Duration = stopwatch.Elapsed,
                Warnings = warnings
            };
        }
        catch (Exception ex)
        {
            return new BundleResult
            {
                Success = false,
                Error = ex.Message,
                Duration = stopwatch.Elapsed
            };
        }
    }

    private string? FindEsbuild()
    {
        var candidates = new[]
        {
            "esbuild",
            "esbuild.cmd",
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "npm", "esbuild.cmd"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "npm", "esbuild"),
            // Local node_modules
            Path.Combine("node_modules", ".bin", "esbuild"),
            Path.Combine("node_modules", ".bin", "esbuild.cmd")
        };

        foreach (var candidate in candidates)
        {
            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = candidate,
                    Arguments = "--version",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(startInfo);
                if (process != null)
                {
                    process.WaitForExit(5000);
                    if (process.ExitCode == 0)
                    {
                        return candidate;
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

    private string BuildArguments(BundleOptions options)
    {
        var args = new List<string>
        {
            $"\"{options.EntryPoint}\"",
            "--bundle",
            $"--outfile=\"{Path.Combine(options.OutputDirectory, options.OutputFileName)}\"",
            "--format=esm",
            "--platform=browser",
            "--target=es2020",
            "--external:./router.js"
        };

        if (options.Minify)
        {
            args.Add("--minify");
        }

        if (options.SourceMaps)
        {
            args.Add("--sourcemap");
        }

        return string.Join(" ", args);
    }
}
