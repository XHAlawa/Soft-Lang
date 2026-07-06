using System.CommandLine;
using Soft.Compiler.CLI;

var rootCommand = new RootCommand("Soft - TypeScript-first framework compiler");

// soft new <name>
var newCommand = new NewCommand();
rootCommand.AddCommand(newCommand);

// soft dev
var devCommand = new DevCommand();
rootCommand.AddCommand(devCommand);

// soft build
var buildCommand = new BuildCommand();
rootCommand.AddCommand(buildCommand);

// soft clean
var cleanCommand = new CleanCommand();
rootCommand.AddCommand(cleanCommand);

// soft parse <file>
var parseCommand = new ParseCommand();
rootCommand.AddCommand(parseCommand);

// soft add component <name>
var addCommand = new AddCommand();
rootCommand.AddCommand(addCommand);

return await rootCommand.InvokeAsync(args);
