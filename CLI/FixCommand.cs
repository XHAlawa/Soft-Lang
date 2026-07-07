using System.CommandLine;

namespace Soft.Compiler.CLI;

public class FixCommand : Command
{
    public FixCommand() : base("fix", "Fix existing projects to work with latest compiler version")
    {
        this.SetHandler(async () =>
        {
            await FixProject();
        });
    }
    
    private async Task FixProject()
    {
        var currentDir = Directory.GetCurrentDirectory();
        
        Console.WriteLine("🔧 Fixing project for Soft v1.0.3+...\n");
        
        // Check if this is a Soft project
        var generatedPath = Path.Combine(currentDir, "generated");
        if (!Directory.Exists(generatedPath))
        {
            Console.WriteLine("❌ Error: Not a Soft project (no 'generated' folder found)");
            Console.WriteLine("   Run this command from your project root directory.");
            return;
        }
        
        // Find router.d.ts in compiler installation
        var possiblePaths = new[]
        {
            Path.Combine(AppContext.BaseDirectory, "Runtime", "router.d.ts"),
            Path.Combine(Directory.GetCurrentDirectory(), "Runtime", "router.d.ts"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "Runtime", "router.d.ts")
        };
        
        string? sourceFile = null;
        foreach (var path in possiblePaths)
        {
            if (File.Exists(path))
            {
                sourceFile = path;
                break;
            }
        }
        
        if (sourceFile == null)
        {
            Console.WriteLine("❌ Error: Could not find router.d.ts in compiler installation");
            Console.WriteLine("   Please reinstall the Soft compiler.");
            return;
        }
        
        // Copy router.d.ts to generated folder
        var destFile = Path.Combine(generatedPath, "router.d.ts");
        File.Copy(sourceFile, destFile, overwrite: true);
        
        Console.WriteLine("✅ Fixed! Copied router.d.ts to generated folder");
        Console.WriteLine($"   Source: {sourceFile}");
        Console.WriteLine($"   Destination: {destFile}");
        
        // Also copy to dist if it exists
        var distPath = Path.Combine(currentDir, "dist");
        if (Directory.Exists(distPath))
        {
            var distDestFile = Path.Combine(distPath, "router.d.ts");
            File.Copy(sourceFile, distDestFile, overwrite: true);
            Console.WriteLine($"   Also copied to: {distDestFile}");
        }
        
        Console.WriteLine("\n✅ Project fixed! You can now run:");
        Console.WriteLine("   soft dev");
        Console.WriteLine("   soft build");
    }
}
