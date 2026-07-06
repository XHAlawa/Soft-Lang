namespace Soft.Compiler.Language;

/// <summary>
/// Single source of truth for all Soft language keywords and directives.
/// </summary>
public static class SoftKeywords
{
    // Block-level directives
    public const string Page = "@Page";
    public const string Service = "@Service";
    public const string Template = "@Template";
    public const string Style = "@Style";
    public const string Code = "@Code";
    public const string ImportComponent = "@importComponent";
    
    // Navigation commands
    public const string Navigate = "@Navigate";
    
    // Control flow directives
    public const string If = "@if";
    public const string ElseIf = "@else if";
    public const string Else = "@else";
    public const string ForEach = "@foreach";
    public const string For = "@for";
    public const string Switch = "@switch";
    public const string Case = "@case";
    public const string Default = "@default";
    
    // Attribute directives (with colon)
    public const string BindPrefix = "@bind:";
    public const string BindValue = "@bind:value";
    public const string BindChecked = "@bind:checked";
    public const string ClassPrefix = "@class:";
    public const string StylePrefix = "@style:";
    public const string NavPrefix = "@nav:";
    
    // Attribute directives (standalone)
    public const string Key = "@key";
    public const string Ref = "@ref";
    
    // Event directives - all events are now sourced from SoftEventRegistry
    // Common event shortcuts (for backward compatibility and convenience)
    public const string Click = "@click";
    public const string Change = "@change";
    public const string Input = "@input";
    public const string Submit = "@submit";
    public const string Focus = "@focus";
    public const string Blur = "@blur";
    public const string KeyDown = "@keydown";
    public const string KeyUp = "@keyup";
    public const string MouseEnter = "@mouseenter";
    public const string MouseLeave = "@mouseleave";
    
    // Visibility directives
    public const string Show = "@show";
    public const string Visible = "@visible";
    public const string Disabled = "@disabled";
    public const string Enabled = "@enabled";
    public const string ReadOnly = "@readonly";
    
    // Arrays for bulk operations
    public static readonly string[] ControlFlowDirectives = new[]
    {
        If, ElseIf, Else, ForEach, For, Switch, Case, Default
    };
    
    public static readonly string[] AttributeDirectivePrefixes = new[]
    {
        BindPrefix, ClassPrefix, StylePrefix, NavPrefix
    };
    
    public static readonly string[] StandaloneAttributeDirectives = new[]
    {
        Key, Ref
    };
    
    // Event directives - sourced from SoftEventRegistry
    public static readonly string[] EventDirectives = SoftEventRegistry.AllEvents
        .Select(e => $"@{e}")
        .Concat(new[] { Click, Change, Input, Submit, Focus, Blur, KeyDown, KeyUp, MouseEnter, MouseLeave })
        .Distinct()
        .ToArray();
    
    public static readonly string[] VisibilityDirectives = new[]
    {
        Show, Visible, Disabled, Enabled, ReadOnly
    };
    
    public static readonly string[] AllBuiltInDirectives = SoftEventRegistry.AllEvents
        .Select(e => $"@{e}")
        .Concat(new[]
        {
            // Prefixes
            BindPrefix, ClassPrefix, StylePrefix,
            // Standalone
            Key, Ref,
            // Common event shortcuts
            Click, Change, Input, Submit, Focus, Blur, KeyDown, KeyUp, MouseEnter, MouseLeave,
            // Visibility
            Show, Visible, Disabled, Enabled, ReadOnly
        })
        .ToArray();
    
    public static readonly string[] TemplateDirectives = new[]
    {
        If, ElseIf, Else, ForEach, For, Switch, Case, Default
    };
    
    public static bool IsControlFlowDirective(string directive)
    {
        return directive == If || directive == ElseIf || directive == Else ||
               directive == ForEach || directive == For ||
               directive == Switch || directive == Case || directive == Default;
    }
    
    public static bool IsBuiltInDirective(string attributeName)
    {
        foreach (var prefix in AttributeDirectivePrefixes)
        {
            if (attributeName.StartsWith(prefix))
                return true;
        }
        
        foreach (var directive in AllBuiltInDirectives)
        {
            if (attributeName == directive || attributeName.StartsWith(directive))
                return true;
        }
        
        return false;
    }
    
    /// <summary>
    /// Check if an attribute is an event directive
    /// Uses SoftEventRegistry for comprehensive event validation
    /// </summary>
    public static bool IsEventDirective(string attributeName)
    {
        if (string.IsNullOrWhiteSpace(attributeName))
            return false;
        
        // Check if it starts with @
        if (!attributeName.StartsWith("@"))
            return false;
        
        // Remove @ prefix and check against registry
        var eventName = attributeName.Substring(1);
        return SoftEventRegistry.IsValidEvent(eventName);
    }
}
