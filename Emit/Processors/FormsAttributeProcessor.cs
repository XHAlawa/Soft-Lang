using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Processors;

/// <summary>
/// Processes Forms field binding syntax: @form.field
/// Generates code to bind HTML elements to Forms fields.
/// </summary>
public class FormsAttributeProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute) => 
        attribute.Name.StartsWith("@") && 
        attribute.Name.Contains(".") &&
        !attribute.IsBinding &&
        !IsEventAttribute(attribute);

    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var code = new StringBuilder();
        
        // Parse @form.field syntax
        var formField = attribute.Name.Substring(1); // Remove @
        var parts = formField.Split('.');
        
        if (parts.Length != 2)
        {
            // Invalid syntax, skip
            return "";
        }
        
        var formName = parts[0];
        var fieldName = parts[1];
        
        // Add this. prefix to form name
        var prefixedForm = AddThisPrefix(formName, context.LoopVariables);
        
        // Generate forms.bind() call
        code.AppendLine($"    import {{ bind }} from './Runtime/forms';");
        code.AppendLine($"    bind({elemVar}, {prefixedForm}, '{fieldName}');");
        
        return code.ToString();
    }
    
    private bool IsEventAttribute(TemplateAttribute attribute)
    {
        // Check if it's an event attribute by checking the binding kind
        return attribute.IsBinding && attribute.BindingKind == TemplateBindingKind.Event;
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
