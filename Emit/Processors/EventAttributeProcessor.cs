using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;
using Soft.Compiler.Language;

namespace Soft.Compiler.Emit.Processors;

public class EventAttributeProcessor : IAttributeProcessor
{
    // All event validation now uses SoftEventRegistry
    
    public bool CanProcess(TemplateAttribute attribute)
    {
        // Check if it's an event binding
        return attribute.IsBinding && attribute.BindingKind == TemplateBindingKind.Event;
    }
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var code = new StringBuilder();
        var name = attribute.Name; // Already processed by parser
        var modifiers = new List<string>();
        
        // Parse modifiers: click.prevent.stop
        if (name.Contains("."))
        {
            var parts = name.Split('.');
            name = parts[0];
            modifiers.AddRange(parts.Skip(1));
        }
        
        // Normalize event name using the registry
        var eventName = SoftEventRegistry.NormalizeEventName(name);
        var handler = attribute.BindingExpression ?? attribute.Value ?? "";
        
        // Validate event name
        if (!SoftEventRegistry.IsValidEvent(eventName))
        {
            // Invalid event - diagnostic should have been reported by parser
            return "";
        }
        
        // Validate modifiers
        if (!SoftEventRegistry.IsValidModifierCombination(modifiers))
        {
            // Invalid modifier combination - diagnostic should have been reported by parser
            return "";
        }
        
        // Check if @bind exists for same event (binding processor will merge handlers)
        var hasBindForSameEvent = context.AllAttributes.Any(a => 
            a.IsBinding && 
            a.BindingKind == TemplateBindingKind.TwoWay &&
            ((context.ElementTag.ToLower() == "select" && eventName == "change") ||
             (eventName == "input" && a.BindingExpression == "value") ||
             (eventName == "change" && a.BindingExpression == "checked")));
        
        if (hasBindForSameEvent)
        {
            // Binding processor will call this handler, skip duplicate listener
            return "";
        }
        
        // Generate handler function and cleanup registration
        code.AppendLine($"    const handler_{elemVar}_{eventName} = (e) => {{");
        
        // Apply DOM event modifiers
        foreach (var modifier in modifiers)
        {
            var normalizedModifier = modifier.ToLowerInvariant();
            
            if (normalizedModifier == SoftEventRegistry.ModifierPrevent)
                code.AppendLine("        e.preventDefault();");
            else if (normalizedModifier == SoftEventRegistry.ModifierStop)
                code.AppendLine("        e.stopPropagation();");
            else if (normalizedModifier == SoftEventRegistry.ModifierSelf)
                code.AppendLine("        if (e.target !== e.currentTarget) return;");
            // capture, passive, once are handled by addEventListener options
            // Key modifiers
            else if (normalizedModifier == "enter")
                code.AppendLine("        if (e.key !== 'Enter') return;");
            else if (normalizedModifier == "tab")
                code.AppendLine("        if (e.key !== 'Tab') return;");
            else if (normalizedModifier == "esc" || normalizedModifier == "escape")
                code.AppendLine("        if (e.key !== 'Escape') return;");
            else if (normalizedModifier == "space")
                code.AppendLine("        if (e.key !== ' ') return;");
            else if (normalizedModifier == "up")
                code.AppendLine("        if (e.key !== 'ArrowUp') return;");
            else if (normalizedModifier == "down")
                code.AppendLine("        if (e.key !== 'ArrowDown') return;");
            else if (normalizedModifier == "left")
                code.AppendLine("        if (e.key !== 'ArrowLeft') return;");
            else if (normalizedModifier == "right")
                code.AppendLine("        if (e.key !== 'ArrowRight') return;");
            else if (normalizedModifier == "delete")
                code.AppendLine("        if (e.key !== 'Delete') return;");
            else if (normalizedModifier == "backspace")
                code.AppendLine("        if (e.key !== 'Backspace') return;");
            else if (normalizedModifier == "insert")
                code.AppendLine("        if (e.key !== 'Insert') return;");
            else if (normalizedModifier == "home")
                code.AppendLine("        if (e.key !== 'Home') return;");
            else if (normalizedModifier == "end")
                code.AppendLine("        if (e.key !== 'End') return;");
            else if (normalizedModifier == "pageup")
                code.AppendLine("        if (e.key !== 'PageUp') return;");
            else if (normalizedModifier == "pagedown")
                code.AppendLine("        if (e.key !== 'PageDown') return;");
            // System key modifiers
            else if (normalizedModifier == "ctrl")
                code.AppendLine("        if (!e.ctrlKey) return;");
            else if (normalizedModifier == "shift")
                code.AppendLine("        if (!e.shiftKey) return;");
            else if (normalizedModifier == "alt")
                code.AppendLine("        if (!e.altKey) return;");
            else if (normalizedModifier == "meta")
                code.AppendLine("        if (!e.metaKey) return;");
            else if (normalizedModifier == "exact")
            {
                // Only trigger if no other system keys are pressed
                code.AppendLine("        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;");
            }
        }
        
        // Transform @Navigate commands
        var transformedHandler = handler;
        var isNavigateCommand = handler.Contains("@Navigate");
        
        // Bug #1: Also check for navigation method calls ($navigate, navigate, etc.)
        // Also check for method names that might navigate (goTo, navigateTo, etc.)
        var isNavigationCall = handler.Contains("$navigate") || 
                                handler.Contains("navigate(") || 
                                handler.Contains("replace(");
        
        var isNavigationMethod = handler.Contains("goTo") || 
                                 handler.Contains("navigateTo") ||
                                 handler.Contains("redirectTo") ||
                                 handler.Contains("pushState") ||
                                 handler.Contains("replaceState");
        
        // Security: Validate handler expression to prevent code injection
        if (!IsValidEventHandler(handler))
        {
            throw new InvalidOperationException(
                $"Security: Invalid event handler expression '{handler}'. Event handlers must be valid method calls or property assignments. " +
                $"Dangerous patterns like '; or eval() are not allowed.");
        }
        
        if (isNavigateCommand)
        {
            // Bug #24: Transform @Navigate and add 'this.' prefix to property references
            var navigateCode = TransformNavigateCommand(handler, context);
            transformedHandler = AddThisPrefixToNavigate(navigateCode);
        }
        else
        {
            // Add 'this.' prefix to method calls
            transformedHandler = AddThisPrefix(transformedHandler);
            
            // If it's a simple identifier (method name without parentheses), add ()
            if (System.Text.RegularExpressions.Regex.IsMatch(transformedHandler.Trim(), @"^this\.[a-zA-Z_$][a-zA-Z0-9_$]*$"))
            {
                transformedHandler += "()";
            }
        }
        
        code.AppendLine($"        {transformedHandler};");
        
        // Bug #1: Only add queueMicrotask for local state mutations, not navigation
        // Navigation triggers component mount/render through router, so re-rendering
        // the old component after navigation would overwrite the new component's render
        if (!isNavigateCommand && !isNavigationCall && !isNavigationMethod)
        {
            code.AppendLine($"        this.__scheduleRender();");
        }
        
        code.AppendLine($"    }};");
        code.AppendLine();
        
        // Add event listener with options
        var options = new List<string>();
        if (modifiers.Any(m => m.ToLowerInvariant() == SoftEventRegistry.ModifierCapture)) 
            options.Add("capture: true");
        if (modifiers.Any(m => m.ToLowerInvariant() == SoftEventRegistry.ModifierPassive)) 
            options.Add("passive: true");
        if (modifiers.Any(m => m.ToLowerInvariant() == SoftEventRegistry.ModifierOnce)) 
            options.Add("once: true");
        
        if (options.Any())
        {
            code.AppendLine($"    {elemVar}.addEventListener('{eventName}', handler_{elemVar}_{eventName}, {{ {string.Join(", ", options)} }});");
        }
        else
        {
            code.AppendLine($"    {elemVar}.addEventListener('{eventName}', handler_{elemVar}_{eventName});");
        }
        
        // Register cleanup
        code.AppendLine($"    this.__cleanup.push(() => {elemVar}.removeEventListener('{eventName}', handler_{elemVar}_{eventName}));");
        
        return code.ToString();
    }
    
    private string AddThisPrefix(string expression)
    {
        // Skip if already has this. or is a simple assignment
        if (expression.Contains("this.") || expression.Contains("=") && !expression.Contains("=="))
            return expression;
            
        // Skip string literals
        var inString = false;
        var stringChar = '\0';
        var result = new StringBuilder();
        
        for (int i = 0; i < expression.Length; i++)
        {
            var c = expression[i];
            
            if ((c == '"' || c == '\'' || c == '`') && (i == 0 || expression[i - 1] != '\\'))
            {
                if (!inString)
                {
                    inString = true;
                    stringChar = c;
                }
                else if (c == stringChar)
                {
                    inString = false;
                }
            }
            
            result.Append(c);
        }
        
        // Simple identifier-based replacement for method calls with ()
        var identifierPattern = @"\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(";
        var matches = System.Text.RegularExpressions.Regex.Matches(expression, identifierPattern);
        
        if (matches.Count > 0)
        {
            var offset = 0;
            var sb = new StringBuilder(expression);
            
            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                var identifier = match.Groups[1].Value;
                
                // Skip known globals and keywords
                if (identifier == "console" || identifier == "Math" || identifier == "Date" || 
                    identifier == "Number" || identifier == "String" || identifier == "Boolean" ||
                    identifier == "Array" || identifier == "Object" || identifier == "JSON" ||
                    identifier == "parseInt" || identifier == "parseFloat" || identifier == "isNaN" ||
                    identifier == "setTimeout" || identifier == "setInterval" || identifier == "fetch" ||
                    identifier == "alert" || identifier == "confirm" || identifier == "prompt")
                    continue;
                    
                // Add this. prefix
                sb.Insert(match.Index + offset, "this.");
                offset += 5; // "this.".Length
            }
            
            return sb.ToString();
        }
        
        // No method calls with () found - check if it's a bare identifier (method name without ())
        if (System.Text.RegularExpressions.Regex.IsMatch(expression.Trim(), @"^[a-zA-Z_$][a-zA-Z0-9_$]*$"))
        {
            return "this." + expression.Trim();
        }
        
        return expression;
    }
    
    private string AddThisPrefixToNavigate(string navigateCode)
    {
        // Bug #24: Add 'this.' prefix to property references in navigate expressions
        // Parse the navigate call and only add 'this.' to identifiers outside of string literals and object keys
        
        var result = new System.Text.StringBuilder();
        var inSingleQuote = false;
        var inDoubleQuote = false;
        var i = 0;
        
        while (i < navigateCode.Length)
        {
            var c = navigateCode[i];
            
            // Track quote state
            if (c == '\'' && (i == 0 || navigateCode[i - 1] != '\\'))
            {
                inSingleQuote = !inSingleQuote;
                result.Append(c);
                i++;
                continue;
            }
            if (c == '"' && (i == 0 || navigateCode[i - 1] != '\\'))
            {
                inDoubleQuote = !inDoubleQuote;
                result.Append(c);
                i++;
                continue;
            }
            
            // If inside quotes, just copy
            if (inSingleQuote || inDoubleQuote)
            {
                result.Append(c);
                i++;
                continue;
            }
            
            // Check if this is the start of an identifier
            if (char.IsLetter(c) || c == '_')
            {
                var identifierStart = i;
                var identifier = new System.Text.StringBuilder();
                identifier.Append(c);
                i++;
                
                while (i < navigateCode.Length && (char.IsLetterOrDigit(navigateCode[i]) || navigateCode[i] == '_'))
                {
                    identifier.Append(navigateCode[i]);
                    i++;
                }
                
                var identifierStr = identifier.ToString();
                
                // Check if we should add 'this.' prefix
                var shouldPrefix = identifierStr != "__router" && identifierStr != "navigate" &&
                                   identifierStr != "this" && identifierStr != "e" && 
                                   identifierStr != "window" && identifierStr != "document" &&
                                   identifierStr != "console" && identifierStr != "undefined" &&
                                   identifierStr != "null" && identifierStr != "true" && identifierStr != "false";
                
                // Don't prefix if followed by '(' (it's a function call)
                if (i < navigateCode.Length && navigateCode[i] == '(')
                {
                    shouldPrefix = false;
                }
                
                // Don't prefix if followed by ':' (it's an object key)
                var nextNonSpace = i;
                while (nextNonSpace < navigateCode.Length && char.IsWhiteSpace(navigateCode[nextNonSpace]))
                {
                    nextNonSpace++;
                }
                if (nextNonSpace < navigateCode.Length && navigateCode[nextNonSpace] == ':')
                {
                    shouldPrefix = false;
                }
                
                // Don't prefix if preceded by 'this.'
                if (identifierStart >= 5 && navigateCode.Substring(identifierStart - 5, 5) == "this.")
                {
                    shouldPrefix = false;
                }
                
                if (shouldPrefix)
                {
                    result.Append("this.");
                }
                result.Append(identifierStr);
            }
            else
            {
                result.Append(c);
                i++;
            }
        }
        
        return result.ToString();
    }
    
    private string TransformNavigateCommand(string expression, AttributeProcessingContext context)
    {
        var match = System.Text.RegularExpressions.Regex.Match(expression, @"@Navigate\s*\(([^)]+)\)");
        if (!match.Success) return expression;
        
        var args = match.Groups[1].Value;
        var parts = SplitArguments(args);
        
        if (parts.Count == 0) return expression;
        
        var firstArg = parts[0].Trim();
        var routeParams = parts.Count > 1 ? parts[1].Trim() : "{}";
        var queryParams = parts.Count > 2 ? parts[2].Trim() : "{}";
        var stateParams = parts.Count > 3 ? parts[3].Trim() : "{}";
        
        // Bug #24: Check if first argument is a complete string literal or an expression
        string routeExpression;
        var isStringLiteral = (firstArg.StartsWith("'") && firstArg.EndsWith("'") && !firstArg.Contains(" + ")) ||
                              (firstArg.StartsWith("\"") && firstArg.EndsWith("\"") && !firstArg.Contains(" + "));
        
        if (isStringLiteral)
        {
            // String literal - try to resolve component name
            var componentName = firstArg.Trim('\'', '"');
            string canonicalRoute = componentName;
            if (context.SymbolTable != null)
            {
                var symbol = context.SymbolTable.Resolve(componentName);
                if (symbol != null)
                {
                    canonicalRoute = symbol.CanonicalRoute;
                }
            }
            routeExpression = $"'{canonicalRoute}'";
        }
        else
        {
            // Expression (e.g., '/customers/' + params.id) - use as-is
            routeExpression = firstArg;
        }
        
        return $"__router.navigate({routeExpression}, {routeParams}, {queryParams}, {stateParams})";
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
        // Allow: alphanumeric, dots, parentheses, brackets, operators, quotes, spaces
        var validPattern = @"^[@a-zA-Z0-9_$.\(\)\[\]\{\}+\-*/%=<>!&|?:,\s'""]+$";
        if (!System.Text.RegularExpressions.Regex.IsMatch(handler, validPattern))
            return false;
        
        return true;
    }
    
    private List<string> SplitArguments(string args)
    {
        var result = new List<string>();
        var current = new System.Text.StringBuilder();
        var depth = 0;
        
        foreach (var c in args)
        {
            if (c == ',' && depth == 0)
            {
                result.Add(current.ToString());
                current.Clear();
            }
            else
            {
                if (c == '(' || c == '{' || c == '[') depth++;
                if (c == ')' || c == '}' || c == ']') depth--;
                current.Append(c);
            }
        }
        
        if (current.Length > 0)
            result.Add(current.ToString());
        
        return result;
    }
}
