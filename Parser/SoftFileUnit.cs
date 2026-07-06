namespace Soft.Compiler.Parser;

/// <summary>
/// Represents a parsed .s file with extracted Soft-specific blocks.
/// Code content is preserved as raw text - NOT parsed into TypeScript AST.
/// </summary>
public sealed class SoftFileUnit
{
    public string FilePath { get; set; } = "";
    public string? PageRoute { get; set; }
    public PageMetadata? PageMetadata { get; set; }
    public string? ClassName { get; set; }
    public string? TemplateContent { get; set; }
    public string? StyleContent { get; set; }
    public string? CodeContent { get; set; }
    public int CodeStartLine { get; set; }
    public int TemplateStartLine { get; set; }
    public int StyleStartLine { get; set; }
    public bool ScopedStyles { get; set; } = false;
    public bool IsService { get; set; } = false;
    public List<SoftDecorator> Decorators { get; set; } = new();
    public List<ComponentImport> ComponentImports { get; set; } = new();
    public List<ServiceDependency> ServiceDependencies { get; set; } = new();
}

/// <summary>
/// Represents a Soft decorator like @Page("/route") or @Service
/// </summary>
public sealed class SoftDecorator
{
    public string Name { get; set; } = "";
    public string? Argument { get; set; }
    public int Line { get; set; }
}

/// <summary>
/// Represents @importComponent('path', 'alias')
/// </summary>
public sealed class ComponentImport
{
    public string Path { get; set; } = "";
    public string? Alias { get; set; }
    public int Line { get; set; }
}

/// <summary>
/// Represents @Page routing metadata
/// </summary>
public sealed class PageMetadata
{
    public List<string> Routes { get; set; } = new();
    public string? Cache { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

/// <summary>
/// Represents a service dependency from constructor parameters
/// </summary>
public sealed class ServiceDependency
{
    public string ParameterName { get; set; } = "";
    public string ServiceType { get; set; } = "";
    public bool IsOptional { get; set; } = false;
}
