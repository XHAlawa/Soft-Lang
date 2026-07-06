using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;
using Soft.Compiler.Language;

namespace Soft.Compiler.Emit.Processors;

/// <summary>
/// Handles @ref attribute for element references.
/// Example: <input @ref="inputRef" /> creates this.inputRef
/// </summary>
public class RefAttributeProcessor : IAttributeProcessor
{
    public bool CanProcess(TemplateAttribute attribute) => 
        attribute.Name == SoftKeywords.Ref;
    
    public string Process(TemplateAttribute attribute, string elemVar, AttributeProcessingContext context)
    {
        var refName = attribute.Value ?? "";
        return $"    this.{refName} = {elemVar};\n";
    }
}
