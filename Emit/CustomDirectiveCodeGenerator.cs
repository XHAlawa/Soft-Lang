using System.Text;
using System.Text.RegularExpressions;

namespace Soft.Compiler.Emit;

/// <summary>
/// Generates code for @custom directive decorator.
/// Transforms directive classes into registered directives.
/// </summary>
public class CustomDirectiveCodeGenerator
{
    public string ProcessCustomDirectives(string code)
    {
        // Early return if no @custom decorators
        if (!code.Contains("@custom"))
            return code;
        
        var result = new StringBuilder();
        var lines = code.Split('\n');
        var directives = new List<DirectiveInfo>();
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            
            // Check for @custom decorator
            if (line.Trim().StartsWith("@custom"))
            {
                var directiveInfo = ParseCustomDecorator(line);
                
                // Next line should be export class
                if (i + 1 < lines.Length)
                {
                    var classLine = lines[i + 1];
                    var match = Regex.Match(classLine, @"export\s+class\s+(\w+)");
                    
                    if (match.Success)
                    {
                        directiveInfo.ClassName = match.Groups[1].Value;
                        directives.Add(directiveInfo);
                        
                        // Skip @custom line, keep class
                        i++;
                        result.AppendLine(lines[i]);
                        continue;
                    }
                }
            }
            
            result.AppendLine(line);
        }
        
        // Add directive registration after class
        if (directives.Any())
        {
            result = AddDirectiveRegistration(result.ToString(), directives);
        }
        
        return result.ToString();
    }
    
    private DirectiveInfo ParseCustomDecorator(string line)
    {
        var info = new DirectiveInfo
        {
            Namespace = "x" // Default namespace
        };
        
        // Parse @custom('namespace:name') or @custom('name')
        var match = Regex.Match(line, @"@custom\s*\(\s*['""]([^'""]+)['""]");
        if (match.Success)
        {
            var value = match.Groups[1].Value;
            
            // Check for namespace
            if (value.Contains(":"))
            {
                var parts = value.Split(':');
                info.Namespace = parts[0];
                info.Name = parts[1];
            }
            else
            {
                info.Name = value;
            }
        }
        
        return info;
    }
    
    private StringBuilder AddDirectiveRegistration(string code, List<DirectiveInfo> directives)
    {
        var result = new StringBuilder(code);
        
        // Add registration code after all classes
        result.AppendLine();
        result.AppendLine("// Register custom directives");
        result.AppendLine("import { directiveRegistry as $directives } from './runtime/directives';");
        result.AppendLine();
        
        foreach (var directive in directives)
        {
            result.AppendLine($"// Register @{directive.Namespace}:{directive.Name}");
            result.AppendLine($"const {directive.ClassName}_instance = new {directive.ClassName}();");
            result.AppendLine($"$directives.register('{directive.Namespace}', '{directive.Name}', {{");
            result.AppendLine($"    mounted: (el, value) => {directive.ClassName}_instance.mounted?.(el, value),");
            result.AppendLine($"    updated: (el, value, oldValue) => {directive.ClassName}_instance.updated?.(el, value, oldValue),");
            result.AppendLine($"    unmounted: (el, value) => {directive.ClassName}_instance.unmounted?.(el, value)");
            result.AppendLine($"}});");
            result.AppendLine();
        }
        
        return result;
    }
    
    private class DirectiveInfo
    {
        public string Namespace { get; set; } = "x";
        public string Name { get; set; } = "";
        public string ClassName { get; set; } = "";
    }
}
