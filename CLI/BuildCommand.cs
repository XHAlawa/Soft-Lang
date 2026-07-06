using Microsoft.Extensions.DependencyInjection;
using Soft.Compiler.Build;
using Soft.Compiler.DependencyInjection;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Utilities;
using System.CommandLine;

namespace Soft.Compiler.CLI;

public sealed class BuildCommand : Command
{
    public BuildCommand() : base("build", "Build the Soft project for production")
    {
        var projectOption = new Option<string>(
            aliases: new[] { "--project", "-p" },
            description: "Project root directory",
            getDefaultValue: () => GetDefaultProjectPath());

        var prodOption = new Option<bool>(
            aliases: new[] { "--production", "--prod" },
            description: "Build for production (minified)",
            getDefaultValue: () => GetDefaultProductionMode());

        var verboseOption = new Option<bool>(
            aliases: new[] { "--verbose", "-v", "--log" },
            description: "Show detailed build logging",
            getDefaultValue: () => false);

        AddOption(projectOption);
        AddOption(prodOption);
        AddOption(verboseOption);

        this.SetHandler(Execute, projectOption, prodOption, verboseOption);
    }

    private static void Execute(string projectRoot, bool isProduction, bool verbose)
    {
        // Interactive project selection if current directory has no src folder
        if (projectRoot == Directory.GetCurrentDirectory())
        {
            var srcPath = Path.Combine(projectRoot, "src");
            if (!Directory.Exists(srcPath))
            {
                var selectedProject = PromptForProject(projectRoot);
                if (selectedProject == null)
                {
                    ConsoleUtilities.WriteError("No project selected. Exiting.");
                    Environment.ExitCode = 1;
                    return;
                }
                projectRoot = selectedProject;
            }
        }

        // Enable verbose logging
        if (verbose)
        {
            Environment.SetEnvironmentVariable("SOFT_VERBOSE", "1");
        }

        var serviceProvider = BuildServiceProvider();
        var diagnosticReporter = serviceProvider.GetRequiredService<IDiagnosticReporter>();

        var config = SoftConfigLoader.LoadFromProject(
            projectRoot,
            isProduction: isProduction,
            enableSourceMaps: !isProduction);

        Console.WriteLine();
        ConsoleUtilities.WriteInfo("╔═══════════════════════════════════════════╗");
        ConsoleUtilities.WriteInfo($"║        Soft Build ({(isProduction ? "Production" : "Development ")})          ║");
        ConsoleUtilities.WriteInfo("╚═══════════════════════════════════════════╝");
        Console.WriteLine();
        ConsoleUtilities.WriteInfo($"  Project: {projectRoot}");
        if (verbose)
        {
            Console.WriteLine($"  Source:  {config.GetSourcePath()}");
            Console.WriteLine($"  Generated: {config.GetGeneratedPath()}");
            Console.WriteLine($"  Output:  {config.GetOutputPath()}");
        }
        Console.WriteLine();

        if (verbose) Console.WriteLine("[VERBOSE] Starting build pipeline...");
        
        var pipeline = new BuildPipeline(config, diagnosticReporter);
        
        if (verbose) Console.WriteLine("[VERBOSE] Executing build...");
        var result = pipeline.Build();

        if (verbose)
        {
            Console.WriteLine($"[VERBOSE] Build completed: Success={result.Success}");
            Console.WriteLine($"[VERBOSE] Files processed: {result.FilesProcessed}");
            Console.WriteLine($"[VERBOSE] Diagnostics count: {result.Diagnostics.Count}");
        }

        if (result.Diagnostics.Count > 0)
        {
            ConsoleUtilities.WriteDiagnostics(result.Diagnostics);
            Console.WriteLine();
        }

        if (result.Success)
        {
            Console.WriteLine();
            Console.WriteLine($"  Files processed: {result.FilesProcessed}");
            Console.WriteLine($"  Files generated: {result.FilesGenerated}");
            Console.WriteLine($"  Bundle size:     {result.GetBundleSizeFormatted()}");
            Console.WriteLine($"  Duration:        {result.Duration.TotalSeconds:F2}s");
            Console.WriteLine();
            Console.WriteLine($"  Output: {config.GetOutputPath()}");
            Console.WriteLine();
            ConsoleUtilities.WriteSuccess("Build completed successfully");
        }
        else
        {
            ConsoleUtilities.WriteError("Build failed");
            Environment.ExitCode = 1;
        }
    }

    private static string? PromptForProject(string currentDir)
    {
        Console.WriteLine();
        ConsoleUtilities.WriteInfo("No Soft project found in current directory.");
        Console.WriteLine();
        
        // Look for example projects
        var examplesDir = Path.Combine(currentDir, "examples");
        if (Directory.Exists(examplesDir))
        {
            var projects = Directory.GetDirectories(examplesDir)
                .Where(d => Directory.Exists(Path.Combine(d, "src")))
                .ToList();

            if (projects.Count > 0)
            {
                ConsoleUtilities.WriteInfo("Available projects:");
                Console.WriteLine();
                
                for (int i = 0; i < projects.Count; i++)
                {
                    var projectName = Path.GetFileName(projects[i]);
                    var srcFiles = Directory.GetFiles(Path.Combine(projects[i], "src"), "*.s", SearchOption.AllDirectories);
                    Console.WriteLine($"  [{i + 1}] {projectName} ({srcFiles.Length} file(s))");
                }
                
                Console.WriteLine($"  [0] Cancel");
                Console.WriteLine();
                Console.Write("Select project number: ");
                
                var input = Console.ReadLine();
                if (int.TryParse(input, out int selection))
                {
                    if (selection == 0)
                    {
                        return null;
                    }
                    
                    if (selection > 0 && selection <= projects.Count)
                    {
                        var selectedProject = projects[selection - 1];
                        ConsoleUtilities.WriteSuccess($"Selected: {Path.GetFileName(selectedProject)}");
                        return selectedProject;
                    }
                }
                
                ConsoleUtilities.WriteError("Invalid selection.");
                return null;
            }
        }
        
        ConsoleUtilities.WriteWarning("No Soft projects found.");
        Console.WriteLine("Please specify a project directory with --project or -p");
        return null;
    }

    private static string GetDefaultProjectPath()
    {
#if DEBUG
        // In debug mode, default to todo-app example
        var todoAppPath = @"D:\soft\examples\todo-app";
        if (Directory.Exists(todoAppPath))
        {
            return todoAppPath;
        }
#endif
        return Directory.GetCurrentDirectory();
    }

    private static bool GetDefaultProductionMode()
    {
#if DEBUG
        // In debug mode, default to development build
        return false;
#else
        return true;
#endif
    }

    private static IServiceProvider BuildServiceProvider()
    {
        var services = new ServiceCollection();
        services.AddSoftCompiler();
        return services.BuildServiceProvider();
    }
}
