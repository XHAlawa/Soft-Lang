using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Generators;

/// <summary>
/// Generates code for @L(...) localization directives
/// </summary>
public class LocalizationGenerator : INodeGenerator
{
    public bool CanGenerate(TemplateNode node) => node is TemplateLocalization;
    
    public string Generate(TemplateNode node, CodeGenerationContext context)
    {
        var localization = (TemplateLocalization)node;
        var code = new StringBuilder();
        var elemVar = context.NextVar();
        
        // Generate code to get localized text
        // If key is a string literal, use it directly; otherwise treat as expression
        var keyExpression = localization.Key.Contains("'") || localization.Key.Contains("\"") 
            ? localization.Key 
            : $"'{localization.Key}'";
        
        code.AppendLine($"{context.Indent()}const {elemVar} = document.createTextNode(this.__localize({keyExpression}));");
        code.AppendLine($"{context.Indent()}{context.ParentVar}.appendChild({elemVar});");
        
        return code.ToString();
    }
}
