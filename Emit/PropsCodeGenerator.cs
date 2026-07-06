using System.Text;
using System.Text.RegularExpressions;

namespace Soft.Compiler.Emit;

/// <summary>
/// Generates code for @Prop decorated properties with validation.
/// </summary>
public class PropsCodeGenerator
{
    public string ProcessPropDecorators(string code)
    {
        // Early return if no @Prop decorators
        if (!code.Contains("@Prop"))
            return code;
        
        var result = new StringBuilder();
        var lines = code.Split('\n');
        var props = new List<PropInfo>();
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            
            // Check for @Prop decorator
            if (line.Trim().StartsWith("@Prop"))
            {
                var propInfo = ParsePropDecorator(line);
                
                // Next line should be the property
                if (i + 1 < lines.Length)
                {
                    var propLine = lines[i + 1];
                    // Match property name and type (including function types)
                    var match = Regex.Match(propLine, @"(\w+)\s*:\s*(.+?);");
                    
                    if (match.Success)
                    {
                        propInfo.Name = match.Groups[1].Value;
                        propInfo.Type = match.Groups[2].Value.Trim();
                        props.Add(propInfo);
                        
                        // Skip @Prop line and generate validated property
                        i++; // Skip property line
                        
                        // Generate getter/setter with validation
                        result.AppendLine($"    private _{propInfo.Name}: {propInfo.Type};");
                        result.AppendLine($"    get {propInfo.Name}(): {propInfo.Type} {{");
                        result.AppendLine($"        return this._{propInfo.Name};");
                        result.AppendLine($"    }}");
                        result.AppendLine($"    set {propInfo.Name}(value: {propInfo.Type}) {{");
                        
                        // Add validation
                        if (propInfo.Required)
                        {
                            result.AppendLine($"        if (value === undefined || value === null) {{");
                            result.AppendLine($"            throw new Error('Prop \"{propInfo.Name}\" is required');");
                            result.AppendLine($"        }}");
                        }
                        
                        if (!string.IsNullOrEmpty(propInfo.Validator))
                        {
                            result.AppendLine($"        if (!({propInfo.Validator})(value)) {{");
                            result.AppendLine($"            throw new Error('Prop \"{propInfo.Name}\" validation failed');");
                            result.AppendLine($"        }}");
                        }
                        
                        // Prop change detection and re-render
                        result.AppendLine($"        const changed = this._{propInfo.Name} !== value;");
                        result.AppendLine($"        this._{propInfo.Name} = value;");
                        result.AppendLine($"        ");
                        result.AppendLine($"        // Trigger re-render if prop changed and component mounted");
                        result.AppendLine($"        if (changed && this.__mounted && this.__container) {{");
                        result.AppendLine($"            (this as any).onUpdated?.();");
                        result.AppendLine($"            this.__render(this.__container);");
                        result.AppendLine($"            (this as any).onAfterRender?.();");
                        result.AppendLine($"        }}");
                        result.AppendLine($"    }}");
                        
                        continue;
                    }
                }
            }
            
            result.AppendLine(line);
        }
        
        // Add prop initialization in constructor
        if (props.Any())
        {
            result = AddPropInitialization(result.ToString(), props);
        }
        
        return result.ToString();
    }
    
    private PropInfo ParsePropDecorator(string line)
    {
        var info = new PropInfo();
        
        // Parse @Prop({ type: String, required: true, default: 'value' })
        if (line.Contains("required"))
        {
            info.Required = true;
        }
        
        var defaultMatch = Regex.Match(line, @"default:\s*([^,}]+)");
        if (defaultMatch.Success)
        {
            info.DefaultValue = defaultMatch.Groups[1].Value.Trim();
        }
        
        var validatorMatch = Regex.Match(line, @"validator:\s*([^,}]+)");
        if (validatorMatch.Success)
        {
            info.Validator = validatorMatch.Groups[1].Value.Trim();
        }
        
        return info;
    }
    
    private StringBuilder AddPropInitialization(string code, List<PropInfo> props)
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
                
                // Add prop initialization
                result.AppendLine("        // Initialize props with defaults");
                foreach (var prop in props)
                {
                    if (!string.IsNullOrEmpty(prop.DefaultValue))
                    {
                        result.AppendLine($"        this._{prop.Name} = {prop.DefaultValue};");
                    }
                }
                result.AppendLine();
            }
        }
        
        return result;
    }
    
    private class PropInfo
    {
        public string Name { get; set; } = "";
        public string Type { get; set; } = "any";
        public bool Required { get; set; }
        public string? DefaultValue { get; set; }
        public string? Validator { get; set; }
    }
}
