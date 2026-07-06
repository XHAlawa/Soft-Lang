using Soft.Compiler.Diagnostics;
using Soft.Compiler.Models;

namespace Soft.Compiler.Template.Parser;

/// <summary>
/// Base class with common parsing utilities.
/// Uses shared ParsingContext to avoid state synchronization issues.
/// </summary>
public abstract class BaseParser
{
    protected readonly IDiagnosticReporter _diagnosticReporter;
    protected ParsingContext? _context;
    
    protected BaseParser(IDiagnosticReporter diagnosticReporter)
    {
        _diagnosticReporter = diagnosticReporter;
    }
    
    public void Initialize(ParsingContext context)
    {
        _context = context;
    }
    
    protected bool IsAtEnd()
    {
        if (_context == null)
            throw new InvalidOperationException("Parser not initialized. Call Initialize() before parsing.");
        return _context.IsAtEnd();
    }
    
    protected char Peek()
    {
        if (_context == null)
            throw new InvalidOperationException("Parser not initialized. Call Initialize() before parsing.");
        return _context.Peek();
    }
    
    protected char LookAhead(int offset)
    {
        if (_context == null)
            throw new InvalidOperationException("Parser not initialized. Call Initialize() before parsing.");
        return _context.LookAhead(offset);
    }
    
    protected char Advance()
    {
        if (_context == null)
            throw new InvalidOperationException("Parser not initialized. Call Initialize() before parsing.");
        return _context.Advance();
    }
    
    protected bool Match(string expected, StringComparison comparison = StringComparison.Ordinal)
    {
        if (_context.Position + expected.Length > _context.Source.Length) return false;
        if (!_context.Source.Substring(_context.Position, expected.Length).Equals(expected, comparison)) return false;
        
        for (int i = 0; i < expected.Length; i++)
        {
            Advance();
        }
        return true;
    }
    
    protected void Expect(char c)
    {
        if (Peek() != c)
        {
            ReportError("TMPL002", $"Expected '{c}' but found '{Peek()}'");
            return;
        }
        Advance();
    }
    
    protected void SkipWhitespace()
    {
        while (!IsAtEnd() && char.IsWhiteSpace(Peek()))
        {
            Advance();
        }
    }
    
    protected int NextNodeId() => _context.NextNodeId();
    
    protected SourceLocation CreateLocation() => _context.CreateLocation();
    
    protected void ReportError(string id, string message)
    {
        _diagnosticReporter.ReportError(id, message, CreateLocation());
    }
}
