using System.CommandLine;
using System.Diagnostics;
using System.Net;
using System.Text;

namespace Soft.Compiler.CLI;

public class DevServerCommand : Command
{
    public DevServerCommand() : base("dev", "Start development server with hot reload")
    {
        var portOption = new Option<int>("--port", () => 3000, "Port to run server on");
        var openOption = new Option<bool>("--open", () => true, "Open browser automatically");
        
        AddOption(portOption);
        AddOption(openOption);
        
        this.SetHandler(async (port, open) =>
        {
            await StartDevServer(port, open);
        }, portOption, openOption);
    }
    
    private async Task StartDevServer(int port, bool openBrowser)
    {
        Console.WriteLine($"🚀 Starting Soft dev server on http://localhost:{port}");
        
        var listener = new HttpListener();
        listener.Prefixes.Add($"http://localhost:{port}/");
        listener.Start();
        
        // Watch for file changes
        var watcher = new FileSystemWatcher(Directory.GetCurrentDirectory())
        {
            Filter = "*.s",
            IncludeSubdirectories = true,
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName
        };
        
        watcher.Changed += async (s, e) => await OnFileChanged(e.FullPath);
        watcher.Created += async (s, e) => await OnFileChanged(e.FullPath);
        watcher.EnableRaisingEvents = true;
        
        // Initial build
        await BuildProject();
        
        if (openBrowser)
        {
            OpenBrowser($"http://localhost:{port}");
        }
        
        Console.WriteLine($"✅ Server running at http://localhost:{port}");
        Console.WriteLine($"📁 Watching for changes...");
        Console.WriteLine($"Press Ctrl+C to stop");
        
        // Handle requests
        while (true)
        {
            var context = await listener.GetContextAsync();
            _ = HandleRequest(context);
        }
    }
    
    private async Task HandleRequest(HttpListenerContext context)
    {
        var request = context.Request;
        var response = context.Response;
        
        var path = request.Url?.AbsolutePath ?? "/";
        
        try
        {
            if (path == "/")
            {
                path = "/index.html";
            }
            
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "public", path.TrimStart('/'));
            
            if (path.StartsWith("/dist/"))
            {
                filePath = Path.Combine(Directory.GetCurrentDirectory(), path.TrimStart('/'));
            }
            
            if (File.Exists(filePath))
            {
                var content = await File.ReadAllBytesAsync(filePath);
                response.ContentType = GetContentType(filePath);
                response.ContentLength64 = content.Length;
                await response.OutputStream.WriteAsync(content);
            }
            else
            {
                response.StatusCode = 404;
                var error = Encoding.UTF8.GetBytes("404 - Not Found");
                await response.OutputStream.WriteAsync(error);
            }
        }
        catch (Exception ex)
        {
            response.StatusCode = 500;
            var error = Encoding.UTF8.GetBytes($"500 - {ex.Message}");
            await response.OutputStream.WriteAsync(error);
        }
        finally
        {
            response.Close();
        }
    }
    
    private async Task OnFileChanged(string filePath)
    {
        Console.WriteLine($"📝 File changed: {Path.GetFileName(filePath)}");
        Console.WriteLine($"🔄 Rebuilding...");
        
        await Task.Delay(100); // Debounce
        await BuildProject();
        
        Console.WriteLine($"✅ Build complete");
    }
    
    private async Task BuildProject()
    {
        var buildCommand = new BuildCommand();
        // Execute build logic
        await Task.CompletedTask;
    }
    
    private string GetContentType(string path)
    {
        var ext = Path.GetExtension(path).ToLower();
        return ext switch
        {
            ".html" => "text/html",
            ".js" => "application/javascript",
            ".css" => "text/css",
            ".json" => "application/json",
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
    }
    
    private void OpenBrowser(string url)
    {
        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true
            });
        }
        catch
        {
            // Ignore if can't open browser
        }
    }
}
