namespace Soft.Compiler.Emit;

public sealed class EmitResult
{
    public string FileName { get; }
    public string Content { get; }
    public bool Success { get; }

    public EmitResult(string fileName, string content, bool success = true)
    {
        FileName = fileName ?? throw new ArgumentNullException(nameof(fileName));
        Content = content ?? throw new ArgumentNullException(nameof(content));
        Success = success;
    }
}
