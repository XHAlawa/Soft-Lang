using Soft.Compiler.Template;

namespace Soft.Compiler.Abstractions;

/// <summary>
/// Visitor pattern for traversing template AST nodes.
/// </summary>
/// <typeparam name="TResult">Result type returned by visit methods</typeparam>
public interface INodeVisitor<TResult>
{
    TResult Visit(TemplateRoot node);
    TResult Visit(TemplateElement node);
    TResult Visit(TemplateText node);
    TResult Visit(TemplateInterpolation node);
    TResult Visit(TemplateIfDirective node);
    TResult Visit(TemplateElseIfDirective node);
    TResult Visit(TemplateElseDirective node);
    TResult Visit(TemplateForEachDirective node);
    TResult Visit(TemplateSwitchDirective node);
    TResult Visit(TemplateCaseDirective node);
    TResult Visit(TemplateDefaultDirective node);
    TResult Visit(TemplateTextBinding node);
    TResult Visit(TemplateValueBinding node);
    TResult Visit(TemplateClassBinding node);
    TResult Visit(TemplateStyleBinding node);
    TResult Visit(TemplateEventBinding node);
    TResult Visit(TemplateVisibleDirective node);
    TResult Visit(TemplateEnabledDirective node);
    TResult Visit(TemplatePropertyExtension node);
    TResult Visit(TemplateComponentReference node);
    TResult Visit(TemplateSlotDirective node);
    TResult Visit(TemplateLocalization node);
}
