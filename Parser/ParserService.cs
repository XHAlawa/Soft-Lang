using Soft.Compiler.Diagnostics;

namespace Soft.Compiler.Parser;

public sealed class ParserService : IParser
{
    private readonly IDiagnosticReporter _diagnosticReporter;

    public ParserService(IDiagnosticReporter diagnosticReporter)
    {
        _diagnosticReporter = diagnosticReporter ?? throw new ArgumentNullException(nameof(diagnosticReporter));
    }

    public SoftFileUnit Parse(string source, string filePath)
    {
        if (source == null)
            throw new ArgumentNullException(nameof(source));

        var parser = new SoftParser();
        return parser.Parse(source, filePath);
    }
}
