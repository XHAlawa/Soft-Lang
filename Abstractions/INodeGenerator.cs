using Soft.Compiler.Template;

namespace Soft.Compiler.Abstractions;

/// <summary>
/// Generates code for specific template node types.
/// </summary>
public interface INodeGenerator
{
    /// <summary>
    /// Checks if this generator can handle the node.
    /// </summary>
    bool CanGenerate(TemplateNode node);
    
    /// <summary>
    /// Generates code for the node.
    /// </summary>
    /// <param name="node">Node to generate code for</param>
    /// <param name="context">Generation context</param>
    /// <returns>Generated code</returns>
    string Generate(TemplateNode node, CodeGenerationContext context);
}

/// <summary>
/// Context for code generation.
/// </summary>
public class CodeGenerationContext
{
    public string ParentVar { get; set; } = "";
    public string ClassName { get; set; } = "";
    public int IndentLevel { get; set; } = 0;
    public HashSet<string> LoopVariables { get; set; } = new();
    public Semantics.PageSymbolTable? SymbolTable { get; set; }
    
    // Component disposal tracking
    public List<ComponentInstanceMetadata> ComponentInstances { get; set; } = new();
    public string? ConditionalContext { get; set; }  // e.g., "showModal"
    public string? LoopContext { get; set; }  // e.g., "items"
    
    // Shared counter across all contexts
    private static int _globalVarCounter = 0;
    
    public string NextVar() => $"el{_globalVarCounter++}";
    
    public string Indent() => new string(' ', IndentLevel * 4);
    
    public void ResetVarCounter() => _globalVarCounter = 0;
}

/// <summary>
/// Metadata for component instance disposal.
/// </summary>
public class ComponentInstanceMetadata
{
    public string InstanceVar { get; set; } = "";
    public string ComponentType { get; set; } = "";
    public string? ConditionalContext { get; set; }
    public string? LoopContext { get; set; }
}
