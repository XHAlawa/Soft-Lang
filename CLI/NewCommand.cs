using System.CommandLine;

namespace Soft.Compiler.CLI;

public class NewCommand : Command
{
    public NewCommand() : base("new", "Create a new Soft project")
    {
        var nameArg = new Argument<string>("name", "Project name");
        var templateOption = new Option<string>("--template", () => "default", "Project template");
        
        AddArgument(nameArg);
        AddOption(templateOption);
        
        this.SetHandler(async (name, template) =>
        {
            await CreateProject(name, template);
        }, nameArg, templateOption);
    }
    
    private async Task CreateProject(string name, string template)
    {
        Console.WriteLine($"Creating new Soft project: {name}");
        
        var projectDir = Path.Combine(Directory.GetCurrentDirectory(), name);
        
        if (Directory.Exists(projectDir))
        {
            Console.WriteLine($"Error: Directory '{name}' already exists");
            return;
        }
        
        Directory.CreateDirectory(projectDir);
        Directory.CreateDirectory(Path.Combine(projectDir, "src"));
        Directory.CreateDirectory(Path.Combine(projectDir, "public"));
        Directory.CreateDirectory(Path.Combine(projectDir, "generated"));
        
        // Create soft.json
        var config = $$"""
        {
          "name": "{{name}}",
          "version": "1.0.0",
          "outputDir": "generated",
          "entry": "src/App.s"
        }
        """;
        await File.WriteAllTextAsync(Path.Combine(projectDir, "soft.json"), config);
        
        // Create package.json
        var packageJson = $$"""
        {
          "name": "{{name}}",
          "version": "1.0.0",
          "type": "module",
          "scripts": {
            "dev": "soft dev",
            "build": "soft build"
          },
          "devDependencies": {
            "typescript": "^5.0.0",
            "esbuild": "^0.19.0"
          }
        }
        """;
        await File.WriteAllTextAsync(Path.Combine(projectDir, "package.json"), packageJson);
        
        // Create tsconfig.json
        var tsConfig = """
        {
          "compilerOptions": {
            "target": "ES2020",
            "module": "ES2020",
            "lib": ["ES2020", "DOM"],
            "outDir": "./dist",
            "strict": true,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "moduleResolution": "node"
          },
          "include": ["generated/**/*"],
          "exclude": ["node_modules"]
        }
        """;
        await File.WriteAllTextAsync(Path.Combine(projectDir, "tsconfig.json"), tsConfig);
        
        // Create index.html
        var indexHtml = $$"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{name}}</title>
        </head>
        <body>
            <div id="app"></div>
            <script type="module" src="/dist/App.js"></script>
        </body>
        </html>
        """;
        await File.WriteAllTextAsync(Path.Combine(projectDir, "public", "index.html"), indexHtml);
        
        // Create App.s
        var appContent = """
        @Page("/")
        @Template
        <div class="app">
            <h1>Welcome to Soft!</h1>
            <p>Edit src/App.s to get started</p>
            
            <button @click="increment()">
                Count: @(count)
            </button>
        </div>
        
        @Code
        export class App {
            @State
            count = 0;
            
            increment() {
                this.count++;
            }
        }
        
        @Style(scoped)
        .app {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            text-align: center;
            font-family: sans-serif;
        }
        
        h1 {
            color: #667eea;
        }
        
        button {
            padding: 1rem 2rem;
            font-size: 1.2rem;
            border: none;
            border-radius: 8px;
            background: #667eea;
            color: white;
            cursor: pointer;
        }
        
        button:hover {
            background: #5568d3;
        }
        """;
        await File.WriteAllTextAsync(Path.Combine(projectDir, "src", "App.s"), appContent);
        
        // Create README
        var readme = $$"""
        # {{name}}
        
        A Soft Framework project.
        
        ## Getting Started
        
        ```bash
        cd {{name}}
        npm install
        npm run dev
        ```
        
        ## Commands
        
        - `npm run dev` - Start development server
        - `npm run build` - Build for production
        
        ## Learn More
        
        - [Soft Documentation](https://soft-framework.dev)
        - [Examples](https://github.com/soft-framework/examples)
        """;
        await File.WriteAllTextAsync(Path.Combine(projectDir, "README.md"), readme);
        
        Console.WriteLine($"\n✅ Project created successfully!");
        Console.WriteLine($"\nNext steps:");
        Console.WriteLine($"  cd {name}");
        Console.WriteLine($"  soft dev");
        Console.WriteLine($"\nOr with npm:");
        Console.WriteLine($"  npm install");
        Console.WriteLine($"  npm run dev");
    }
}
