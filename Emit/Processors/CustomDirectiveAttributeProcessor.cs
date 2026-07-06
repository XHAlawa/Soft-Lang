using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;
using Soft.Compiler.Language;

namespace Soft.Compiler.Emit.Processors;

/// <summary>
/// Handles custom directive attributes.
/// Example: @x:tooltip="'Help text'" or @ui:dropdown="options"
/// </summary>
public class CustomDirectiveAttributeProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute)
    {
        // Match @namespace:name pattern
        return attribute.Name.StartsWith("@") && 
               attribute.Name.Contains(":") &&
               !IsBuiltInDirective(attribute.Name);
    }
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var code = new StringBuilder();
        
        // Parse @namespace:name
        var parts = attribute.Name.Substring(1).Split(':');
        if (parts.Length != 2) return "";
        
        var ns = parts[0];
        var name = parts[1];
        var value = attribute.Value ?? "true";
        
        code.AppendLine($"    // Custom directive: @{ns}:{name}");
        code.AppendLine($"    $directives.apply({elemVar}, '{ns}', '{name}', {value});");
        
        return code.ToString();
    }
    
    private bool IsBuiltInDirective(string attrName)
    {
        return SoftKeywords.IsBuiltInDirective(attrName);
    }
}
