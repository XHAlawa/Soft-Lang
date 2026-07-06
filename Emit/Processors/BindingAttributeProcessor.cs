using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Processors;

public class BindingAttributeProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute) => 
        attribute.IsBinding && attribute.BindingKind == TemplateBindingKind.TwoWay;
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var code = new StringBuilder();
        
        // Add unique focus identifier for focus preservation
        code.AppendLine($"    {elemVar}.setAttribute('data-focus-id', '{elemVar}');");
        
        // For @bind="name", the property name is in BindingExpression
        // For @bind:value="name", the target is in BindingExpression and property in Value
        var expression = attribute.BindingExpression ?? attribute.Value ?? "";
        var modifiers = new List<string>();
        
        // Parse modifiers: value.trim.number.lazy.debounce:300
        if (expression.Contains("."))
        {
            var parts = expression.Split('.');
            expression = parts[0];
            modifiers.AddRange(parts.Skip(1));
        }
        
        // Determine bind target based on element type
        var bindTarget = "value";
        var inputType = context.AllAttributes.FirstOrDefault(a => a.Name == "type")?.Value?.ToLower();
        if (inputType == "checkbox" || inputType == "radio")
        {
            bindTarget = "checked";
        }
        
        // Add this. prefix to identifiers in the expression
        var prefixedExpr = AddThisPrefix(expression, context.LoopVariables);
        
        // Check if expression is a literal (read-only binding)
        var isLiteral = expression == "true" || expression == "false" || expression == "null" ||
                        expression == "undefined" || 
                        (expression.StartsWith("'") && expression.EndsWith("'")) ||
                        (expression.StartsWith("\"") && expression.EndsWith("\"")) ||
                        double.TryParse(expression, out _);
        
        // Set initial value
        if (bindTarget == "value")
        {
            code.AppendLine($"    {elemVar}.value = String({prefixedExpr} ?? '');");
        }
        else if (bindTarget == "checked")
        {
            code.AppendLine($"    {elemVar}.checked = Boolean({prefixedExpr});");
        }
        
        // Skip two-way binding for literals (read-only)
        if (isLiteral)
        {
            return code.ToString();
        }
        
        // Determine event name based on element type and modifiers
        var eventName = bindTarget == "checked" ? "change" : "input";
        if (context.ElementTag.ToLower() == "select")
        {
            eventName = "change";
        }
        else if (modifiers.Contains("lazy"))
        {
            eventName = "change";
        }
        
        // Check if explicit event handler exists for same event
        var explicitEventAttr = context.AllAttributes.FirstOrDefault(a => 
            a.IsBinding && 
            a.BindingKind == TemplateBindingKind.Event &&
            (a.Name == eventName || a.Name.StartsWith($"{eventName}.")));
        
        // Check for debounce modifier
        var debounceMs = 0;
        foreach (var modifier in modifiers)
        {
            if (modifier.StartsWith("debounce:"))
            {
                int.TryParse(modifier.Substring(9), out debounceMs);
            }
            else if (modifier == "debounce")
            {
                debounceMs = 300; // Default debounce
            }
        }
        
        if (debounceMs > 0)
        {
            // Generate debounced handler
            code.AppendLine($"    let {elemVar}_debounceTimer;");
            code.AppendLine($"    {elemVar}.addEventListener('{eventName}', (e) => {{");
            code.AppendLine($"        clearTimeout({elemVar}_debounceTimer);");
            code.AppendLine($"        {elemVar}_debounceTimer = setTimeout(() => {{");
        }
        else
        {
            code.AppendLine($"    {elemVar}.addEventListener('{eventName}', (e) => {{");
        }
        
        var indent = debounceMs > 0 ? "            " : "        ";
        
        if (bindTarget == "value")
        {
            var value = "(e.target as HTMLInputElement).value";
            
            // Auto-convert for number inputs
            if (inputType == "number")
            {
                value = $"Number({value})";
            }
            
            foreach (var modifier in modifiers)
            {
                if (modifier == "trim")
                    value = $"{value}.trim()";
                else if (modifier == "number")
                    value = $"Number({value})";
            }
            
            code.AppendLine($"{indent}{prefixedExpr} = {value};");
        }
        else if (bindTarget == "checked")
        {
            code.AppendLine($"{indent}{prefixedExpr} = (e.target as HTMLInputElement).checked;");
        }
        
        // Call explicit event handler if exists
        if (explicitEventAttr != null)
        {
            var handler = explicitEventAttr.BindingExpression ?? explicitEventAttr.Value ?? "";
            if (!string.IsNullOrEmpty(handler))
            {
                // Security: Validate handler expression
                if (!IsValidEventHandler(handler))
                {
                    throw new InvalidOperationException(
                        $"Invalid event handler expression: '{handler}'. Event handlers must be valid method calls.");
                }
                code.AppendLine($"{indent}this.{handler};");
            }
        }
        
        code.AppendLine($"{indent}this.__scheduleRender();");
        
        if (debounceMs > 0)
        {
            code.AppendLine($"        }}, {debounceMs});");
        }
        
        code.AppendLine($"    }});");
        
        // Add cleanup for debounce timer to prevent memory leaks
        if (debounceMs > 0)
        {
            code.AppendLine($"    this.__cleanup.push(() => clearTimeout({elemVar}_debounceTimer));");
        }
        
        return code.ToString();
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
                
                // Skip if inside string literal (check for quotes before this position)
                var beforeMatch = expression.Substring(0, startIndex);
                int singleQuotes = 0, doubleQuotes = 0;
                bool escaped = false;
                
                for (int i = 0; i < beforeMatch.Length; i++)
                {
                    char c = beforeMatch[i];
                    if (c == '\\' && !escaped)
                    {
                        escaped = true;
                        continue;
                    }
                    if (!escaped)
                    {
                        if (c == '\'') singleQuotes++;
                        if (c == '"') doubleQuotes++;
                    }
                    escaped = false;
                }
                
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
    
    private bool IsValidEventHandler(string handler)
    {
        if (string.IsNullOrWhiteSpace(handler))
            return false;
        
        // Check for dangerous patterns that could indicate code injection
        var dangerousPatterns = new[]
        {
            "';",           // String termination attempt
            "\";",          // String termination attempt
            "//",           // Comment injection
            "/*",           // Block comment injection
            "*/",           // Block comment injection
            "<script",      // Script tag injection
            "javascript:",  // JavaScript protocol
            "eval(",        // Direct eval
            "Function(",    // Function constructor
            "setTimeout(",  // Indirect eval
            "setInterval(", // Indirect eval
        };
        
        foreach (var pattern in dangerousPatterns)
        {
            if (handler.Contains(pattern, StringComparison.OrdinalIgnoreCase))
                return false;
        }
        
        // Must contain only valid TypeScript expression characters
        var validPattern = @"^[@a-zA-Z0-9_$.\(\)\[\]\{\}+\-*/%=<>!&|?:,\s'""]+$";
        if (!System.Text.RegularExpressions.Regex.IsMatch(handler, validPattern))
            return false;
        
        return true;
    }
}
