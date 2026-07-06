namespace Soft.Compiler.Models;

/// <summary>
/// Represents a route parameter extracted from route pattern
/// </summary>
public sealed class RouteParameter
{
    public string Name { get; set; } = "";
    public string Type { get; set; } = "string";
    public int Position { get; set; }
}

/// <summary>
/// Represents resolved route metadata
/// </summary>
public sealed class RouteMetadata
{
    public string ComponentName { get; set; } = "";
    public List<string> Patterns { get; set; } = new();
    public string CanonicalPattern { get; set; } = "";
    public List<RouteParameter> Parameters { get; set; } = new();
    public string? Cache { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}
