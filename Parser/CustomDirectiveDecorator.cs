namespace Soft.Compiler.Parser;

/// <summary>
/// Represents @custom decorator for custom directive classes.
/// Example: @custom('tooltip') or @custom('ui:tooltip')
/// </summary>
public class CustomDirectiveDecorator
{
    public string Namespace { get; set; } = "x";
    public string Name { get; set; } = "";
    public string ClassName { get; set; } = "";
}
