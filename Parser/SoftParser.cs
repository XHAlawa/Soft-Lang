using System.Text;
using Soft.Compiler.Language;

namespace Soft.Compiler.Parser;

/// <summary>
/// Lightweight parser that extracts Soft-specific blocks (@Page, @Template, @Style, @Code)
/// and preserves code content as raw text. Does NOT parse TypeScript syntax.
/// </summary>
public sealed class SoftParser : IParser
{
    public SoftFileUnit Parse(string source, string filePath)
    {
        var unit = new SoftFileUnit { FilePath = filePath };
        var lines = source.Split('\n');
        var position = 0;
        var hasExplicitCodeBlock = false;
        
        while (position < lines.Length)
        {
            var line = lines[position].TrimStart();
            
            // @Page("route") or @Page(Route = [...], Cache = ...)
            if (line.StartsWith(SoftKeywords.Page))
            {
                unit.PageRoute = ExtractPageRoute(line);
                unit.PageMetadata = ParsePageMetadata(line);
                // Also add to decorators list for detection
                unit.Decorators.Add(new SoftDecorator
                {
                    Name = "Page",
                    Argument = unit.PageRoute,
                    Line = position
                });
                position++;
                continue;
            }
            
            // @importComponent('path', 'alias')
            if (line.StartsWith(SoftKeywords.ImportComponent))
            {
                var import = ParseComponentImport(line, position);
                if (import != null)
                {
                    unit.ComponentImports.Add(import);
                }
                position++;
                continue;
            }
            
            // @Template{ ... }
            if (line.StartsWith(SoftKeywords.Template))
            {
                var (content, endPos) = ExtractBlock(lines, position, SoftKeywords.Template);
                unit.TemplateContent = content;
                unit.TemplateStartLine = position + 1;
                position = endPos;
                continue;
            }
            
            // @Style{ ... } or @Style(scoped) { ... }
            if (line.StartsWith(SoftKeywords.Style))
            {
                // Check for scoped modifier
                unit.ScopedStyles = line.Contains("scoped");
                
                var (content, endPos) = ExtractBlock(lines, position, SoftKeywords.Style);
                unit.StyleContent = content;
                unit.StyleStartLine = position + 1;
                position = endPos;
                continue;
            }
            
            // @Code{ ... }
            if (line.StartsWith(SoftKeywords.Code))
            {
                var (content, endPos) = ExtractBlock(lines, position, SoftKeywords.Code);
                unit.CodeContent = content;
                unit.CodeStartLine = position + 1;
                unit.ClassName = ExtractClassName(content);
                hasExplicitCodeBlock = true;
                position = endPos;
                continue;
            }
            
            // Other decorators (@Service, @Component, etc.)
            if (line.StartsWith("@") && !line.StartsWith(SoftKeywords.If) && !line.StartsWith(SoftKeywords.ForEach))
            {
                var decorator = ParseDecorator(line, position);
                if (decorator != null)
                {
                    unit.Decorators.Add(decorator);
                }
            }
            
            position++;
        }
        
        // If no explicit @Code block found, treat entire file as code (backward compatibility)
        if (!hasExplicitCodeBlock && string.IsNullOrEmpty(unit.CodeContent))
        {
            unit.CodeContent = source;
            unit.CodeStartLine = 1;
            unit.ClassName = ExtractClassName(source);
        }
        
        // Check for @Service decorator
        unit.IsService = unit.Decorators.Any(d => d.Name.Equals("Service", StringComparison.OrdinalIgnoreCase));
        
        // Check for @Page decorator
        var isPage = unit.Decorators.Any(d => d.Name.Equals("Page", StringComparison.OrdinalIgnoreCase));
        
        // Parse constructor dependencies if @Service or @Page
        if (unit.IsService || isPage)
        {
            unit.ServiceDependencies = ParseConstructorDependencies(unit.CodeContent);
        }
        
        return unit;
    }
    
    private string? ExtractPageRoute(string line)
    {
        // @Page("/route") or @Page('/route') - backward compatibility
        var start = line.IndexOf('(');
        var end = line.LastIndexOf(')');
        if (start < 0 || end < 0) return null;
        
        var content = line.Substring(start + 1, end - start - 1).Trim();
        
        // Simple route: @Page("/route")
        if ((content.StartsWith('"') && content.EndsWith('"')) ||
            (content.StartsWith('\'') && content.EndsWith('\'')))
        {
            return content.Substring(1, content.Length - 2);
        }
        
        // Metadata format with array: @Page(Route = ["...", "..."])
        var arrayMatch = System.Text.RegularExpressions.Regex.Match(content, @"Route\s*=\s*\[\s*[""']([^""']+)[""']");
        if (arrayMatch.Success)
        {
            return arrayMatch.Groups[1].Value;
        }
        
        // Metadata format: @Page(Route = "...", Cache = ...)
        var routeMatch = System.Text.RegularExpressions.Regex.Match(content, @"Route\s*=\s*[""']([^""']+)[""']");
        if (routeMatch.Success)
        {
            return routeMatch.Groups[1].Value;
        }
        
        return null;
    }
    
    private (string Content, int EndPosition) ExtractBlock(string[] lines, int startPos, string blockName)
    {
        // Check if this line or next line has opening brace for block syntax
        // Only use brace-based if { is on directive line (@Code{) or standalone on next line
        var currentLine = startPos;
        var braceFound = false;
        
        // Check directive line itself
        if (lines[startPos].Contains('{'))
        {
            braceFound = true;
            currentLine = startPos;
        }
        // Check next line - only if it's JUST a brace (standalone { on its own line)
        else if (startPos + 1 < lines.Length)
        {
            var nextLine = lines[startPos + 1].Trim();
            if (nextLine == "{")
            {
                braceFound = true;
                currentLine = startPos + 1;
            }
        }
        
        if (braceFound)
        {
            // Brace-based extraction - exclude the braces themselves
            var braceDepth = 0;
            var sb = new StringBuilder();
            var firstBrace = true;
            
            for (int i = currentLine; i < lines.Length; i++)
            {
                var line = lines[i];
                
                foreach (var ch in line)
                {
                    if (ch == '{')
                    {
                        braceDepth++;
                        if (firstBrace)
                        {
                            firstBrace = false;
                            continue; // Skip the opening brace itself
                        }
                    }
                    else if (ch == '}')
                    {
                        braceDepth--;
                        if (braceDepth == 0)
                        {
                            // Found closing brace - return content (don't include the closing brace)
                            return (sb.ToString().TrimEnd(), i + 1);
                        }
                        else
                        {
                            sb.Append(ch);
                        }
                    }
                    
                    if (braceDepth > 0 && !firstBrace)
                    {
                        sb.Append(ch);
                    }
                }
                
                if (braceDepth > 0)
                {
                    sb.AppendLine(); // Preserve line breaks
                }
            }
            
            // Unclosed block
            return (sb.ToString(), lines.Length);
        }
        else
        {
            // Indentation-based extraction
            // Extract all lines until we hit another @ directive at root level
            var sb = new StringBuilder();
            var i = startPos + 1; // Start from next line after @Template/@Style/@Code
            
            while (i < lines.Length)
            {
                var line = lines[i];
                var trimmed = line.TrimStart();
                
                // Stop at next root-level SECTION directive (@Style, @Code, @Template, @Page, etc.)
                // Do NOT stop on decorators (@State, @Computed, @Watch, @Component, etc.)
                if (line.Length > 0 && line[0] == '@') // Must be at column 0 (root level)
                {
                    // Only break on section directives, not decorators
                    if (trimmed.StartsWith(SoftKeywords.Template) || 
                        trimmed.StartsWith(SoftKeywords.Style) || 
                        trimmed.StartsWith(SoftKeywords.Code) ||
                        trimmed.StartsWith(SoftKeywords.Page) ||
                        trimmed.StartsWith(SoftKeywords.ImportComponent))
                    {
                        break;
                    }
                }
                
                sb.AppendLine(line);
                i++;
            }
            
            return (sb.ToString().TrimEnd(), i);
        }
    }
    
    private SoftDecorator? ParseDecorator(string line, int lineNumber)
    {
        var trimmed = line.TrimStart('@').Trim();
        var parenIndex = trimmed.IndexOf('(');
        
        if (parenIndex < 0)
        {
            // Simple decorator: @Service
            return new SoftDecorator
            {
                Name = trimmed,
                Line = lineNumber
            };
        }
        
        // Decorator with argument: @Component("name")
        var name = trimmed.Substring(0, parenIndex);
        var argStart = parenIndex + 1;
        var argEnd = trimmed.LastIndexOf(')');
        
        if (argEnd < 0) return null;
        
        var argument = trimmed.Substring(argStart, argEnd - argStart).Trim();
        // Remove quotes
        if ((argument.StartsWith('"') && argument.EndsWith('"')) ||
            (argument.StartsWith('\'') && argument.EndsWith('\'')))
        {
            argument = argument.Substring(1, argument.Length - 2);
        }
        
        return new SoftDecorator
        {
            Name = name,
            Argument = argument,
            Line = lineNumber
        };
    }
    
    private PageMetadata? ParsePageMetadata(string line)
    {
        var start = line.IndexOf('(');
        var end = line.LastIndexOf(')');
        if (start < 0 || end < 0) return null;
        
        var content = line.Substring(start + 1, end - start - 1).Trim();
        
        // Simple route: @Page("/route") - no metadata
        if ((content.StartsWith('"') && content.EndsWith('"')) ||
            (content.StartsWith('\'') && content.EndsWith('\'')))
        {
            var route = content.Substring(1, content.Length - 2);
            return new PageMetadata { Routes = new List<string> { route } };
        }
        
        var metadata = new PageMetadata();
        
        // Parse Route = [...] or Route = "..."
        var routeArrayMatch = System.Text.RegularExpressions.Regex.Match(content, @"Route\s*=\s*\[(.*?)\]", System.Text.RegularExpressions.RegexOptions.Singleline);
        if (routeArrayMatch.Success)
        {
            var routesStr = routeArrayMatch.Groups[1].Value;
            var routes = System.Text.RegularExpressions.Regex.Matches(routesStr, @"[""']([^""']+)[""']")
                .Cast<System.Text.RegularExpressions.Match>()
                .Select(m => m.Groups[1].Value)
                .ToList();
            metadata.Routes = routes;
        }
        else
        {
            var routeMatch = System.Text.RegularExpressions.Regex.Match(content, @"Route\s*=\s*[""']([^""']+)[""']");
            if (routeMatch.Success)
            {
                metadata.Routes.Add(routeMatch.Groups[1].Value);
            }
        }
        
        // Parse Cache = 5m
        var cacheMatch = System.Text.RegularExpressions.Regex.Match(content, @"Cache\s*=\s*([^,\)]+)");
        if (cacheMatch.Success)
        {
            metadata.Cache = cacheMatch.Groups[1].Value.Trim();
        }
        
        return metadata;
    }
    
    private ComponentImport? ParseComponentImport(string line, int lineNumber)
    {
        // Official Soft syntax: @importComponent Alias from "path"
        // Pattern: @importComponent <identifier> from <string-literal>
        var pattern = @"@importComponent\s+(\w+)\s+from\s+[""']([^""']+)[""']";
        var match = System.Text.RegularExpressions.Regex.Match(line, pattern);
        
        if (!match.Success)
        {
            return null;
        }
        
        var alias = match.Groups[1].Value;
        var path = match.Groups[2].Value;
        
        return new ComponentImport
        {
            Path = path,
            Alias = alias,
            Line = lineNumber
        };
    }
    
    private string? ExtractClassName(string? code)
    {
        if (string.IsNullOrEmpty(code))
            return null;
        
        // Extract class name: "export class ClassName" or "class ClassName"
        var match = System.Text.RegularExpressions.Regex.Match(code, @"(?:export\s+)?class\s+(\w+)");
        return match.Success ? match.Groups[1].Value : null;
    }
    
    private List<ServiceDependency> ParseConstructorDependencies(string? code)
    {
        var dependencies = new List<ServiceDependency>();
        
        if (string.IsNullOrEmpty(code))
            return dependencies;
        
        // Match constructor(param: Type, param2?: Type2)
        // Pattern: constructor\s*\((.*?)\)
        var constructorMatch = System.Text.RegularExpressions.Regex.Match(
            code, 
            @"constructor\s*\((.*?)\)",
            System.Text.RegularExpressions.RegexOptions.Singleline
        );
        
        if (!constructorMatch.Success)
            return dependencies;
        
        var parameters = constructorMatch.Groups[1].Value;
        if (string.IsNullOrWhiteSpace(parameters))
            return dependencies;
        
        // Split by comma, but respect nested generics
        var paramList = SplitParameters(parameters);
        
        foreach (var param in paramList)
        {
            var trimmed = param.Trim();
            if (string.IsNullOrEmpty(trimmed))
                continue;
            
            // Pattern: [private|public|protected] paramName?: Type
            var paramMatch = System.Text.RegularExpressions.Regex.Match(
                trimmed,
                @"(?:private\s+|public\s+|protected\s+)?(\w+)(\?)?:\s*(\w+(?:<[^>]+>)?)"
            );
            
            if (paramMatch.Success)
            {
                dependencies.Add(new ServiceDependency
                {
                    ParameterName = paramMatch.Groups[1].Value,
                    ServiceType = paramMatch.Groups[3].Value,
                    IsOptional = paramMatch.Groups[2].Value == "?"
                });
            }
        }
        
        return dependencies;
    }
    
    private List<string> SplitParameters(string parameters)
    {
        var result = new List<string>();
        var current = new System.Text.StringBuilder();
        var depth = 0;
        
        foreach (var ch in parameters)
        {
            if (ch == '<' || ch == '(') depth++;
            else if (ch == '>' || ch == ')') depth--;
            else if (ch == ',' && depth == 0)
            {
                result.Add(current.ToString());
                current.Clear();
                continue;
            }
            
            current.Append(ch);
        }
        
        if (current.Length > 0)
            result.Add(current.ToString());
        
        return result;
    }
}
