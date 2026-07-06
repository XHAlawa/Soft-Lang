using Microsoft.Extensions.DependencyInjection;
using Soft.Compiler.Build;
using Soft.Compiler.DependencyInjection;
using Soft.Compiler.DevServer;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Utilities;
using System.CommandLine;

namespace Soft.Compiler.CLI;

public sealed class WatchCommand : Command
{
    public WatchCommand() : base("watch", "Watch for file changes and rebuild")
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
        var serviceProvider = BuildServiceProvider();
        var diagnosticReporter = serviceProvider.GetRequiredService<IDiagnosticReporter>();
        var componentRegistry = serviceProvider.GetRequiredService<Soft.Compiler.Components.ComponentRegistry>();

        var config = SoftConfigLoader.LoadFromProject(projectRoot);

        ConsoleUtilities.WriteInfo($"Watching Soft project: {projectRoot}");
        Console.WriteLine();

        using var server = new Soft.Compiler.DevServer.DevServer(
            config,
            diagnosticReporter,
            componentRegistry,
            OnBuildComplete,
            enableWatch: true);

        server.Start();

        Console.WriteLine();
        ConsoleUtilities.WriteInfo("Press Ctrl+C to stop");
        Console.ReadLine();

        server.Stop();
    }

    private static void OnBuildComplete(BuildResult result)
    {
        if (result.Diagnostics.Count > 0)
        {
            ConsoleUtilities.WriteDiagnostics(result.Diagnostics);
        }

        if (result.Success)
        {
            ConsoleUtilities.WriteSuccess($"Build completed at {DateTime.Now:HH:mm:ss}");
        }
        else
        {
            ConsoleUtilities.WriteError($"Build failed at {DateTime.Now:HH:mm:ss}");
        }
    }

    private static IServiceProvider BuildServiceProvider()
    {
        var services = new ServiceCollection();
        services.AddSoftCompiler();
        return services.BuildServiceProvider();
    }
}
