using Soft.Compiler.Models;

namespace Soft.Compiler.Template.Parser;

/// <summary>
/// Shared parsing state across all parsers.
/// Prevents state synchronization issues.
/// </summary>
public class ParsingContext
{
    public string Source { get; set; } = "";
    public string FilePath { get; set; } = "";
    public int Position { get; set; }
    public int Line { get; set; } = 1;
    public int Column { get; set; } = 1;
    public int NodeIdCounter { get; set; }
    
    public bool IsAtEnd() => Position >= Source.Length;
    
    public char Peek() => IsAtEnd() ? '\0' : Source[Position];
    
    public char LookAhead(int offset)
    {
        var pos = Position + offset;
        return pos >= Source.Length ? '\0' : Source[pos];
    }
    
    public char Advance()
    {
        if (IsAtEnd()) return '\0';
        var c = Source[Position++];
        if (c == '\n')
        {
            Line++;
            Column = 1;
        }
        else
        {
            Column++;
        }
        return c;
    }
    
    public int NextNodeId() => ++NodeIdCounter;
    
    public SourceLocation CreateLocation() => new SourceLocation(FilePath, Line, Column);
}
