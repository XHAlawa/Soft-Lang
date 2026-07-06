using Soft.Compiler.Build;
using Soft.Compiler.Utilities;
using System.CommandLine;

namespace Soft.Compiler.CLI;

public sealed class CleanCommand : Command
{
    public CleanCommand() : base("clean", "Remove generated and dist folders")
    {
        var projectOption = new Option<string>(
            aliases: new[] { "--project", "-p" },
            description: "Project root directory",
            getDefaultValue: () => Directory.GetCurrentDirectory());

        AddOption(projectOption);

        this.SetHandler(Execute, projectOption);
    }

    private static void Execute(string projectRoot)
    {
        var config = SoftConfigLoader.LoadFromProject(projectRoot);

        Console.WriteLine();
        ConsoleUtilities.WriteInfo("Cleaning build artifacts...");
        Console.WriteLine();

        var generatedPath = config.GetGeneratedPath();
        var outputPath = config.GetOutputPath();

        int deletedDirs = 0;

        if (Directory.Exists(generatedPath))
        {
            var fileCount = Directory.GetFiles(generatedPath, "*", SearchOption.AllDirectories).Length;
            Directory.Delete(generatedPath, recursive: true);
            Console.WriteLine($"  Removed: generated/ ({fileCount} files)");
            deletedDirs++;
        }
        else
        {
            Console.WriteLine($"  Skipped: generated/ (not found)");
        }

        if (Directory.Exists(outputPath))
        {
            var fileCount = Directory.GetFiles(outputPath, "*", SearchOption.AllDirectories).Length;
            Directory.Delete(outputPath, recursive: true);
            Console.WriteLine($"  Removed: dist/ ({fileCount} files)");
            deletedDirs++;
        }
        else
        {
            Console.WriteLine($"  Skipped: dist/ (not found)");
        }

        Console.WriteLine();
        if (deletedDirs > 0)
        {
            ConsoleUtilities.WriteSuccess("Clean completed");
        }
        else
        {
            ConsoleUtilities.WriteInfo("Nothing to clean");
        }
    }
}
