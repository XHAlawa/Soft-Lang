using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Generators;

public class TextNodeGenerator : INodeGenerator
{
    public bool CanGenerate(TemplateNode node) => node is TemplateText;
    
    public string Generate(TemplateNode node, CodeGenerationContext context)
    {
        var text = (TemplateText)node;
        
        // Skip whitespace-only text nodes
        if (string.IsNullOrWhiteSpace(text.Content))
        {
            return "";
        }
        
        var code = new StringBuilder();
        var textVar = context.NextVar();
        
        var escapedText = text.Content
            .Replace("\\", "\\\\")
            .Replace("'", "\\'")
            .Replace("\r", "")
            .Replace("\n", "\\n");
        
        code.AppendLine($"{context.Indent()}const {textVar} = document.createTextNode('{escapedText}');");
        code.AppendLine($"{context.Indent()}{context.ParentVar}.appendChild({textVar});");
        
        return code.ToString();
    }
}
