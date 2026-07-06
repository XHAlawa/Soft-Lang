using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Processors;

public class StyleAttributeProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute) => 
        (attribute.IsBinding && attribute.BindingKind == TemplateBindingKind.Style) ||
        (attribute.IsBinding && attribute.Name == "style");
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        // Check if it's @style:prop="value" or @style="cssText"
        if (attribute.BindingKind == TemplateBindingKind.Style)
        {
            // @style:color="red" syntax
            var styleProp = attribute.BindingExpression; // The style property (e.g., "color", "font-size")
            var expression = attribute.Value ?? "";
            
            // Convert kebab-case to camelCase for style properties
            styleProp = ConvertToCamelCase(styleProp);
            
            // Add this. prefix to identifiers in the expression
            expression = AddThisPrefix(expression, context.LoopVariables);
            
            return $"    {elemVar}.style.{styleProp} = String({expression});\n";
        }
        else
        {
            // @style="cssText" syntax - set style.cssText from property
            var expression = attribute.BindingExpression ?? attribute.Value ?? "";
            expression = AddThisPrefix(expression, context.LoopVariables);
            
            return $"    {elemVar}.setAttribute('style', String({expression}));\n";
        }
    }
    
    private string AddThisPrefix(string expression, HashSet<string> loopVariables)
    {
        // Simple identifier
        if (System.Text.RegularExpressions.Regex.IsMatch(expression, @"^[a-zA-Z_][a-zA-Z0-9_]*$"))
        {
            if (loopVariables.Contains(expression))
                return expression;
            return "this." + expression;
        }
        
        // Complex expression - add this. to identifiers
        var result = System.Text.RegularExpressions.Regex.Replace(
            expression,
            @"\b([a-zA-Z_][a-zA-Z0-9_]*)\b",
            match =>
            {
                var identifier = match.Value;
                var startIndex = match.Index;
                
                // Skip keywords, literals, and loop variables
                if (identifier == "true" || identifier == "false" || identifier == "null" ||
                    identifier == "undefined" || identifier == "this" || identifier == "new" ||
                    loopVariables.Contains(identifier))
                {
                    return identifier;
                }
                
                // Skip if inside string literal (check for quotes before this position)
                var beforeMatch = expression.Substring(0, startIndex);
                var singleQuotes = beforeMatch.Count(c => c == '\'' && (beforeMatch.IndexOf(c) == 0 || beforeMatch[beforeMatch.IndexOf(c) - 1] != '\\'));
                var doubleQuotes = beforeMatch.Count(c => c == '"' && (beforeMatch.IndexOf(c) == 0 || beforeMatch[beforeMatch.IndexOf(c) - 1] != '\\'));
                
                // If odd number of quotes, we're inside a string
                if (singleQuotes % 2 == 1 || doubleQuotes % 2 == 1)
                    return identifier;
                
                // Skip if already prefixed
                if (startIndex >= 5 && expression.Substring(startIndex - 5, 5) == "this.")
                    return identifier;
                
                // Skip if preceded by dot
                if (startIndex > 0 && expression[startIndex - 1] == '.')
                    return identifier;
                
                return "this." + identifier;
            });
        
        return result;
    }
    
    private string ConvertToCamelCase(string kebabCase)
    {
        var parts = kebabCase.Split('-');
        if (parts.Length == 1) return kebabCase;
        
        var result = parts[0];
        for (int i = 1; i < parts.Length; i++)
        {
            if (parts[i].Length > 0)
            {
                result += char.ToUpper(parts[i][0]) + parts[i].Substring(1);
            }
        }
        return result;
    }
}
