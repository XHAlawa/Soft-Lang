using Soft.Compiler.Template;

namespace Soft.Compiler.Template.Analysis;

/// <summary>
/// Analyzes template nodes to identify static vs dynamic content.
/// Static = no bindings, no interpolations, no directives, no event handlers.
/// </summary>
public class StaticContentAnalyzer
{
    public bool IsStatic(TemplateNode node)
    {
        return node switch
        {
            TemplateElement element => IsStaticElement(element),
            TemplateText text => !text.Content.Contains("{") && !text.Content.Contains("@"),
            TemplateInterpolation => false,
            TemplateIfDirective => false,
            TemplateForEachDirective => false,
            TemplateSwitchDirective => false,
            _ => true
        };
    }
    
    private bool IsStaticElement(TemplateElement element)
    {
        // CRITICAL: Any @ attribute makes it dynamic (events, bindings, directives, etc.)
        if (element.Attributes.Any(a => a.Name.StartsWith("@")))
        {
            return false;
        }
        
        // Has interpolations in attribute values?
        if (element.Attributes.Any(a => a.Value?.Contains("{") == true))
        {
            return false;
        }
        
        // Has dynamic children?
        if (!element.ChildNodes.All(IsStatic))
        {
            return false;
        }
        
        return true;
    }
    
    public List<TemplateNode> GetStaticSubtree(TemplateElement element)
    {
        var result = new List<TemplateNode>();
        
        foreach (var child in element.ChildNodes)
        {
            if (IsStatic(child))
            {
                result.Add(child);
            }
            else
            {
                break; // Stop at first dynamic node
            }
        }
        
        return result;
    }
}
