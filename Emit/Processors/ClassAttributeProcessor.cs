using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Processors;

public class ClassAttributeProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute) => 
        (attribute.IsBinding && attribute.BindingKind == TemplateBindingKind.Class) ||
        (attribute.IsBinding && attribute.Name == "class");
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        // Check if it's @class:name="condition" or @class="expression"
        if (attribute.BindingKind == TemplateBindingKind.Class)
        {
            // @class:active="isActive" syntax
            var className = attribute.BindingExpression; // The class name (e.g., "active")
            var condition = attribute.Value ?? "true";
            
            // Add this. prefix to identifiers in the condition
            condition = AddThisPrefix(condition, context.LoopVariables);
            
            return $"    if ({condition}) {elemVar}.classList.add('{className}');\n";
        }
        else
        {
            // @class="className" syntax - set className attribute from property
            var expression = attribute.BindingExpression ?? attribute.Value ?? "";
            expression = AddThisPrefix(expression, context.LoopVariables);
            
            return $"    {elemVar}.className = String({expression});\n";
        }
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
