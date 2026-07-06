using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Generators;

/// <summary>
/// Generates error boundary wrapper for components.
/// Handles <ErrorBoundary> custom element.
/// </summary>
public class ErrorBoundaryGenerator : INodeGenerator
{
    public bool CanGenerate(TemplateNode node)
    {
        if (node is not TemplateElement element) return false;
        return element.TagName == "ErrorBoundary";
    }
    
    public string Generate(TemplateNode node, CodeGenerationContext context)
    {
        var element = (TemplateElement)node;
        var code = new StringBuilder();
        var boundaryVar = context.NextVar();
        
        var fallbackAttr = element.Attributes.FirstOrDefault(a => a.Name == "@fallback");
        var fallback = fallbackAttr?.Value ?? "ErrorFallback";
        
        code.AppendLine($"{context.Indent()}const {boundaryVar} = document.createElement('div');");
        code.AppendLine($"{context.Indent()}{boundaryVar}.className = 'error-boundary';");
        code.AppendLine($"{context.Indent()}");
        code.AppendLine($"{context.Indent()}try {{");
        
        // Children will be generated here by orchestrator
        code.AppendLine($"{context.Indent()}    // Child content");
        
        code.AppendLine($"{context.Indent()}}} catch (error) {{");
        code.AppendLine($"{context.Indent()}    console.error('Error boundary caught:', error);");
        code.AppendLine($"{context.Indent()}    ");
        code.AppendLine($"{context.Indent()}    // Render fallback");
        code.AppendLine($"{context.Indent()}    if (this.{fallback}) {{");
        code.AppendLine($"{context.Indent()}        const fallbackComp = new this.{fallback}();");
        code.AppendLine($"{context.Indent()}        fallbackComp.error = error;");
        code.AppendLine($"{context.Indent()}        const fallbackContainer = document.createElement('div');");
        code.AppendLine($"{context.Indent()}        fallbackComp.__render(fallbackContainer);");
        code.AppendLine($"{context.Indent()}        {boundaryVar}.appendChild(fallbackContainer);");
        code.AppendLine($"{context.Indent()}    }} else {{");
        code.AppendLine($"{context.Indent()}        {boundaryVar}.innerHTML = '<div style=\"color: red; padding: 1rem; border: 1px solid red;\">' +");
        code.AppendLine($"{context.Indent()}            '<h3>Something went wrong</h3>' +");
        code.AppendLine($"{context.Indent()}            '<p>' + error.message + '</p>' +");
        code.AppendLine($"{context.Indent()}            '</div>';");
        code.AppendLine($"{context.Indent()}    }}");
        code.AppendLine($"{context.Indent()}}}");
        code.AppendLine($"{context.Indent()}");
        code.AppendLine($"{context.Indent()}{context.ParentVar}.appendChild({boundaryVar});");
        
        return code.ToString();
    }
}
