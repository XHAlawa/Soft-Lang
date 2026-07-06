using System.CommandLine;

namespace Soft.Compiler.CLI;

public class AddCommand : Command
{
    public AddCommand() : base("add", "Add a new component or feature")
    {
        var componentCommand = new Command("component", "Add a new component");
        var nameArg = new Argument<string>("name", "Component name");
        componentCommand.AddArgument(nameArg);
        
        componentCommand.SetHandler(async (name) =>
        {
            await AddComponent(name);
        }, nameArg);
        
        AddCommand(componentCommand);
    }
    
    private async Task AddComponent(string name)
    {
        Console.WriteLine($"Creating component: {name}");
        
        var srcDir = Path.Combine(Directory.GetCurrentDirectory(), "src");
        if (!Directory.Exists(srcDir))
        {
            Console.WriteLine("Error: Not in a Soft project directory");
            return;
        }
        
        var componentPath = Path.Combine(srcDir, $"{name}.s");
        
        if (File.Exists(componentPath))
        {
            Console.WriteLine($"Error: Component '{name}' already exists");
            return;
        }
        
        var template = $$"""
        @Template
        <div class="{{name.ToLower()}}">
            <h2>{{name}} Component</h2>
            <p>@(message)</p>
        </div>
        
        @Code
        export class {{name}} {
            @Prop({ required: true })
            message: string;
        }
        
        @Style(scoped)
        .{{name.ToLower()}} {
            padding: 1rem;
        }
        """;
        
        await File.WriteAllTextAsync(componentPath, template);
        
        Console.WriteLine($"✅ Component created: src/{name}.s");
        Console.WriteLine($"\nImport it in your app:");
        Console.WriteLine($"@importComponent");
        Console.WriteLine($"import {name} from './{name}.s';");
    }
}
