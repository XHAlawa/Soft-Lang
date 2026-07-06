using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Generators;

public class InterpolationGenerator : INodeGenerator
{
    public bool CanGenerate(TemplateNode node) => node is TemplateInterpolation || node is TemplateText;
    
    public string Generate(TemplateNode node, CodeGenerationContext context)
    {
        return node switch
        {
            TemplateInterpolation interp => GenerateInterpolation(interp, context),
            TemplateText text => GenerateText(text, context),
            _ => ""
        };
    }
    
    private string GenerateInterpolation(TemplateInterpolation interp, CodeGenerationContext context)
    {
        var code = new StringBuilder();
        
        // Check if expression is @Navigate command
        if (interp.Expression.Trim().StartsWith("@Navigate"))
        {
            // @Navigate is a statement, not an expression
            // Generate navigation call directly
            var navCode = TransformNavigateCommand(interp.Expression.Trim(), context);
            code.Append(navCode);
            return code.ToString();
        }
        
        var textVar = context.NextVar();
        var textIndex = int.Parse(textVar.Replace("el", "")) - 1;
        var expr = AddThisPrefix(interp.Expression, context.LoopVariables);
        
        // Differential update: reuse text node and update its content
        code.AppendLine($"{context.Indent()}let {textVar}: Text;");
        code.AppendLine($"{context.Indent()}if (isFirstRender) {{");
        code.AppendLine($"{context.Indent()}    {textVar} = document.createTextNode(String({expr}));");
        code.AppendLine($"{context.Indent()}    {context.ParentVar}.appendChild({textVar});");
        code.AppendLine($"{context.Indent()}}} else {{");
        code.AppendLine($"{context.Indent()}    {textVar} = {context.ParentVar}.childNodes[{textIndex}] as Text;");
        code.AppendLine($"{context.Indent()}    if ({textVar} && {textVar}.nodeType === 3) {{");
        code.AppendLine($"{context.Indent()}        {textVar}.textContent = String({expr});");
        code.AppendLine($"{context.Indent()}    }}");
        code.AppendLine($"{context.Indent()}}}");
        
        return code.ToString();
    }
    
    private string GenerateText(TemplateText text, CodeGenerationContext context)
    {
        if (string.IsNullOrWhiteSpace(text.Content)) return "";
        
        var code = new StringBuilder();
        var textVar = context.NextVar();
        var escaped = EscapeString(text.Content);
        
        // Static text nodes don't need differential updates - they never change
        code.AppendLine($"{context.Indent()}const {textVar} = document.createTextNode('{escaped}');");
        code.AppendLine($"{context.Indent()}if (isFirstRender) {{");
        code.AppendLine($"{context.Indent()}    {context.ParentVar}.appendChild({textVar});");
        code.AppendLine($"{context.Indent()}}}");
        
        return code.ToString();
    }
    
    private string AddThisPrefix(string expression, HashSet<string> loopVariables)
    {
        expression = expression.Trim();
        
        if (expression.StartsWith("this.") || expression.StartsWith("!this."))
            return expression;
        
        // Handle negation
        if (expression.StartsWith("!"))
        {
            var rest = expression.Substring(1).Trim();
            if (!rest.StartsWith("this."))
                return "!this." + rest;
            return expression;
        }
        
        // Simple identifier or property access
        var firstPart = expression.Split('.', '(', ' ', '?', '!', '[', '=', '+', '-', '*', '/', '%', '&', '|', '<', '>')[0];
        
        if (loopVariables.Contains(firstPart))
            return expression;
        
        // Simple cases - just add this.
        if (!expression.Contains("(") && !expression.Contains(" ") && !expression.Contains("?"))
            return "this." + expression;
        
        // Extract arrow function parameters to skip them
        var arrowFunctionParams = new HashSet<string>();
        var arrowMatches = System.Text.RegularExpressions.Regex.Matches(expression, @"\(([^)]+?)\)\s*=>");
        foreach (System.Text.RegularExpressions.Match arrowMatch in arrowMatches)
        {
            var paramList = arrowMatch.Groups[1].Value;
            // Extract parameter names, handling both "a, b" and "a: type, b: type"
            foreach (var p in paramList.Split(','))
            {
                var trimmed = p.Trim();
                // Remove type annotations if present (e.g., "a: number" -> "a")
                var colonIndex = trimmed.IndexOf(':');
                if (colonIndex > 0)
                    trimmed = trimmed.Substring(0, colonIndex).Trim();
                
                // Only add if it's a valid identifier
                if (!string.IsNullOrEmpty(trimmed) && char.IsLetter(trimmed[0]))
                {
                    arrowFunctionParams.Add(trimmed);
                }
            }
        }
        
        // Also check for single parameter arrow functions: x => x * 2
        // But not if preceded by ) which means it's part of multi-param arrow function
        var singleParamMatches = System.Text.RegularExpressions.Regex.Matches(expression, @"(?<![)\w])\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=>");
        foreach (System.Text.RegularExpressions.Match singleMatch in singleParamMatches)
        {
            arrowFunctionParams.Add(singleMatch.Groups[1].Value);
        }
        
        // Complex expressions - use regex to add this. to identifiers
        var result = System.Text.RegularExpressions.Regex.Replace(
            expression,
            @"\b([a-zA-Z_][a-zA-Z0-9_]*)\b",
            match =>
            {
                var identifier = match.Value;
                var startIndex = match.Index;
                
                // Skip keywords, loop variables, and arrow function parameters
                if (loopVariables.Contains(identifier) ||
                    arrowFunctionParams.Contains(identifier) ||
                    identifier == "true" || identifier == "false" || identifier == "null" ||
                    identifier == "undefined" || identifier == "this" || identifier == "new" ||
                    identifier == "typeof" || identifier == "void" || identifier == "delete" ||
                    identifier == "in" || identifier == "of" || identifier == "return")
                {
                    return identifier;
                }
                
                // Skip if preceded by dot (property access)
                if (startIndex > 0 && expression[startIndex - 1] == '.')
                    return identifier;
                
                // Skip if already prefixed with this.
                if (startIndex >= 5 && expression.Substring(startIndex - 5, 5) == "this.")
                    return identifier;
                
                // Skip if inside string literal (check for quotes before this position)
                var beforeMatch = expression.Substring(0, startIndex);
                var singleQuotes = beforeMatch.Count(c => c == '\'' && (beforeMatch.IndexOf(c) == 0 || beforeMatch[beforeMatch.IndexOf(c) - 1] != '\\'));
                var doubleQuotes = beforeMatch.Count(c => c == '"' && (beforeMatch.IndexOf(c) == 0 || beforeMatch[beforeMatch.IndexOf(c) - 1] != '\\'));
                
                // If odd number of quotes, we're inside a string
                if (singleQuotes % 2 == 1 || doubleQuotes % 2 == 1)
                    return identifier;
                
                return "this." + identifier;
            });
        
        return result;
    }
    
    private string TransformNavigateCommand(string expression, CodeGenerationContext context)
    {
        // Parse: @Navigate(ComponentName, params, query, state)
        var match = System.Text.RegularExpressions.Regex.Match(expression, @"@Navigate\s*\(([^)]+)\)");
        if (!match.Success)
            return "";
        
        var args = match.Groups[1].Value;
        var parts = SplitArguments(args);
        
        if (parts.Count == 0)
            return "";
        
        var componentName = parts[0].Trim();
        var routeParams = parts.Count > 1 ? parts[1].Trim() : "{}";
        var queryParams = parts.Count > 2 ? parts[2].Trim() : "{}";
        var stateParams = parts.Count > 3 ? parts[3].Trim() : "{}";
        
        // Resolve component name to canonical route
        string canonicalRoute = componentName;
        if (context.SymbolTable != null)
        {
            var symbol = context.SymbolTable.Resolve(componentName);
            if (symbol != null)
            {
                canonicalRoute = symbol.CanonicalRoute;
            }
        }
        
        // Add this. prefix to parameters
        routeParams = AddThisPrefix(routeParams, context.LoopVariables);
        queryParams = AddThisPrefix(queryParams, context.LoopVariables);
        stateParams = AddThisPrefix(stateParams, context.LoopVariables);
        
        // Generate runtime navigation call with resolved canonical route
        var code = new StringBuilder();
        code.AppendLine($"{context.Indent()}__router.navigate('{canonicalRoute}', {routeParams}, {queryParams}, {stateParams});");
        
        return code.ToString();
    }
    
    private List<string> SplitArguments(string args)
    {
        var result = new List<string>();
        var current = new StringBuilder();
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
    
    private string EscapeString(string str)
    {
        return str.Replace("\\", "\\\\")
                  .Replace("'", "\\'")
                  .Replace("\n", "\\n")
                  .Replace("\r", "\\r")
                  .Replace("\t", "\\t");
    }
}
