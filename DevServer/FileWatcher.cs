namespace Soft.Compiler.DevServer;

public sealed class FileWatcher : IDisposable
{
    private readonly FileSystemWatcher _watcher;
    private readonly HashSet<string> _watchedExtensions;
    private readonly Action<string> _onChange;

    public FileWatcher(string path, Action<string> onChange, params string[] extensions)
    {
        _onChange = onChange ?? throw new ArgumentNullException(nameof(onChange));
        _watchedExtensions = new HashSet<string>(extensions, StringComparer.OrdinalIgnoreCase);

        _watcher = new FileSystemWatcher(path)
        {
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName,
            IncludeSubdirectories = true
        };

        _watcher.Changed += OnFileChanged;
        _watcher.Created += OnFileChanged;
        _watcher.Deleted += OnFileChanged;
        _watcher.Renamed += OnFileRenamed;
    }

    public void Start()
    {
        _watcher.EnableRaisingEvents = true;
    }

    public void Stop()
    {
        _watcher.EnableRaisingEvents = false;
    }

    private void OnFileChanged(object sender, FileSystemEventArgs e)
    {
        if (ShouldWatch(e.FullPath))
        {
            _onChange(e.FullPath);
        }
    }

    private void OnFileRenamed(object sender, RenamedEventArgs e)
    {
        if (ShouldWatch(e.FullPath))
        {
            _onChange(e.FullPath);
        }
    }

    private bool ShouldWatch(string path)
    {
        var ext = Path.GetExtension(path);
        return _watchedExtensions.Contains(ext);
    }

    public void Dispose()
    {
        _watcher?.Dispose();
    }
}
