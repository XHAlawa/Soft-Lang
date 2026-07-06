using Soft.Compiler.CLI;
using System.CommandLine;

namespace Soft.Compiler;

public static class Program
{
    public static async Task<int> Main(string[] args)
    {

#if DEBUG
        args.Append("build");
#endif
        var rootCommand = new RootCommand("Soft Compiler - A production-quality compiler for the Soft language");

        rootCommand.AddCommand(new BuildCommand());
        rootCommand.AddCommand(new WatchCommand());
        rootCommand.AddCommand(new DevCommand());
        rootCommand.AddCommand(new CleanCommand());
        rootCommand.AddCommand(new ParseCommand());
        // Deleted commands (old architecture):
        // - LexCommand (no longer need TypeScript lexer)
        // - RedTreeCommand, SemanticCommand, BindCommand
        // - DependencyCommand, IRCommand, EmitCommand

        return await rootCommand.InvokeAsync(args);
    }
}
