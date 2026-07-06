namespace Soft.Compiler.Build;

public sealed class BuildConfiguration
{
    public string ProjectRoot { get; }
    public string SourceDirectory { get; }
    public string GeneratedDirectory { get; }
    public string OutputDirectory { get; }
    public string? MainFile { get; }
    public bool IsProduction { get; }
    public bool EnableSourceMaps { get; }

    public BuildConfiguration(
        string projectRoot,
        string sourceDirectory = "src",
        string generatedDirectory = "generated",
        string outputDirectory = "dist",
        string? mainFile = null,
        bool isProduction = false,
        bool enableSourceMaps = true)
    {
        ProjectRoot = projectRoot ?? throw new ArgumentNullException(nameof(projectRoot));
        SourceDirectory = sourceDirectory ?? "src";
        GeneratedDirectory = generatedDirectory ?? "generated";
        OutputDirectory = outputDirectory ?? "dist";
        MainFile = mainFile;
        IsProduction = isProduction;
        EnableSourceMaps = enableSourceMaps;
    }

    public string GetSourcePath() => Path.Combine(ProjectRoot, SourceDirectory);
    public string GetGeneratedPath() => Path.Combine(ProjectRoot, GeneratedDirectory);
    public string GetOutputPath() => Path.Combine(ProjectRoot, OutputDirectory);
}
