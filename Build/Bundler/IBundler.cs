namespace Soft.Compiler.Build.Bundler;

public interface IBundler
{
    Task<BundleResult> BundleAsync(BundleOptions options);
    bool IsAvailable();
    string Name { get; }
}

public sealed class BundleOptions
{
    public required string EntryPoint { get; init; }
    public required string OutputDirectory { get; init; }
    public required string OutputFileName { get; init; }
    public bool Minify { get; init; }
    public bool SourceMaps { get; init; }
    public bool Watch { get; init; }
    public string? PublicPath { get; init; }
}

public sealed class BundleResult
{
    public bool Success { get; init; }
    public string? OutputPath { get; init; }
    public string? Error { get; init; }
    public long BundleSizeBytes { get; init; }
    public TimeSpan Duration { get; init; }
    public List<string> Warnings { get; init; } = new();
}
