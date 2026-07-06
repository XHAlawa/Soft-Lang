using System.Text;
using System.Text.RegularExpressions;

namespace Soft.Compiler.Emit;

/// <summary>
/// Generates code for @Computed decorated getters.
/// Transforms getters into cached, reactive computed properties.
/// </summary>
public class ComputedCodeGenerator
{
    public string ProcessComputedDecorators(string code)
    {
        // Early return if no @Computed decorators
        if (!code.Contains("@Computed"))
            return code;
        
        var result = new StringBuilder();
        var lines = code.Split('\n');
        var computedProperties = new List<string>();
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            
            // Check for @Computed decorator
            if (line.Trim().StartsWith("@Computed"))
            {
                // Next line should be a getter
                if (i + 1 < lines.Length)
                {
                    var getterLine = lines[i + 1];
                    var match = Regex.Match(getterLine, @"get\s+(\w+)\s*\(\)");
                    
                    if (match.Success)
                    {
                        var propName = match.Groups[1].Value;
                        computedProperties.Add(propName);
                        
                        // Skip @Computed line, keep getter but wrap it
                        i++; // Move to getter line
                        
                        // Find getter body
                        var getterBody = new StringBuilder();
                        var braceCount = 0;
                        var started = false;
                        
                        while (i < lines.Length)
                        {
                            var bodyLine = lines[i];
                            
                            if (bodyLine.Contains("{"))
                            {
                                braceCount++;
                                started = true;
                            }
                            if (bodyLine.Contains("}"))
                            {
                                braceCount--;
                            }
                            
                            getterBody.AppendLine(bodyLine);
                            i++;
                            
                            if (started && braceCount == 0)
                            {
                                break;
                            }
                        }
                        
                        // Generate computed getter
                        result.AppendLine($"    get {propName}() {{");
                        result.AppendLine($"        return $computed.get('{propName}');");
                        result.AppendLine($"    }}");
                        result.AppendLine($"    private _compute_{propName}() {{");
                        
                        // Extract body (remove first { and last })
                        var bodyStr = getterBody.ToString();
                        var firstBrace = bodyStr.IndexOf('{');
                        var lastBrace = bodyStr.LastIndexOf('}');
                        if (firstBrace >= 0 && lastBrace > firstBrace)
                        {
                            var innerBody = bodyStr.Substring(firstBrace + 1, lastBrace - firstBrace - 1);
                            result.Append(innerBody);
                        }
                        
                        result.AppendLine($"    }}");
                        
                        i--; // Adjust for outer loop increment
                        continue;
                    }
                }
            }
            
            result.AppendLine(line);
        }
        
        // Add computed registration in constructor
        if (computedProperties.Any())
        {
            result = AddComputedRegistration(result.ToString(), computedProperties);
        }
        
        return result.ToString();
    }
    
    private StringBuilder AddComputedRegistration(string code, List<string> computedProps)
    {
        var result = new StringBuilder();
        var lines = code.Split('\n');
        var constructorFound = false;
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            result.AppendLine(line);
            
            // Find constructor
            if (!constructorFound && line.Trim().StartsWith("constructor("))
            {
                constructorFound = true;
                
                // Find opening brace
                while (i < lines.Length && !lines[i].Contains("{"))
                {
                    i++;
                    result.AppendLine(lines[i]);
                }
                
                // Add computed registration
                result.AppendLine("        // Register computed properties");
                foreach (var prop in computedProps)
                {
                    result.AppendLine($"        $computed.register('{prop}', () => this._compute_{prop}());");
                }
                result.AppendLine();
            }
        }
        
        return result;
    }
}
