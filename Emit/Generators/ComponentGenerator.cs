using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;
using Soft.Compiler.Components;

namespace Soft.Compiler.Emit.Generators;

/// <summary>
/// Generates component instantiation code.
/// Handles <ComponentName /> syntax with props and events.
/// </summary>
public class ComponentGenerator : INodeGenerator
{
    private readonly ComponentRegistry _registry;
    
    public ComponentGenerator(ComponentRegistry registry)
    {
        _registry = registry;
    }
    
    public bool CanGenerate(TemplateNode node)
    {
        if (node is not TemplateElement element) return false;
        return _registry.IsComponent(element.TagName);
    }
    
    public string Generate(TemplateNode node, CodeGenerationContext context)
    {
        var element = (TemplateElement)node;
        var code = new StringBuilder();
        var compVar = context.NextVar();
        var metadata = _registry.GetComponent(element.TagName);
        
        if (metadata == null) return "";
        
        // Track component instance for disposal
        context.ComponentInstances.Add(new ComponentInstanceMetadata
        {
            InstanceVar = compVar,
            ComponentType = element.TagName,
            ConditionalContext = context.ConditionalContext,
            LoopContext = context.LoopContext
        });
        
        // Use instance field if in conditional/loop, otherwise local var
        if (context.ConditionalContext != null)
        {
            var contextName = context.ConditionalContext
                .Replace(".", "_")
                .Replace("this_", "")
                .Replace("!", "not_")
                .Replace(" ", "")
                .Replace(">", "_gt_")
                .Replace("<", "_lt_")
                .Replace(">=", "_gte_")
                .Replace("<=", "_lte_")
                .Replace("==", "_eq_")
                .Replace("===", "_seq_")
                .Replace("!=", "_neq_")
                .Replace("!==", "_sneq_")
                .Replace("&&", "_and_")
                .Replace("||", "_or_");
            code.AppendLine($"{context.Indent()}const {compVar} = new {element.TagName}();");
            code.AppendLine($"{context.Indent()}this.__if_{contextName}_comp = {compVar};");
        }
        else if (context.LoopContext != null)
        {
            // Loop components - reuse existing or create new
            var contextName = context.LoopContext.Replace(".", "_").Replace("this_", "");
            var itemVar = context.LoopVariables.FirstOrDefault(v => v != "index" && v != "i");
            var indexVar = context.LoopVariables.Contains("index") ? "index" : "i";
            
            // Use @key attribute or index as fallback to prevent duplicate key issues
            var keyAttr = element.Attributes.FirstOrDefault(a => a.Name == "@key");
            var keyExpr = keyAttr != null ? keyAttr.Value : indexVar;
            
            code.AppendLine($"{context.Indent()}// Reuse or create component for loop item");
            code.AppendLine($"{context.Indent()}const __key = {keyExpr};");
            code.AppendLine($"{context.Indent()}let {compVar} = this.__foreach_{contextName}_instances.get(__key);");
            code.AppendLine($"{context.Indent()}if (!{compVar}) {{");
            code.AppendLine($"{context.Indent()}    {compVar} = new {element.TagName}();");
            code.AppendLine($"{context.Indent()}}}");
            code.AppendLine($"{context.Indent()}__new_{contextName}_map.set(__key, {compVar});");
        }
        else
        {
            // Static component - use instance field
            code.AppendLine($"{context.Indent()}if (!this.__{compVar}) {{");
            code.AppendLine($"{context.Indent()}    this.__{compVar} = new {element.TagName}();");
            code.AppendLine($"{context.Indent()}}}");
            code.AppendLine($"{context.Indent()}const {compVar} = this.__{compVar};");
        }
        
        // Set props and event handlers
        foreach (var attr in element.Attributes)
        {
            if (attr.Name.StartsWith("@"))
            {
                var propName = attr.Name.Substring(1);
                
                // Event handler (starts with "on")
                if (propName.StartsWith("on", StringComparison.OrdinalIgnoreCase))
                {
                    var eventName = propName.Substring(2);
                    var handler = attr.Value ?? "";
                    code.AppendLine($"{context.Indent()}// Event: {eventName}");
                    code.AppendLine($"{context.Indent()}{compVar}.$on('{eventName}', (...args) => {{");
                    code.AppendLine($"{context.Indent()}    const $event = args[0];");
                    code.AppendLine($"{context.Indent()}    this.{handler};");
                    code.AppendLine($"{context.Indent()}}});");
                }
                else
                {
                    // Regular prop
                    var value = attr.Value ?? "";
                    code.AppendLine($"{context.Indent()}{compVar}.{propName} = this.{value};");
                }
            }
        }
        
        // Create container for component
        var containerVar = $"{compVar}_container";
        code.AppendLine($"{context.Indent()}const {containerVar} = document.createElement('div');");
        
        // Pass slot content
        code.AppendLine($"{context.Indent()}// Pass slot content to child");
        code.AppendLine($"{context.Indent()}({compVar} as any).__slots = {{}};");
        
        // Collect children as default slot
        if (element.ChildNodes.Any())
        {
            var slotVar = $"slotContent_{compVar}";
            code.AppendLine($"{context.Indent()}const {slotVar} = [];");
            // Children will be generated by orchestrator with slotVar as parent
            code.AppendLine($"{context.Indent()}({compVar} as any).__slots['default'] = {slotVar};");
        }
        
        // Render component
        code.AppendLine($"{context.Indent()}{compVar}.__render({containerVar});");
        
        // Append to parent (or push to slot array if parent is slot content)
        if (context.ParentVar.StartsWith("slotContent_"))
        {
            // Parent is a slot content array, push the container
            code.AppendLine($"{context.Indent()}{context.ParentVar}.push({containerVar});");
        }
        else
        {
            // Parent is a DOM element, append normally
            code.AppendLine($"{context.Indent()}{context.ParentVar}.appendChild({containerVar});");
        }
        
        return code.ToString();
    }
}
