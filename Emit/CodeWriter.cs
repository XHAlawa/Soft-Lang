using System.Text;

namespace Soft.Compiler.Emit;

public sealed class CodeWriter
{
    private readonly StringBuilder _builder = new();
    private int _indentLevel = 0;
    private bool _needsIndent = true;
    private const string IndentString = "    ";

    public void Write(string text)
    {
        if (string.IsNullOrEmpty(text))
            return;

        if (_needsIndent)
        {
            for (int i = 0; i < _indentLevel; i++)
            {
                _builder.Append(IndentString);
            }
            _needsIndent = false;
        }

        _builder.Append(text);
    }

    public void WriteLine(string text = "")
    {
        Write(text);
        _builder.AppendLine();
        _needsIndent = true;
    }

    public void Indent()
    {
        _indentLevel++;
    }

    public void Dedent()
    {
        if (_indentLevel > 0)
            _indentLevel--;
    }

    public void WriteBlock(Action content)
    {
        WriteLine("{");
        Indent();
        content();
        Dedent();
        WriteLine("}");
    }

    public string GetCode()
    {
        return _builder.ToString();
    }

    public void Clear()
    {
        _builder.Clear();
        _indentLevel = 0;
        _needsIndent = true;
    }
}
