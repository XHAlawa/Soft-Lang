using System.Text;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Models;
using Soft.Compiler.Language;

namespace Soft.Compiler.Template.Parser;

/// <summary>
/// Parses HTML/template attributes and bindings.
/// Extracted from monolithic TemplateParser.
/// </summary>
public class AttributeParser
{
    private readonly IDiagnosticReporter _diagnosticReporter;
    
    public AttributeParser(IDiagnosticReporter diagnosticReporter)
    {
        _diagnosticReporter = diagnosticReporter;
    }
    
    public TemplateAttribute ParseAttribute(string name, string? value, string elementTag, SourceLocation location)
    {
        var attr = new TemplateAttribute
        {
            Name = name,
            Value = value,
            Location = location
        };
        
        // Check if it's a binding attribute
        if (name.StartsWith("@"))
        {
            attr.IsBinding = true;
            ParseBindingAttribute(attr, elementTag);
        }
        
        return attr;
    }
    
    private void ParseBindingAttribute(TemplateAttribute attr, string elementTag)
    {
        var name = attr.Name.Substring(1); // Remove @
        
        // Event bindings
        if (IsEventBinding(name))
        {
            attr.BindingKind = TemplateBindingKind.Event;
            
            var eventName = name.StartsWith("on", StringComparison.OrdinalIgnoreCase) 
                ? name.Substring(2) 
                : name;
            
            // Parse modifiers: click.prevent.stop
            var modifiers = new List<string>();
            if (eventName.Contains("."))
            {
                var parts = eventName.Split('.');
                eventName = parts[0];
                modifiers.AddRange(parts.Skip(1));
            }
            
            // Normalize and validate event name
            var normalizedEventName = SoftEventRegistry.NormalizeEventName(eventName);
            
            if (!SoftEventRegistry.IsValidEvent(normalizedEventName))
            {
                _diagnosticReporter.Report(DiagnosticMessages.UnknownEvent(normalizedEventName, attr.Location));
            }
            
            // Validate modifiers
            foreach (var modifier in modifiers)
            {
                var normalizedModifier = modifier.ToLowerInvariant();
                
                if (!SoftEventRegistry.IsValidModifier(normalizedModifier))
                {
                    _diagnosticReporter.Report(DiagnosticMessages.InvalidEventModifier(modifier, attr.Location));
                }
                
                // Check if key modifier is used with non-keyboard event
                if (SoftEventRegistry.IsKeyModifier(normalizedModifier))
                {
                    var category = SoftEventRegistry.GetEventCategory(normalizedEventName);
                    if (category != "Keyboard")
                    {
                        _diagnosticReporter.Report(DiagnosticMessages.KeyModifierOnNonKeyboardEvent(modifier, normalizedEventName, attr.Location));
                    }
                }
            }
            
            // Check for duplicate modifiers
            var uniqueModifiers = modifiers.Select(m => m.ToLowerInvariant()).Distinct().ToList();
            if (uniqueModifiers.Count != modifiers.Count)
            {
                var duplicates = modifiers.GroupBy(m => m.ToLowerInvariant())
                    .Where(g => g.Count() > 1)
                    .Select(g => g.First());
                
                foreach (var duplicate in duplicates)
                {
                    _diagnosticReporter.Report(DiagnosticMessages.DuplicateEventModifier(duplicate, attr.Location));
                }
            }
            
            // Check for incompatible modifier combinations
            if (!SoftEventRegistry.IsValidModifierCombination(modifiers))
            {
                // Find the conflicting modifiers
                var hasPassive = modifiers.Any(m => m.ToLowerInvariant() == SoftEventRegistry.ModifierPassive);
                var hasPrevent = modifiers.Any(m => m.ToLowerInvariant() == SoftEventRegistry.ModifierPrevent);
                
                if (hasPassive && hasPrevent)
                {
                    _diagnosticReporter.Report(DiagnosticMessages.IncompatibleModifierCombination(
                        SoftEventRegistry.ModifierPassive, 
                        SoftEventRegistry.ModifierPrevent, 
                        attr.Location
                    ));
                }
            }
            
            var colonIndex = eventName.IndexOf(':');
            if (colonIndex > 0)
            {
                attr.Name = eventName.Substring(0, colonIndex);
                attr.BindingExpression = eventName.Substring(colonIndex + 1);
            }
            else
            {
                attr.Name = eventName;
                attr.BindingExpression = attr.Value;
            }
            
            // Store modifiers in the attribute for later processing
            if (modifiers.Count > 0)
            {
                // Store modifiers in a special format that the processor can parse
                attr.Name = $"{attr.Name}.{string.Join(".", modifiers)}";
            }
            
            return;
        }
        
        // Special directives without colon: @bind, @if, @class, @style, @disabled, @show, @visible
        var nameLower = name.ToLowerInvariant();
        if (nameLower == "bind" || nameLower == "if" || nameLower == "class" || nameLower == "style" || nameLower == "disabled" || nameLower == "enabled" || nameLower == "show" || nameLower == "visible")
        {
            attr.BindingKind = nameLower switch
            {
                "bind" => TemplateBindingKind.TwoWay,
                "if" => TemplateBindingKind.Visible,
                "class" => TemplateBindingKind.PropertyExtension, // Will be handled specially
                "style" => TemplateBindingKind.PropertyExtension, // Will be handled specially
                "visible" => TemplateBindingKind.Visible,
                "show" => TemplateBindingKind.Visible,
                "enabled" => TemplateBindingKind.Enabled,
                "disabled" => TemplateBindingKind.PropertyExtension,
                _ => TemplateBindingKind.PropertyExtension
            };
            attr.Name = nameLower;
            attr.BindingExpression = attr.Value;
            return;
        }
        
        // Property binding with colon: @property:expression
        var colonIdx = name.IndexOf(':');
        if (colonIdx > 0)
        {
            var directive = name.Substring(0, colonIdx).ToLowerInvariant();
            var target = name.Substring(colonIdx + 1);
            
            attr.BindingKind = directive switch
            {
                "bind" => TemplateBindingKind.TwoWay,
                "class" => TemplateBindingKind.Class,
                "style" => TemplateBindingKind.Style,
                "visible" => TemplateBindingKind.Visible,
                "enabled" => TemplateBindingKind.Enabled,
                "disabled" => TemplateBindingKind.PropertyExtension,
                "placeholder" => TemplateBindingKind.PropertyExtension,
                "href" => TemplateBindingKind.PropertyExtension,
                "src" => TemplateBindingKind.PropertyExtension,
                _ => TemplateBindingKind.PropertyExtension
            };
            
            attr.Name = directive;
            attr.BindingExpression = target;
            return;
        }
        
        // Default to property extension
        attr.BindingKind = TemplateBindingKind.PropertyExtension;
        attr.Name = InferPropertyFromElement(elementTag.ToLowerInvariant());
        attr.BindingExpression = name;
    }
    
    private bool IsEventBinding(string name)
    {
        // Check if it starts with "on" prefix
        if (name.StartsWith("on", StringComparison.OrdinalIgnoreCase))
            return true;
        
        // Strip modifiers before checking (e.g., "click.prevent" -> "click")
        var eventName = name.Contains(".") ? name.Split('.')[0] : name;
        
        // Check against the central event registry
        var normalized = SoftEventRegistry.NormalizeEventName(eventName);
        return SoftEventRegistry.IsValidEvent(normalized);
    }
    
    private string InferPropertyFromElement(string tagName)
    {
        return tagName switch
        {
            "img" => "src",
            "video" => "src",
            "audio" => "src",
            "a" => "href",
            "iframe" => "src",
            _ => "textContent"
        };
    }
}
