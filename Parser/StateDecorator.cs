namespace Soft.Compiler.Parser;

/// <summary>
/// Represents @State decorator for global state properties.
/// </summary>
public class StateDecorator
{
    public string PropertyName { get; set; } = "";
    public bool Persist { get; set; } = false;
    public string? InitialValue { get; set; }
    public int Line { get; set; }
}
