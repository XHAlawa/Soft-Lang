using System.Text;
using System.Text.RegularExpressions;

namespace Soft.Compiler.Emit;

/// <summary>
/// Generates scoped styles with unique component identifiers.
/// Transforms CSS selectors to be component-specific.
/// </summary>
public class ScopedStyleGenerator
{
    public string GenerateScopedStyles(string styles, string componentName, bool scoped)
    {
        if (!scoped || string.IsNullOrWhiteSpace(styles))
        {
            return styles;
        }
        
        var scopeId = GenerateScopeId(componentName);
        return ScopeStyles(styles, scopeId);
    }
    
    private string GenerateScopeId(string componentName)
    {
        // Generate unique scope ID based on component name
        var hash = Math.Abs(componentName.GetHashCode());
        return $"data-s-{hash:x}";
    }
    
    private string ScopeStyles(string styles, string scopeId)
    {
        var result = new StringBuilder();
        var lines = styles.Split('\n');
        
        foreach (var line in lines)
        {
            var trimmed = line.Trim();
            
            // Skip empty lines and comments
            if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith("/*") || trimmed.StartsWith("//"))
            {
                result.AppendLine(line);
                continue;
            }
            
            // Check if line is a selector (ends with { or contains selector)
            if (trimmed.Contains("{") && !trimmed.StartsWith("@"))
            {
                var scopedLine = ScopeSelector(line, scopeId);
                result.AppendLine(scopedLine);
            }
            else
            {
                result.AppendLine(line);
            }
        }
        
        return result.ToString();
    }
    
    private string ScopeSelector(string line, string scopeId)
    {
        // Extract selector part (before {)
        var parts = line.Split('{');
        if (parts.Length < 2) return line;
        
        var selector = parts[0].Trim();
        var rest = string.Join("{", parts.Skip(1));
        
        // Split multiple selectors (comma-separated)
        var selectors = selector.Split(',')
            .Select(s => s.Trim())
            .Select(s => ScopeSingleSelector(s, scopeId));
        
        var scopedSelector = string.Join(", ", selectors);
        return $"{scopedSelector} {{ {rest}";
    }
    
    private string ScopeSingleSelector(string selector, string scopeId)
    {
        // Don't scope :root, :host, or global selectors
        if (selector.StartsWith(":root") || 
            selector.StartsWith(":host") || 
            selector.StartsWith(":global"))
        {
            return selector;
        }
        
        // Add scope attribute to selector
        // .button -> .button[data-s-abc123]
        // div.item -> div.item[data-s-abc123]
        // .parent .child -> .parent .child[data-s-abc123]
        
        // Find the last part of the selector
        var parts = selector.Split(' ');
        var lastPart = parts[parts.Length - 1];
        
        // Add scope to last part
        var scopedLast = $"{lastPart}[{scopeId}]";
        parts[parts.Length - 1] = scopedLast;
        
        return string.Join(" ", parts);
    }
    
    public string GenerateScopeAttribute(string componentName, bool scoped)
    {
        if (!scoped) return "";
        
        var scopeId = GenerateScopeId(componentName);
        return scopeId;
    }
}
