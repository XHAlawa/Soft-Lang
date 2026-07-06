using Soft.Compiler.Models;

namespace Soft.Compiler.Diagnostics;

public interface IDiagnosticReporter
{
    void Report(Diagnostic diagnostic);
    void ReportError(string id, string message, SourceLocation? location = null);
    void ReportWarning(string id, string message, SourceLocation? location = null);
    void ReportInfo(string id, string message, SourceLocation? location = null);
    IReadOnlyList<Diagnostic> GetDiagnostics();
    void Clear();
    bool HasErrors { get; }
}
