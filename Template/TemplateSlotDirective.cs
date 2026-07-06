using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Template;

/// <summary>
/// Represents @slot directive for content projection.
/// Example: @slot(name: "header") { ... }
/// </summary>
public sealed class TemplateSlotDirective : TemplateNode
{
    public string Name { get; set; } = "default";
    public List<TemplateNode> FallbackContent { get; set; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.SlotDirective;
    public override IEnumerable<TemplateNode> Children => FallbackContent;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}
