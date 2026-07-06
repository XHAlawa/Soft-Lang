using Soft.Compiler.Build;
using Soft.Compiler.Components;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Emit;
using Soft.Compiler.Parser;

namespace Soft.Compiler.DevServer;

public sealed class IncrementalBuilder
{
    private readonly BuildConfiguration _config;
    private readonly IDiagnosticReporter _diagnosticReporter;
    private readonly ComponentRegistry _componentRegistry;
    private readonly Dictionary<string, DateTime> _fileTimestamps = new();
    private readonly Dictionary<string, string> _generatedFiles = new();

    public IncrementalBuilder(
        BuildConfiguration config,
        IDiagnosticReporter diagnosticReporter,
        ComponentRegistry componentRegistry)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _diagnosticReporter = diagnosticReporter ?? throw new ArgumentNullException(nameof(diagnosticReporter));
        _componentRegistry = componentRegistry ?? throw new ArgumentNullException(nameof(componentRegistry));
    }

    public BuildResult BuildFile(string sourceFile)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        _diagnosticReporter.Clear();

        if (!File.Exists(sourceFile))
        {
            _diagnosticReporter.ReportError("DEV001", $"File not found: {sourceFile}", null);
            return new BuildResult(false, 0, 0, stopwatch.Elapsed, _diagnosticReporter.GetDiagnostics());
        }

        var timestamp = File.GetLastWriteTimeUtc(sourceFile);
        if (_fileTimestamps.TryGetValue(sourceFile, out var lastTimestamp) && timestamp == lastTimestamp)
        {
            return new BuildResult(true, 0, 0, stopwatch.Elapsed, _diagnosticReporter.GetDiagnostics());
        }

        _fileTimestamps[sourceFile] = timestamp;

        var generatedPath = _config.GetGeneratedPath();
        Directory.CreateDirectory(generatedPath);

        var success = ProcessFile(sourceFile, generatedPath);

        stopwatch.Stop();
        return new BuildResult(success, 1, success ? 1 : 0, stopwatch.Elapsed, _diagnosticReporter.GetDiagnostics());
    }

    private bool ProcessFile(string sourceFile, string outputDir)
    {
        try
        {
            var source = File.ReadAllText(sourceFile);
            
            // NEW ARCHITECTURE: Use SoftParser
            var softParser = new SoftParser();
            var softUnit = softParser.Parse(source, sourceFile);

            var appName = Path.GetFileNameWithoutExtension(sourceFile);

            // Generate TypeScript using new generator with shared ComponentRegistry
            var generator = new TypeScriptGenerator(_componentRegistry);
            var tsCode = generator.GenerateWithSourceMap(softUnit, out var sourceMap);

            var outputFileName = $"{appName}.generated.ts";
            var outputPath = Path.Combine(outputDir, outputFileName);

            File.WriteAllText(outputPath, tsCode);
            _generatedFiles[sourceFile] = outputPath;

            return !_diagnosticReporter.HasErrors;
        }
        catch (Exception ex)
        {
            _diagnosticReporter.ReportError("DEV002", $"Build failed: {ex.Message}", null);
            return false;
        }
    }

    public string? GetGeneratedFile(string sourceFile)
    {
        _generatedFiles.TryGetValue(sourceFile, out var generated);
        return generated;
    }

    public void ClearCache()
    {
        _fileTimestamps.Clear();
        _generatedFiles.Clear();
    }
}
