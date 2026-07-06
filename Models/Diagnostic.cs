namespace Soft.Compiler.Models;

public sealed class Diagnostic
{
    public string Id { get; }
    public string Message { get; }
    public DiagnosticSeverity Severity { get; }
    public SourceLocation? Location { get; }

    public Diagnostic(string id, string message, DiagnosticSeverity severity, SourceLocation? location = null)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        Message = message ?? throw new ArgumentNullException(nameof(message));
        Severity = severity;
        Location = location;
    }

    public override string ToString()
    {
        var severityText = Severity.ToString().ToLowerInvariant();
        if (Location != null)
        {
            return $"{Location}: {severityText} {Id}: {Message}";
        }
        return $"{severityText} {Id}: {Message}";
    }
}
