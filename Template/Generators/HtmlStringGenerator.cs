using System.Text;
using Soft.Compiler.Template;

namespace Soft.Compiler.Template.Generators;

/// <summary>
/// Generates HTML string from static template nodes.
/// </summary>
public class HtmlStringGenerator
{
    public string GenerateHtml(List<TemplateNode> nodes)
    {
        var html = new StringBuilder();
        
        foreach (var node in nodes)
        {
            AppendNode(html, node);
        }
        
        return html.ToString();
    }
    
    private void AppendNode(StringBuilder html, TemplateNode node)
    {
        switch (node)
        {
            case TemplateElement element:
                AppendElement(html, element);
                break;
            case TemplateText text:
                html.Append(EscapeHtml(text.Content));
                break;
        }
    }
    
    private void AppendElement(StringBuilder html, TemplateElement element)
    {
        html.Append($"<{element.TagName}");
        
        // Attributes
        foreach (var attr in element.Attributes)
        {
            if (!string.IsNullOrEmpty(attr.Value))
            {
                html.Append($" {attr.Name}=\"{EscapeAttribute(attr.Value)}\"");
            }
            else
            {
                html.Append($" {attr.Name}");
            }
        }
        
        // Self-closing tags
        if (IsSelfClosing(element.TagName) && !element.ChildNodes.Any())
        {
            html.Append(" />");
            return;
        }
        
        html.Append(">");
        
        // Children
        foreach (var child in element.ChildNodes)
        {
            AppendNode(html, child);
        }
        
        html.Append($"</{element.TagName}>");
    }
    
    private bool IsSelfClosing(string tagName)
    {
        var selfClosing = new[] { "input", "br", "hr", "img", "meta", "link" };
        return selfClosing.Contains(tagName.ToLower());
    }
    
    private string EscapeHtml(string text)
    {
        return text
            .Replace("&", "&amp;")
            .Replace("<", "&lt;")
            .Replace(">", "&gt;");
    }
    
    private string EscapeAttribute(string value)
    {
        return value
            .Replace("&", "&amp;")
            .Replace("\"", "&quot;")
            .Replace("'", "&#39;");
    }
}
