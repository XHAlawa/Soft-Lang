using Soft.Compiler.Parser;

namespace Soft.Compiler.Components;

/// <summary>
/// Tracks imported components and their metadata.
/// </summary>
public class ComponentRegistry
{
    private readonly Dictionary<string, ComponentMetadata> _components = new();
    
    public void Register(ComponentImport import)
    {
        var alias = import.Alias ?? GetComponentNameFromPath(import.Path);
        
        _components[alias] = new ComponentMetadata
        {
            Name = alias,
            ImportPath = import.Path,
            SourceLine = import.Line
        };
    }
    
    public bool IsComponent(string name) => _components.ContainsKey(name);
    
    public ComponentMetadata? GetComponent(string name)
    {
        return _components.TryGetValue(name, out var metadata) ? metadata : null;
    }
    
    public IEnumerable<ComponentMetadata> GetAll() => _components.Values;
    
    private string GetComponentNameFromPath(string path)
    {
        var parts = path.Split('/', '\\');
        var fileName = parts[^1];
        return fileName.Replace(".s", "").Replace(".soft", "");
    }
}

public class ComponentMetadata
{
    public string Name { get; set; } = "";
    public string ImportPath { get; set; } = "";
    public int SourceLine { get; set; }
}
