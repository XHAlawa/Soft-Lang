using Soft.Compiler.Models;

namespace Soft.Compiler.Semantics;

/// <summary>
/// Symbol table for pages discovered during compilation
/// Maps component names to route metadata for navigation resolution
/// </summary>
public sealed class PageSymbolTable
{
    private readonly Dictionary<string, PageSymbol> _symbols = new();
    
    public void AddPage(string componentName, PageSymbol symbol)
    {
        _symbols[componentName] = symbol;
    }
    
    public PageSymbol? Resolve(string componentName)
    {
        return _symbols.TryGetValue(componentName, out var symbol) ? symbol : null;
    }
    
    public IReadOnlyDictionary<string, PageSymbol> AllPages => _symbols;
}

/// <summary>
/// Represents a page component symbol with routing metadata
/// </summary>
public sealed class PageSymbol
{
    public string ComponentName { get; set; } = "";
    public string CanonicalRoute { get; set; } = "";
    public List<string> AliasRoutes { get; set; } = new();
    public List<RouteParameter> Parameters { get; set; } = new();
    public string? Cache { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}
