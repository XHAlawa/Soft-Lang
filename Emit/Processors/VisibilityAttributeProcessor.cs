using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;
using Soft.Compiler.Language;

namespace Soft.Compiler.Emit.Processors;

public class VisibilityAttributeProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute) => 
        attribute.Name == SoftKeywords.Show || 
        attribute.Name == "show" ||
        attribute.Name == SoftKeywords.Disabled || 
        attribute.Name == "disabled" ||
        attribute.Name == SoftKeywords.Visible ||
        attribute.Name == "visible" ||
        (attribute.IsBinding && (attribute.BindingKind == TemplateBindingKind.Visible || 
                                  attribute.Name == "disabled" || 
                                  attribute.Name == "enabled"));
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var expression = attribute.Value ?? "";
        var name = attribute.Name.TrimStart('@');
        
        // Add this. prefix to identifiers in the expression
        expression = AddThisPrefix(expression, context.LoopVariables);
        
        if (name == "show" || name == "visible" || name == "if")
        {
            return $"    {elemVar}.style.display = ({expression}) ? '' : 'none';\n";
        }
        else if (name == "disabled")
        {
            return $"    {elemVar}.disabled = {expression};\n";
        }
        else if (name == "enabled")
        {
            return $"    {elemVar}.disabled = !({expression});\n";
        }
        
        return "";
    }
    
    private string AddThisPrefix(string expression, HashSet<string> loopVariables)
    {
        // Simple identifier
        if (System.Text.RegularExpressions.Regex.IsMatch(expression, @"^[a-zA-Z_][a-zA-Z0-9_]*$"))
        {
            // Skip literals and loop variables
            if (expression == "true" || expression == "false" || expression == "null" ||
                expression == "undefined" || loopVariables.Contains(expression))
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
                
                // Skip if inside string literal
                var beforeMatch = expression.Substring(0, startIndex);
                var singleQuotes = beforeMatch.Count(c => c == '\'');
                var doubleQuotes = beforeMatch.Count(c => c == '"');
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
}
