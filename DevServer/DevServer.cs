using Soft.Compiler.Build;
using Soft.Compiler.Components;
using Soft.Compiler.Diagnostics;

namespace Soft.Compiler.DevServer;

public sealed class DevServer : IDisposable
{
    private readonly BuildConfiguration _config;
    private readonly IncrementalBuilder _builder;
    private readonly FileWatcher? _watcher;
    private readonly Action<BuildResult> _onBuildComplete;

    public DevServer(
        BuildConfiguration config,
        IDiagnosticReporter diagnosticReporter,
        ComponentRegistry componentRegistry,
        Action<BuildResult> onBuildComplete,
        bool enableWatch = true)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _onBuildComplete = onBuildComplete ?? throw new ArgumentNullException(nameof(onBuildComplete));

        _builder = new IncrementalBuilder(config, diagnosticReporter, componentRegistry);

        if (enableWatch)
        {
            var sourcePath = _config.GetSourcePath();
            if (Directory.Exists(sourcePath))
            {
                _watcher = new FileWatcher(sourcePath, OnFileChanged, ".s");
            }
        }
    }

    public void Start()
    {
        var sourcePath = _config.GetSourcePath();
        if (!Directory.Exists(sourcePath))
        {
            Console.WriteLine($"Source directory not found: {sourcePath}");
            return;
        }

        var sourceFiles = Directory.GetFiles(sourcePath, "*.s", SearchOption.AllDirectories);
        
        Console.WriteLine($"Building {sourceFiles.Length} file(s)...");
        
        foreach (var file in sourceFiles)
        {
            var result = _builder.BuildFile(file);
            _onBuildComplete(result);
        }

        _watcher?.Start();
        Console.WriteLine("Watching for changes...");
    }

    public void Stop()
    {
        _watcher?.Stop();
    }

    private void OnFileChanged(string filePath)
    {
        Console.WriteLine($"File changed: {Path.GetFileName(filePath)}");
        Console.WriteLine("Rebuilding...");

        var result = _builder.BuildFile(filePath);
        _onBuildComplete(result);

        if (result.Success)
        {
            Console.WriteLine("Build succeeded");
        }
        else
        {
            Console.WriteLine("Build failed");
        }
    }

    public void Dispose()
    {
        _watcher?.Dispose();
    }
}
