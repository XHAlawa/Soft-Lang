using System.Net;
using System.Text;

namespace Soft.Compiler.DevServer;

public sealed class HttpDevServer : IDisposable
{
    private readonly HttpListener _listener;
    private readonly string _rootPath;
    private readonly int _port;
    private CancellationTokenSource? _cts;
    private Task? _serverTask;
    private readonly List<HttpListenerResponse> _sseClients = new();
    private readonly object _sseLock = new();

    private static readonly Dictionary<string, string> MimeTypes = new()
    {
        { ".html", "text/html" },
        { ".css", "text/css" },
        { ".js", "application/javascript" },
        { ".mjs", "application/javascript" },
        { ".json", "application/json" },
        { ".map", "application/json" },
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".gif", "image/gif" },
        { ".svg", "image/svg+xml" },
        { ".ico", "image/x-icon" },
        { ".woff", "font/woff" },
        { ".woff2", "font/woff2" },
        { ".ttf", "font/ttf" }
    };

    public HttpDevServer(string rootPath, int port)
    {
        _rootPath = rootPath;
        _port = port;
        _listener = new HttpListener();
        _listener.Prefixes.Add($"http://localhost:{port}/");
        _listener.Prefixes.Add($"http://127.0.0.1:{port}/");
    }

    public void Start()
    {
        _cts = new CancellationTokenSource();
        _listener.Start();
        _serverTask = Task.Run(() => ListenAsync(_cts.Token));
    }

    public void Stop()
    {
        _cts?.Cancel();
        _listener.Stop();
        _serverTask?.Wait(TimeSpan.FromSeconds(2));
    }

    public void NotifyReload()
    {
        lock (_sseLock)
        {
            foreach (var client in _sseClients.ToList())
            {
                try
                {
                    var data = Encoding.UTF8.GetBytes("data: reload\n\n");
                    client.OutputStream.Write(data, 0, data.Length);
                    client.OutputStream.Flush();
                }
                catch
                {
                    _sseClients.Remove(client);
                }
            }
        }
    }

    private async Task ListenAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                var context = await _listener.GetContextAsync();
                _ = Task.Run(() => HandleRequestAsync(context), ct);
            }
            catch (HttpListenerException) when (ct.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Server error: {ex.Message}");
            }
        }
    }

    private async Task HandleRequestAsync(HttpListenerContext context)
    {
        var request = context.Request;
        var response = context.Response;

        try
        {
            var path = request.Url?.LocalPath ?? "/";
            
            // Handle SSE endpoint for live reload
            if (path == "/__soft_reload")
            {
                await HandleSseAsync(response);
                return;
            }

            // Serve static files
            await ServeStaticFileAsync(path, request, response);
        }
        catch (Exception ex)
        {
            response.StatusCode = 500;
            var errorBytes = Encoding.UTF8.GetBytes($"Internal Server Error: {ex.Message}");
            await response.OutputStream.WriteAsync(errorBytes);
        }
        finally
        {
            try { response.Close(); } catch { }
        }
    }

    private async Task HandleSseAsync(HttpListenerResponse response)
    {
        response.ContentType = "text/event-stream";
        response.Headers.Add("Cache-Control", "no-cache");
        response.Headers.Add("Connection", "keep-alive");
        response.Headers.Add("Access-Control-Allow-Origin", "*");

        lock (_sseLock)
        {
            _sseClients.Add(response);
        }

        // Keep connection open
        try
        {
            var pingData = Encoding.UTF8.GetBytes(": ping\n\n");
            while (true)
            {
                await Task.Delay(30000);
                await response.OutputStream.WriteAsync(pingData);
                await response.OutputStream.FlushAsync();
            }
        }
        catch
        {
            lock (_sseLock)
            {
                _sseClients.Remove(response);
            }
        }
    }

    private async Task ServeStaticFileAsync(string path, HttpListenerRequest request, HttpListenerResponse response)
    {
        // Default to index.html
        if (path == "/") path = "/index.html";

        var filePath = Path.Combine(_rootPath, path.TrimStart('/'));

        // Security: prevent directory traversal
        var fullPath = Path.GetFullPath(filePath);
        if (!fullPath.StartsWith(Path.GetFullPath(_rootPath)))
        {
            response.StatusCode = 403;
            return;
        }

        if (!File.Exists(filePath))
        {
            // SPA fallback: serve index.html for HTML requests (Accept header) or paths without file extensions
            var indexPath = Path.Combine(_rootPath, "index.html");
            var acceptHeader = request.Headers["Accept"] ?? "";
            var isHtmlRequest = acceptHeader.Contains("text/html");
            var hasNoExtension = !Path.HasExtension(path);
            
            if (File.Exists(indexPath) && (isHtmlRequest || hasNoExtension))
            {
                filePath = indexPath;
            }
            else
            {
                response.StatusCode = 404;
                var notFoundBytes = Encoding.UTF8.GetBytes("Not Found");
                await response.OutputStream.WriteAsync(notFoundBytes);
                return;
            }
        }

        var ext = Path.GetExtension(filePath).ToLowerInvariant();
        response.ContentType = MimeTypes.GetValueOrDefault(ext, "application/octet-stream");
        
        // Add live reload script to HTML files
        if (ext == ".html")
        {
            var html = await File.ReadAllTextAsync(filePath);
            html = InjectLiveReloadScript(html);
            var htmlBytes = Encoding.UTF8.GetBytes(html);
            response.ContentLength64 = htmlBytes.Length;
            await response.OutputStream.WriteAsync(htmlBytes);
        }
        else
        {
            var fileBytes = await File.ReadAllBytesAsync(filePath);
            response.ContentLength64 = fileBytes.Length;
            await response.OutputStream.WriteAsync(fileBytes);
        }
    }

    private string InjectLiveReloadScript(string html)
    {
        var script = @"
<script>
(function() {
    const evtSource = new EventSource('/__soft_reload');
    evtSource.onmessage = function(e) {
        if (e.data === 'reload') {
            console.log('[Soft] Reloading...');
            location.reload();
        }
    };
    evtSource.onerror = function() {
        console.log('[Soft] Live reload disconnected');
    };
})();
</script>
</body>";
        
        return html.Replace("</body>", script);
    }

    public void Dispose()
    {
        Stop();
        _listener.Close();
        _cts?.Dispose();
    }
}
