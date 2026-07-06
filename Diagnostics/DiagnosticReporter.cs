using Soft.Compiler.Models;

namespace Soft.Compiler.Diagnostics;

public sealed class DiagnosticReporter : IDiagnosticReporter
{
    private readonly List<Diagnostic> _diagnostics = new();
    private readonly object _lock = new();

    public bool HasErrors
    {
        get
        {
            lock (_lock)
            {
                return _diagnostics.Any(d => d.Severity == DiagnosticSeverity.Error);
            }
        }
    }

    public void Report(Diagnostic diagnostic)
    {
        if (diagnostic == null)
            throw new ArgumentNullException(nameof(diagnostic));

        lock (_lock)
        {
            _diagnostics.Add(diagnostic);
        }
    }

    public void ReportError(string id, string message, SourceLocation? location = null)
    {
        Report(new Diagnostic(id, message, DiagnosticSeverity.Error, location));
    }

    public void ReportWarning(string id, string message, SourceLocation? location = null)
    {
        Report(new Diagnostic(id, message, DiagnosticSeverity.Warning, location));
    }

    public void ReportInfo(string id, string message, SourceLocation? location = null)
    {
        Report(new Diagnostic(id, message, DiagnosticSeverity.Info, location));
    }

    public IReadOnlyList<Diagnostic> GetDiagnostics()
    {
        lock (_lock)
        {
            return _diagnostics.ToList();
        }
    }

    public void Clear()
    {
        lock (_lock)
        {
            _diagnostics.Clear();
        }
    }
}
