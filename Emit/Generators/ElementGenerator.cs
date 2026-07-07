using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Generators;

public class ElementGenerator : INodeGenerator
{
    private readonly List<IAttributeProcessor> _processors;
    
    public ElementGenerator(List<IAttributeProcessor> processors)
    {
        _processors = processors;
    }
    
    public bool CanGenerate(TemplateNode node) => node is TemplateElement;
    
    public string Generate(TemplateNode node, CodeGenerationContext context)
    {
        var element = (TemplateElement)node;
        var code = new StringBuilder();
        var elemVar = context.NextVar();
        var elemIndex = int.Parse(elemVar.Replace("el", "")) - 1; // el1 -> index 0
        
        // Create element
        var elementType = GetHtmlElementType(element.TagName);
        code.AppendLine($"{context.Indent()}const {elemVar} = document.createElement('{element.TagName}') as {elementType};");
        
        // Process attributes
        foreach (var attr in element.Attributes)
        {
            var processed = false;
            foreach (var processor in _processors)
            {
                if (processor.CanProcess(attr))
                {
                    var attrContext = new AttributeProcessingContext
                    {
                        ElementTag = element.TagName,
                        ContainerVar = context.ParentVar,
                        SymbolTable = context.SymbolTable,
                        LoopVariables = context.LoopVariables,
                        AllAttributes = element.Attributes.ToList()
                    };
                    var attrCode = processor.Process(attr, elemVar, attrContext);
                    if (!string.IsNullOrEmpty(attrCode))
                    {
                        code.Append(attrCode);
                    }
                    processed = true;
                    break;
                }
            }
            
            // Fallback: regular attribute
            if (!processed && !string.IsNullOrEmpty(attr.Value))
            {
                // Only treat @ in value as expression if attribute name also starts with @ (binding)
                // Otherwise, @ in attribute values is literal (e.g., placeholder="@if")
                if (attr.Name.StartsWith("@") && attr.Value.StartsWith("@"))
                {
                    var expression = attr.Value.Substring(1);
                    // Add this. prefix if not a loop variable
                    if (!expression.Contains("."))
                    {
                        var firstPart = expression.Split('(', ' ', '?', '!', '[')[0];
                        if (!context.LoopVariables.Contains(firstPart))
                        {
                            expression = "this." + expression;
                        }
                    }
                    else if (!expression.StartsWith("this."))
                    {
                        var firstPart = expression.Split('.')[0];
                        if (!context.LoopVariables.Contains(firstPart))
                        {
                            expression = "this." + expression;
                        }
                    }
                    code.AppendLine($"{context.Indent()}{elemVar}.setAttribute('{attr.Name}', String({expression}));");
                }
                else
                {
                    code.AppendLine($"{context.Indent()}{elemVar}.setAttribute('{attr.Name}', '{EscapeString(attr.Value)}');");
                }
            }
        }
        
        // Append to parent
        code.AppendLine($"{context.Indent()}{context.ParentVar}.appendChild({elemVar});");
        
        return code.ToString();
    }
    
    private string GetHtmlElementType(string tagName)
    {
        return tagName.ToLower() switch
        {
            "input" => "HTMLInputElement",
            "textarea" => "HTMLTextAreaElement",
            "select" => "HTMLSelectElement",
            "button" => "HTMLButtonElement",
            "form" => "HTMLFormElement",
            "a" => "HTMLAnchorElement",
            "img" => "HTMLImageElement",
            "div" => "HTMLDivElement",
            "span" => "HTMLSpanElement",
            "p" => "HTMLParagraphElement",
            "h1" or "h2" or "h3" or "h4" or "h5" or "h6" => "HTMLHeadingElement",
            "ul" or "ol" => "HTMLUListElement",
            "li" => "HTMLLIElement",
            "table" => "HTMLTableElement",
            "tr" => "HTMLTableRowElement",
            "td" or "th" => "HTMLTableCellElement",
            "canvas" => "HTMLCanvasElement",
            "video" => "HTMLVideoElement",
            "audio" => "HTMLAudioElement",
            _ => "HTMLElement"
        };
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
