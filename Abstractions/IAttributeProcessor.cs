using Soft.Compiler.Template;

namespace Soft.Compiler.Abstractions;

/// <summary>
/// Processes template attributes and generates code.
/// </summary>
public interface IAttributeProcessor
{
    /// <summary>
    /// Checks if this processor can handle the attribute.
    /// </summary>
    bool CanProcess(TemplateAttribute attribute);
    
    /// <summary>
    /// Processes the attribute and generates code.
    /// </summary>
    /// <param name="attribute">Attribute to process</param>
    /// <param name="elementVar">Variable name of the element</param>
    /// <param name="context">Processing context</param>
    /// <returns>Generated code</returns>
    string Process(TemplateAttribute attribute, string elementVar, AttributeProcessingContext context);
}

/// <summary>
/// Context for attribute processing.
/// </summary>
public class AttributeProcessingContext
{
    public string ElementTag { get; set; } = "";
    public string ContainerVar { get; set; } = "";
    public List<string> GeneratedCode { get; set; } = new();
    public HashSet<string> LoopVariables { get; set; } = new();
    public List<TemplateAttribute> AllAttributes { get; set; } = new();
    public Semantics.PageSymbolTable? SymbolTable { get; set; }
}
