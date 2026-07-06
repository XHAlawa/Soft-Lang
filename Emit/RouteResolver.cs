using System.Text.RegularExpressions;
using Soft.Compiler.Models;

namespace Soft.Compiler.Emit;

/// <summary>
/// Resolves route patterns and extracts parameter metadata
/// </summary>
public static class RouteResolver
{
    /// <summary>
    /// Parse route pattern and extract parameters with types
    /// Examples: /customers/{id:int}, /products/{category:string}/{id:int}
    /// </summary>
    public static List<RouteParameter> ParseRouteParameters(string pattern)
    {
        var parameters = new List<RouteParameter>();
        var matches = Regex.Matches(pattern, @"\{([^:}]+)(?::([^}]+))?\}");
        
        var position = 0;
        foreach (Match match in matches)
        {
            var name = match.Groups[1].Value;
            var type = match.Groups[2].Success ? match.Groups[2].Value : "string";
            
            parameters.Add(new RouteParameter
            {
                Name = name,
                Type = ResolveParameterType(type),
                Position = position++
            });
        }
        
        return parameters;
    }
    
    /// <summary>
    /// Convert route type syntax to TypeScript type
    /// </summary>
    private static string ResolveParameterType(string routeType)
    {
        return routeType.ToLowerInvariant() switch
        {
            "int" => "number",
            "string" => "string",
            "bool" => "boolean",
            "uuid" => "string",
            _ => "string"
        };
    }
    
    /// <summary>
    /// Convert route pattern to URL pattern for runtime matching
    /// Example: /customers/{id:int} -> /customers/:id
    /// </summary>
    public static string ConvertToUrlPattern(string pattern)
    {
        return Regex.Replace(pattern, @"\{([^:}]+)(?::[^}]+)?\}", ":$1");
    }
}
