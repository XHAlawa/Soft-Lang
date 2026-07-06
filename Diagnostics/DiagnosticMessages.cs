using Soft.Compiler.Models;
using Soft.Compiler.Language;

namespace Soft.Compiler.Diagnostics;

/// <summary>
/// Helpful diagnostic messages with suggestions.
/// </summary>
public static class DiagnosticMessages
{
    public static Diagnostic UnknownDirective(string directive, SourceLocation location)
    {
        var suggestions = GetDirectiveSuggestions(directive);
        var message = $"Unknown directive: @{directive}";
        
        if (suggestions.Any())
        {
            message += $"\n\nDid you mean: {string.Join(", ", suggestions.Select(s => $"@{s}"))}?";
        }
        
        return new Diagnostic(
            "SOFT001",
            message,
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic UnknownAttribute(string attribute, SourceLocation location)
    {
        var suggestions = GetAttributeSuggestions(attribute);
        var message = $"Unknown attribute: {attribute}";
        
        if (suggestions.Any())
        {
            message += $"\n\nDid you mean: {string.Join(", ", suggestions)}?";
        }
        
        return new Diagnostic(
            "SOFT002",
            message,
            DiagnosticSeverity.Warning,
            location
        );
    }
    
    public static Diagnostic MissingRequiredAttribute(string element, string attribute, SourceLocation location)
    {
        return new Diagnostic(
            "SOFT003",
            $"Element '{element}' requires attribute '{attribute}'\n\nExample: <{element} {attribute}=\"value\">",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic InvalidValidationRule(string rule, SourceLocation location)
    {
        var validRules = new[] { "required", "email", "minlength", "maxlength", "min", "max", "pattern", "url", "number" };
        var message = $"Invalid validation rule: {rule}\n\nValid rules: {string.Join(", ", validRules)}";
        
        return new Diagnostic(
            "SOFT004",
            message,
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic MissingDecorator(string decorator, string context, SourceLocation location)
    {
        return new Diagnostic(
            "SOFT005",
            $"Missing @{decorator} decorator\n\n{context}",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic InvalidSyntax(string expected, string found, SourceLocation location)
    {
        return new Diagnostic(
            "SOFT006",
            $"Syntax error: Expected {expected}, found {found}",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic ComponentNotFound(string componentName, SourceLocation location)
    {
        return new Diagnostic(
            "SOFT007",
            $"Component not found: {componentName}\n\nDid you forget to import it?\n\nExample:\n@importComponent\nimport {componentName} from './{componentName}.s';",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic CircularDependency(string component1, string component2, SourceLocation location)
    {
        return new Diagnostic(
            "SOFT008",
            $"Circular dependency detected: {component1} ↔ {component2}\n\nComponents cannot import each other directly.",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic InvalidPropType(string propName, string expectedType, string actualType, SourceLocation location)
    {
        return new Diagnostic(
            "SOFT009",
            $"Invalid prop type for '{propName}'\n\nExpected: {expectedType}\nReceived: {actualType}",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic MissingRequiredProp(string propName, string componentName, SourceLocation location)
    {
        return new Diagnostic(
            "SOFT010",
            $"Missing required prop: '{propName}' in component '{componentName}'\n\nExample: <{componentName} @{propName}=\"value\" />",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    private static List<string> GetDirectiveSuggestions(string input)
    {
        var knownDirectives = new[]
        {
            "if", "else", "foreach", "switch", "case", "default",
            "slot", "bind", "click", "submit", "ref",
            "show", "disabled", "class", "style",
            "key", "watch", "state", "computed",
            "prop", "custom"
        };
        
        return knownDirectives
            .Where(d => LevenshteinDistance(input.ToLower(), d) <= 2)
            .OrderBy(d => LevenshteinDistance(input.ToLower(), d))
            .Take(3)
            .ToList();
    }
    
    private static List<string> GetAttributeSuggestions(string input)
    {
        var knownAttributes = SoftKeywords.AllBuiltInDirectives;
        
        return knownAttributes
            .Where(a => LevenshteinDistance(input.ToLower(), a.ToLower()) <= 3)
            .OrderBy(a => LevenshteinDistance(input.ToLower(), a.ToLower()))
            .Take(3)
            .ToList();
    }
    
    private static int LevenshteinDistance(string s, string t)
    {
        if (string.IsNullOrEmpty(s)) return string.IsNullOrEmpty(t) ? 0 : t.Length;
        if (string.IsNullOrEmpty(t)) return s.Length;
        
        int n = s.Length;
        int m = t.Length;
        int[,] d = new int[n + 1, m + 1];
        
        for (int i = 0; i <= n; i++) d[i, 0] = i;
        for (int j = 0; j <= m; j++) d[0, j] = j;
        
        for (int i = 1; i <= n; i++)
        {
            for (int j = 1; j <= m; j++)
            {
                int cost = (t[j - 1] == s[i - 1]) ? 0 : 1;
                d[i, j] = Math.Min(Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1), d[i - 1, j - 1] + cost);
            }
        }
        
        return d[n, m];
    }
    
    public static Diagnostic UnknownEvent(string eventName, SourceLocation location)
    {
        var suggestions = GetEventSuggestions(eventName);
        var message = $"Unknown event: @{eventName}";
        
        if (suggestions.Any())
        {
            message += $"\n\nDid you mean: {string.Join(", ", suggestions.Select(s => $"@{s}"))}?";
        }
        else
        {
            message += "\n\nValid events include: click, keydown, submit, input, focus, blur, change, and many more.";
        }
        
        return new Diagnostic(
            DiagnosticIds.UnknownEvent,
            message,
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic InvalidEventModifier(string modifier, SourceLocation location)
    {
        var suggestions = GetModifierSuggestions(modifier);
        var message = $"Invalid event modifier: {modifier}";
        
        if (suggestions.Any())
        {
            message += $"\n\nDid you mean: {string.Join(", ", suggestions)}?";
        }
        else
        {
            message += "\n\nValid modifiers: .stop, .prevent, .capture, .once, .passive, .self";
            message += "\nKey modifiers: .enter, .tab, .esc, .space, .up, .down, .left, .right, .ctrl, .shift, .alt, .meta";
        }
        
        return new Diagnostic(
            DiagnosticIds.InvalidEventModifier,
            message,
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic DuplicateEventModifier(string modifier, SourceLocation location)
    {
        return new Diagnostic(
            DiagnosticIds.DuplicateEventModifier,
            $"Duplicate event modifier: {modifier}\n\nEach modifier can only be used once per event.",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic IncompatibleModifierCombination(string modifier1, string modifier2, SourceLocation location)
    {
        return new Diagnostic(
            DiagnosticIds.IncompatibleModifierCombination,
            $"Incompatible modifier combination: {modifier1} and {modifier2}\n\nThese modifiers cannot be used together.",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    public static Diagnostic KeyModifierOnNonKeyboardEvent(string modifier, string eventName, SourceLocation location)
    {
        return new Diagnostic(
            DiagnosticIds.KeyModifierOnNonKeyboardEvent,
            $"Key modifier '{modifier}' cannot be used with non-keyboard event '@{eventName}'\n\nKey modifiers are only valid with keyboard events (keydown, keyup, keypress).",
            DiagnosticSeverity.Error,
            location
        );
    }
    
    private static List<string> GetEventSuggestions(string input)
    {
        var knownEvents = SoftEventRegistry.AllEvents;
        
        return knownEvents
            .Where(e => LevenshteinDistance(input.ToLower(), e.ToLower()) <= 2)
            .OrderBy(e => LevenshteinDistance(input.ToLower(), e.ToLower()))
            .Take(3)
            .ToList();
    }
    
    private static List<string> GetModifierSuggestions(string input)
    {
        var allModifiers = SoftEventRegistry.AllModifiers.Concat(SoftEventRegistry.AllKeyModifiers);
        
        return allModifiers
            .Where(m => LevenshteinDistance(input.ToLower(), m.ToLower()) <= 2)
            .OrderBy(m => LevenshteinDistance(input.ToLower(), m.ToLower()))
            .Take(3)
            .ToList();
    }
}
