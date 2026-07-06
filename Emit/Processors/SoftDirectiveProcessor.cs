using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Processors;

/// <summary>
/// Handles @soft:* directive attributes.
/// Provides namespaced directives for better organization.
/// </summary>
public class SoftDirectiveProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute)
    {
        return attribute.Name.StartsWith("@soft:");
    }
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var directiveName = attribute.Name.Substring("@soft:".Length);
        
        return directiveName switch
        {
            "slot" => ProcessSlot(attribute, elemVar, context),
            "visible" => ProcessVisible(attribute, elemVar, context),
            "class" => ProcessClass(attribute, elemVar, context),
            "style" => ProcessStyle(attribute, elemVar, context),
            _ => ""
        };
    }
    
    private string ProcessSlot(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        // @soft:slot="header" - named slot
        var slotName = attribute.Value ?? "default";
        var code = new StringBuilder();
        
        code.AppendLine($"    // Slot: {slotName}");
        code.AppendLine($"    {elemVar}.setAttribute('data-slot', {slotName});");
        
        return code.ToString();
    }
    
    private string ProcessVisible(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var condition = attribute.Value ?? "true";
        var code = new StringBuilder();
        
        code.AppendLine($"    // Visibility: {condition}");
        code.AppendLine($"    if (!({condition})) {{");
        code.AppendLine($"        {elemVar}.style.display = 'none';");
        code.AppendLine($"    }}");
        
        return code.ToString();
    }
    
    private string ProcessClass(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        // @soft:class="{ active: isActive, disabled: isDisabled }"
        var classExpr = attribute.Value ?? "{}";
        var code = new StringBuilder();
        
        code.AppendLine($"    // Dynamic classes");
        code.AppendLine($"    const classes = {classExpr};");
        code.AppendLine($"    Object.keys(classes).forEach(cls => {{");
        code.AppendLine($"        if (classes[cls]) {elemVar}.classList.add(cls);");
        code.AppendLine($"    }});");
        
        return code.ToString();
    }
    
    private string ProcessStyle(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        // @soft:style="{ color: textColor, fontSize: size + 'px' }"
        var styleExpr = attribute.Value ?? "{}";
        var code = new StringBuilder();
        
        code.AppendLine($"    // Dynamic styles");
        code.AppendLine($"    const styles = {styleExpr};");
        code.AppendLine($"    Object.keys(styles).forEach(prop => {{");
        code.AppendLine($"        {elemVar}.style[prop] = styles[prop];");
        code.AppendLine($"    }});");
        
        return code.ToString();
    }
}
