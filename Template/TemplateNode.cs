using Soft.Compiler.Models;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Template;

public abstract class TemplateNode
{
    public abstract TemplateNodeKind Kind { get; }
    public SourceLocation? Location { get; set; }
    public TemplateNode? Parent { get; set; }
    public int NodeId { get; set; }
    
    public abstract IEnumerable<TemplateNode> Children { get; }
    
    public abstract TResult Accept<TResult>(INodeVisitor<TResult> visitor);
    
    public IEnumerable<TemplateNode> Descendants()
    {
        foreach (var child in Children)
        {
            yield return child;
            foreach (var desc in child.Descendants())
            {
                yield return desc;
            }
        }
    }
}

public sealed class TemplateRoot : TemplateNode
{
    public List<TemplateNode> Nodes { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.Root;
    public override IEnumerable<TemplateNode> Children => Nodes;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateElement : TemplateNode
{
    public string TagName { get; set; } = "";
    public List<TemplateAttribute> Attributes { get; } = new();
    public List<TemplateNode> ChildNodes { get; } = new();
    public bool IsSelfClosing { get; set; }
    public bool IsComponent { get; set; }
    
    public override TemplateNodeKind Kind => IsComponent ? TemplateNodeKind.ComponentReference : TemplateNodeKind.Element;
    public override IEnumerable<TemplateNode> Children => ChildNodes;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateText : TemplateNode
{
    public string Content { get; set; } = "";
    public bool IsWhitespace => string.IsNullOrWhiteSpace(Content);
    
    public override TemplateNodeKind Kind => TemplateNodeKind.Text;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateInterpolation : TemplateNode
{
    public string Expression { get; set; } = "";
    
    public override TemplateNodeKind Kind => TemplateNodeKind.Interpolation;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateLocalization : TemplateNode
{
    public string Key { get; set; } = "";
    public string? DefaultValue { get; set; }
    public Dictionary<string, string> Parameters { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.LocalizationDirective;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public class TemplateAttribute
{
    public string Name { get; set; } = "";
    public string? Value { get; set; }
    public SourceLocation? Location { get; set; }
    public bool IsBinding { get; set; }
    public TemplateBindingKind BindingKind { get; set; }
    public string? BindingExpression { get; set; }
}

public enum TemplateBindingKind
{
    None,
    Text,
    Value,
    Class,
    Style,
    Visible,
    Enabled,
    Event,
    TwoWay,
    PropertyExtension
}

public sealed class TemplateTextBinding : TemplateNode
{
    public string Expression { get; set; } = "";
    
    public override TemplateNodeKind Kind => TemplateNodeKind.TextBinding;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateValueBinding : TemplateNode
{
    public string Expression { get; set; } = "";
    public bool IsTwoWay { get; set; }
    
    public override TemplateNodeKind Kind => TemplateNodeKind.ValueBinding;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateClassBinding : TemplateNode
{
    public string ClassName { get; set; } = "";
    public string? Condition { get; set; }
    
    public override TemplateNodeKind Kind => TemplateNodeKind.ClassBinding;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateStyleBinding : TemplateNode
{
    public string Property { get; set; } = "";
    public string Expression { get; set; } = "";
    
    public override TemplateNodeKind Kind => TemplateNodeKind.StyleBinding;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateEventBinding : TemplateNode
{
    public string EventName { get; set; } = "";
    public string Handler { get; set; } = "";
    public List<string> Arguments { get; } = new();
    public List<string> Modifiers { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.EventBinding;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateIfDirective : TemplateNode
{
    public string Condition { get; set; } = "";
    public List<TemplateNode> ThenNodes { get; } = new();
    public List<TemplateElseIfDirective> ElseIfBranches { get; } = new();
    public TemplateElseDirective? ElseBranch { get; set; }
    
    public override TemplateNodeKind Kind => TemplateNodeKind.IfDirective;
    public override IEnumerable<TemplateNode> Children
    {
        get
        {
            foreach (var node in ThenNodes) yield return node;
            foreach (var branch in ElseIfBranches) yield return branch;
            if (ElseBranch != null) yield return ElseBranch;
        }
    }
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateElseIfDirective : TemplateNode
{
    public string Condition { get; set; } = "";
    public List<TemplateNode> Nodes { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.ElseIfDirective;
    public override IEnumerable<TemplateNode> Children => Nodes;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateElseDirective : TemplateNode
{
    public List<TemplateNode> Nodes { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.ElseDirective;
    public override IEnumerable<TemplateNode> Children => Nodes;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateForEachDirective : TemplateNode
{
    public string ItemVariable { get; set; } = "";
    public string? IndexVariable { get; set; }
    public string CollectionExpression { get; set; } = "";
    public string? TrackByExpression { get; set; }
    public List<TemplateNode> BodyNodes { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.ForEachDirective;
    public override IEnumerable<TemplateNode> Children => BodyNodes;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateSwitchDirective : TemplateNode
{
    public string Expression { get; set; } = "";
    public List<TemplateCaseDirective> Cases { get; } = new();
    public TemplateDefaultDirective? DefaultCase { get; set; }
    
    public override TemplateNodeKind Kind => TemplateNodeKind.SwitchDirective;
    public override IEnumerable<TemplateNode> Children
    {
        get
        {
            foreach (var c in Cases) yield return c;
            if (DefaultCase != null) yield return DefaultCase;
        }
    }
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateCaseDirective : TemplateNode
{
    public string Value { get; set; } = "";
    public List<TemplateNode> Nodes { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.CaseDirective;
    public override IEnumerable<TemplateNode> Children => Nodes;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateDefaultDirective : TemplateNode
{
    public List<TemplateNode> Nodes { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.DefaultDirective;
    public override IEnumerable<TemplateNode> Children => Nodes;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateVisibleDirective : TemplateNode
{
    public string Condition { get; set; } = "";
    
    public override TemplateNodeKind Kind => TemplateNodeKind.VisibleDirective;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateEnabledDirective : TemplateNode
{
    public string Condition { get; set; } = "";
    
    public override TemplateNodeKind Kind => TemplateNodeKind.EnabledDirective;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplatePropertyExtension : TemplateNode
{
    public string ExtensionName { get; set; } = "";
    public List<string> Arguments { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.PropertyExtension;
    public override IEnumerable<TemplateNode> Children => Enumerable.Empty<TemplateNode>();
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}

public sealed class TemplateComponentReference : TemplateNode
{
    public string ComponentName { get; set; } = "";
    public List<TemplateAttribute> Properties { get; } = new();
    public List<TemplateNode> ChildContent { get; } = new();
    
    public override TemplateNodeKind Kind => TemplateNodeKind.ComponentReference;
    public override IEnumerable<TemplateNode> Children => ChildContent;
    
    public override TResult Accept<TResult>(INodeVisitor<TResult> visitor) => visitor.Visit(this);
}
