using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;
using Soft.Compiler.Language;

namespace Soft.Compiler.Emit.Processors;

/// <summary>
/// Handles @key attribute for list optimization.
/// Used in @foreach loops to track element identity.
/// </summary>
public class KeyAttributeProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute) => 
        attribute.Name == SoftKeywords.Key;
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var code = new StringBuilder();
        var keyValue = attribute.Value ?? "";
        
        // Store key on element for diffing/reconciliation
        code.AppendLine($"    {elemVar}.setAttribute('data-key', String({keyValue}));");
        code.AppendLine($"    {elemVar}.__key = {keyValue};");
        
        return code.ToString();
    }
}
