using System.Text;

namespace Soft.Compiler.Emit;

/// <summary>
/// Processes @property decorators by simply removing them.
/// @property is just a marker - the property itself is plain TypeScript.
/// </summary>
public class PropertyCodeGenerator
{
    public string ProcessPropertyDecorators(string code)
    {
        // Early return if no @property decorators
        if (!code.Contains("@property"))
            return code;
        
        var result = new StringBuilder();
        var lines = code.Split('\n');
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            
            // Check for @property decorator
            if (line.Trim().StartsWith("@property"))
            {
                // Skip the @property line - the next line is the actual property declaration
                // which should be kept as-is
                continue;
            }
            
            result.AppendLine(line);
        }
        
        return result.ToString();
    }
}
