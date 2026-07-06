using Soft.Compiler.Diagnostics;
using Soft.Compiler.Models;

namespace Soft.Compiler.Build;

public sealed class BuildResult
{
    public bool Success { get; }
    public int FilesProcessed { get; }
    public int FilesGenerated { get; }
    public TimeSpan Duration { get; }
    public IReadOnlyList<Diagnostic> Diagnostics { get; }
    public long BundleSizeBytes { get; }

    public BuildResult(
        bool success,
        int filesProcessed,
        int filesGenerated,
        TimeSpan duration,
        IReadOnlyList<Diagnostic> diagnostics,
        long bundleSizeBytes = 0)
    {
        Success = success;
        FilesProcessed = filesProcessed;
        FilesGenerated = filesGenerated;
        Duration = duration;
        Diagnostics = diagnostics ?? throw new ArgumentNullException(nameof(diagnostics));
        BundleSizeBytes = bundleSizeBytes;
    }

    public string GetBundleSizeFormatted()
    {
        if (BundleSizeBytes == 0) return "N/A";
        if (BundleSizeBytes < 1024) return $"{BundleSizeBytes} B";
        if (BundleSizeBytes < 1024 * 1024) return $"{BundleSizeBytes / 1024.0:F1} KB";
        return $"{BundleSizeBytes / (1024.0 * 1024.0):F2} MB";
    }
}
