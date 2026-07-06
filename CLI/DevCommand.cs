using Microsoft.Extensions.DependencyInjection;
using Soft.Compiler.Build;
using Soft.Compiler.DependencyInjection;
using Soft.Compiler.DevServer;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Utilities;
using System.CommandLine;
using System.Diagnostics;

namespace Soft.Compiler.CLI;

public sealed class DevCommand : Command
{
    public DevCommand() : base("dev", "Start development server with watch, compile, bundle, and live reload")
    {
        var projectOption = new Option<string>(
            aliases: new[] { "--project", "-p" },
            description: "Project root directory",
            getDefaultValue: () => Directory.GetCurrentDirectory());

        var portOption = new Option<int>(
            aliases: new[] { "--port" },
            description: "Dev server port",
            getDefaultValue: () => 3000);

        var openOption = new Option<bool>(
            aliases: new[] { "--open", "-o" },
            description: "Open browser automatically",
            getDefaultValue: () => true);

        var autocloseOption = new Option<int>(
            aliases: new[] { "--autoclose" },
            description: "Auto-close server after N seconds of inactivity (0 = disabled)",
            getDefaultValue: () => 20);

        AddOption(projectOption);
        AddOption(portOption);
        AddOption(openOption);
        AddOption(autocloseOption);

        this.SetHandler(Execute, projectOption, portOption, openOption, autocloseOption);
    }

    private static void Execute(string projectRoot, int port, bool openBrowser, int autocloseSeconds)
    {
        var serviceProvider = BuildServiceProvider();
        var diagnosticReporter = serviceProvider.GetRequiredService<IDiagnosticReporter>();

        var config = SoftConfigLoader.LoadFromProject(projectRoot);

        Console.WriteLine();
        ConsoleUtilities.WriteInfo("╔═══════════════════════════════════════════╗");
        ConsoleUtilities.WriteInfo("║           Soft Development Server         ║");
        ConsoleUtilities.WriteInfo("╚═══════════════════════════════════════════╝");
        Console.WriteLine();
        ConsoleUtilities.WriteInfo($"  Project: {projectRoot}");
        ConsoleUtilities.WriteInfo($"  Server:  http://localhost:{port}");
        Console.WriteLine();

        // Initial build
        ConsoleUtilities.WriteInfo("Building...");
        var pipeline = new BuildPipeline(config, diagnosticReporter);
        var result = pipeline.Build();

        PrintBuildResult(result);

        if (!result.Success)
        {
            ConsoleUtilities.WriteError("Initial build failed. Fix errors and save to retry.");
        }

        // Start HTTP server serving from dist/
        var distPath = config.GetOutputPath();
        Directory.CreateDirectory(distPath);
        
        using var httpServer = new HttpDevServer(distPath, port);
        httpServer.Start();

        ConsoleUtilities.WriteSuccess($"Server running at http://localhost:{port}");
        Console.WriteLine();

        // Open browser
        if (openBrowser && result.Success)
        {
            OpenBrowser($"http://localhost:{port}");
        }

        // Start file watcher
        var sourcePath = config.GetSourcePath();
        if (Directory.Exists(sourcePath))
        {
            // Auto-close tracking
            var lastActivity = DateTime.UtcNow;
            var autocloseMs = autocloseSeconds > 0 ? autocloseSeconds * 1000 : 0;

            using var watcher = new FileWatcher(sourcePath, filePath =>
            {
                lastActivity = DateTime.UtcNow;
                Console.WriteLine();
                ConsoleUtilities.WriteInfo($"File changed: {Path.GetFileName(filePath)}");
                ConsoleUtilities.WriteInfo("Rebuilding...");

                diagnosticReporter.Clear();
                var rebuildResult = pipeline.Build();
                PrintBuildResult(rebuildResult);

                if (rebuildResult.Success)
                {
                    httpServer.NotifyReload();
                    ConsoleUtilities.WriteSuccess("Browser reloaded");
                }
            }, ".s");

            watcher.Start();

            Console.WriteLine();
            if (autocloseSeconds > 0)
            {
                ConsoleUtilities.WriteInfo($"Watching for changes... (Auto-close after {autocloseSeconds}s inactivity, Ctrl+C to stop)");
            }
            else
            {
                ConsoleUtilities.WriteInfo("Watching for changes... (Press Ctrl+C to stop)");
            }
            Console.WriteLine();

            // Wait for Ctrl+C or auto-close timeout
            var exitEvent = new ManualResetEvent(false);
            Console.CancelKeyPress += (_, e) =>
            {
                e.Cancel = true;
                exitEvent.Set();
            };

            if (autocloseSeconds > 0)
            {
                var timer = new System.Threading.Timer(_ =>
                {
                    var idle = (DateTime.UtcNow - lastActivity).TotalMilliseconds;
                    if (idle >= autocloseMs)
                    {
                        ConsoleUtilities.WriteInfo($"Auto-close: {autocloseSeconds}s of inactivity reached. Shutting down.");
                        exitEvent.Set();
                    }
                }, null, 1000, 1000);

                exitEvent.WaitOne();
                timer.Dispose();
            }
            else
            {
                exitEvent.WaitOne();
            }

            watcher.Stop();
        }
        else
        {
            ConsoleUtilities.WriteWarning($"Source directory not found: {sourcePath}");
            Console.ReadLine();
        }

        httpServer.Stop();
        Console.WriteLine();
        ConsoleUtilities.WriteInfo("Server stopped");
    }

    private static void PrintBuildResult(BuildResult result)
    {
        if (result.Diagnostics.Count > 0)
        {
            Console.WriteLine();
            ConsoleUtilities.WriteDiagnostics(result.Diagnostics);
        }

        if (result.Success)
        {
            Console.WriteLine();
            Console.WriteLine($"  Files: {result.FilesProcessed} processed, {result.FilesGenerated} generated");
            Console.WriteLine($"  Bundle: {result.GetBundleSizeFormatted()}");
            Console.WriteLine($"  Time: {result.Duration.TotalMilliseconds:F0}ms");
            Console.WriteLine();
        }
    }

    private static void OpenBrowser(string url)
    {
        try
        {
            var psi = new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true
            };
            Process.Start(psi);
        }
        catch
        {
            // Ignore browser open failures
        }
    }

    private static IServiceProvider BuildServiceProvider()
    {
        var services = new ServiceCollection();
        services.AddSoftCompiler();
        return services.BuildServiceProvider();
    }
}
