using System.Text;
using System.Text.RegularExpressions;

namespace Soft.Compiler.Emit;

/// <summary>
/// Generates code for @State decorated properties.
/// Transforms local properties into global store accessors.
/// </summary>
public class StateCodeGenerator
{
    public string ProcessStateDecorators(string code)
    {
        // Early return if no @State decorators
        if (!code.Contains("@State"))
            return code;
        
        var result = new StringBuilder();
        var lines = code.Split('\n');
        var stateProperties = new List<StateProperty>();
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            
            // Check for @State decorator
            if (line.Trim().StartsWith("@State"))
            {
                var persist = line.Contains("persist");
                
                // Next line should be the property
                if (i + 1 < lines.Length)
                {
                    var propLine = lines[i + 1];
                    var match = Regex.Match(propLine, @"(\w+)\s*[=:]\s*(.+?);");
                    
                    if (match.Success)
                    {
                        var propName = match.Groups[1].Value;
                        var initialValue = match.Groups[2].Value.Trim();
                        
                        stateProperties.Add(new StateProperty
                        {
                            Name = propName,
                            InitialValue = initialValue,
                            Persist = persist
                        });
                        
                        // Skip the @State line and transform the property
                        i++; // Skip property line too
                        
                        // Generate private backing field
                        result.AppendLine($"    private _{propName}: any = {initialValue};");
                        result.AppendLine();
                        
                        // Generate getter/setter
                        result.AppendLine($"    get {propName}() {{");
                        result.AppendLine($"        return this._{propName};");
                        result.AppendLine($"    }}");
                        result.AppendLine($"    set {propName}(value: any) {{");
                        result.AppendLine($"        this._{propName} = value;");
                        result.AppendLine($"        // TODO: Trigger re-render on state change");
                        result.AppendLine($"    }}");
                        
                        continue;
                    }
                }
            }
            
            result.AppendLine(line);
        }
        
        // Add store subscription in constructor
        if (stateProperties.Any())
        {
            result = AddStoreSubscription(result.ToString(), stateProperties);
        }
        
        return result.ToString();
    }
    
    private StringBuilder AddStoreSubscription(string code, List<StateProperty> stateProps)
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
                
                // Initialize state values
                foreach (var prop in stateProps)
                {
                    result.AppendLine($"        // Initialize {prop.Name}");
                    result.AppendLine($"        this._{prop.Name} = $store.get('{prop.Name}') ?? {prop.InitialValue};");
                }
            }
        }
        
        return result;
    }
    
    private class StateProperty
    {
        public string Name { get; set; } = "";
        public string InitialValue { get; set; } = "";
        public bool Persist { get; set; }
    }
}
