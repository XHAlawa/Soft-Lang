namespace Soft.Compiler.Models;

public sealed class BuildResult
{
    public bool Success { get; }
    public IReadOnlyList<Diagnostic> Diagnostics { get; }

    public BuildResult(bool success, IReadOnlyList<Diagnostic> diagnostics)
    {
        Success = success;
        Diagnostics = diagnostics ?? throw new ArgumentNullException(nameof(diagnostics));
    }

    public bool HasErrors => Diagnostics.Any(d => d.Severity == DiagnosticSeverity.Error);
}
