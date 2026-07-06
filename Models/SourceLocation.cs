namespace Soft.Compiler.Models;

public sealed class SourceLocation
{
    public string FilePath { get; }
    public int Line { get; }
    public int Column { get; }

    public SourceLocation(string filePath, int line, int column)
    {
        FilePath = filePath ?? throw new ArgumentNullException(nameof(filePath));
        Line = line;
        Column = column;
    }

    public override string ToString() => $"{FilePath}({Line},{Column})";
}
