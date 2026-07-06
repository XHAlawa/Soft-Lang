using Microsoft.Extensions.DependencyInjection;
using Soft.Compiler.DependencyInjection;
using Soft.Compiler.Diagnostics;

using Soft.Compiler.Parser;
using Soft.Compiler.Utilities;
using System.CommandLine;

namespace Soft.Compiler.CLI;

public sealed class ParseCommand : Command
{
    public ParseCommand() : base("parse", "Parse a Soft file and display extracted blocks")
    {
        var fileOption = new Option<string>(
            aliases: new[] { "--file", "-f" },
            description: "Path to the source file to parse");
        fileOption.IsRequired = true;

        AddOption(fileOption);

        this.SetHandler(Execute, fileOption);
    }

    private static void Execute(string filePath)
    {
        if (!File.Exists(filePath))
        {
            ConsoleUtilities.WriteError($"File not found: {filePath}");
            Environment.ExitCode = 1;
            return;
        }

        var serviceProvider = BuildServiceProvider();
        var parser = serviceProvider.GetRequiredService<IParser>();
        var diagnosticReporter = serviceProvider.GetRequiredService<IDiagnosticReporter>();

        diagnosticReporter.Clear();

        var source = File.ReadAllText(filePath);
        var softUnit = parser.Parse(source, filePath);

        ConsoleUtilities.WriteInfo($"Parsing: {filePath}");
        Console.WriteLine();

        ConsoleUtilities.WriteSuccess("Parse completed");
        Console.WriteLine($"File: {softUnit.FilePath}");
        Console.WriteLine($"Page Route: {softUnit.PageRoute ?? "N/A"}");
        Console.WriteLine($"Has Template: {softUnit.TemplateContent != null}");
        Console.WriteLine($"Has Style: {softUnit.StyleContent != null}");
        Console.WriteLine($"Has Code: {softUnit.CodeContent != null}");
        Console.WriteLine($"Decorators: {softUnit.Decorators.Count}");
        
        if (softUnit.Decorators.Any())
        {
            Console.WriteLine("\nDecorators:");
            foreach (var decorator in softUnit.Decorators)
            {
                var arg = decorator.Argument != null ? $"(\"{decorator.Argument}\")" : "";
                Console.WriteLine($"  @{decorator.Name}{arg} (line {decorator.Line})");
            }
        }

        var diagnostics = diagnosticReporter.GetDiagnostics();
        if (diagnostics.Count > 0)
        {
            Console.WriteLine();
            ConsoleUtilities.WriteDiagnostics(diagnostics);
        }

        if (diagnosticReporter.HasErrors)
        {
            Environment.ExitCode = 1;
        }
    }

    private static IServiceProvider BuildServiceProvider()
    {
        var services = new ServiceCollection();
        services.AddSoftCompiler();
        return services.BuildServiceProvider();
    }
}
