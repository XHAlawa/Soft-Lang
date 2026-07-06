using System.Text;
using Soft.Compiler.Abstractions;
using Soft.Compiler.Emit.Generators;
using Soft.Compiler.Emit.Processors;
using Soft.Compiler.Components;
using Soft.Compiler.Parser;

namespace Soft.Compiler.Template;

/// <summary>
/// Orchestrates code generation using specialized generators.
/// REFACTORED: 552 lines → 150 lines
/// </summary>
public sealed class TemplateCodeGenerator : ICodeGenerator
{
    private readonly List<INodeGenerator> _generators;
    private readonly List<IAttributeProcessor> _processors;
    private readonly ComponentRegistry _componentRegistry;
    private Semantics.PageSymbolTable? _symbolTable;
    
    public TemplateCodeGenerator(ComponentRegistry? componentRegistry = null)
    {
        _componentRegistry = componentRegistry ?? new ComponentRegistry();
        
        // Setup processors
        _processors = new List<IAttributeProcessor>
        {
            new BindingAttributeProcessor(),    // @bind:value, @bind:checked
            new EventAttributeProcessor(),      // @click, @submit, etc. (must be before FormsAttributeProcessor)
            new FormsAttributeProcessor(),     // @form.field (Forms binding)
            new ClassAttributeProcessor(),      // @class:active
            new StyleAttributeProcessor(),      // @style:color
            new VisibilityAttributeProcessor(), // @show, @disabled
            new RefAttributeProcessor(),        // @ref
            new KeyAttributeProcessor(),        // @key for list optimization
            new SoftDirectiveProcessor(),       // @soft:* directives
            new CustomDirectiveAttributeProcessor() // @namespace:name (must be last)
        };
        
        // Setup generators
        _generators = new List<INodeGenerator>
        {
            new ErrorBoundaryGenerator(),          // <ErrorBoundary> (must be first)
            new SlotGenerator(),                   // <slot> (before components)
            new ComponentGenerator(_componentRegistry),
            new ElementGenerator(_processors),
            // DirectiveGenerator removed - directives handled by orchestrator with proper child context
            new LocalizationGenerator(),           // @L('key') localization
            new InterpolationGenerator()
        };
    }
    
    public void RegisterComponents(IEnumerable<ComponentImport> imports)
    {
        foreach (var import in imports)
        {
            _componentRegistry.Register(import);
        }
    }
    
    public void SetSymbolTable(Semantics.PageSymbolTable symbolTable)
    {
        _symbolTable = symbolTable;
    }
    
    public string GenerateInstanceFields(CodeGenerationContext context)
    {
        var code = new StringBuilder();
        
        // Group by conditional/loop context
        var conditionalComponents = context.ComponentInstances
            .Where(c => c.ConditionalContext != null)
            .GroupBy(c => c.ConditionalContext);
            
        var loopComponents = context.ComponentInstances
            .Where(c => c.LoopContext != null)
            .GroupBy(c => c.LoopContext);
            
        var staticComponents = context.ComponentInstances
            .Where(c => c.ConditionalContext == null && c.LoopContext == null);
        
        // Generate conditional component fields
        foreach (var group in conditionalComponents)
        {
            var contextName = group.Key!.Replace(".", "_").Replace("this_", "").Replace("!", "not_").Replace(" ", "");
            code.AppendLine($"    private __if_{contextName}_comp: {group.First().ComponentType} | null = null;");
            code.AppendLine($"    private __if_{contextName}_prev = false;");
        }
        
        // Generate loop component fields
        foreach (var group in loopComponents)
        {
            var contextName = group.Key!.Replace(".", "_").Replace("this_", "");
            code.AppendLine($"    private __foreach_{contextName}_instances: Map<any, {group.First().ComponentType}> = new Map();");
        }
        
        // Generate static component fields
        foreach (var comp in staticComponents)
        {
            code.AppendLine($"    private __{comp.InstanceVar}: {comp.ComponentType} | null = null;");
        }
        
        return code.ToString();
    }
    
    public string GenerateChildDisposal(CodeGenerationContext context)
    {
        var code = new StringBuilder();
        
        if (!context.ComponentInstances.Any())
            return "";
        
        code.AppendLine();
        code.AppendLine("    // Dispose child components (compiler-generated)");
        code.AppendLine("    __disposeChildren(): void {");
        
        // Group by conditional/loop context
        var conditionalComponents = context.ComponentInstances
            .Where(c => c.ConditionalContext != null)
            .GroupBy(c => c.ConditionalContext);
            
        var loopComponents = context.ComponentInstances
            .Where(c => c.LoopContext != null)
            .GroupBy(c => c.LoopContext);
            
        var staticComponents = context.ComponentInstances
            .Where(c => c.ConditionalContext == null && c.LoopContext == null);
        
        // Dispose conditional components
        foreach (var group in conditionalComponents)
        {
            var contextName = group.Key!.Replace(".", "_").Replace("this_", "").Replace("!", "not_").Replace(" ", "");
            code.AppendLine($"        this.__if_{contextName}_comp?.__dispose();");
        }
        
        // Dispose loop components
        foreach (var group in loopComponents)
        {
            var contextName = group.Key!.Replace(".", "_").Replace("this_", "");
            code.AppendLine($"        this.__foreach_{contextName}_instances.forEach(comp => comp.__dispose());");
            code.AppendLine($"        this.__foreach_{contextName}_instances.clear();");
        }
        
        // Dispose static components
        foreach (var comp in staticComponents)
        {
            code.AppendLine($"        this.__{comp.InstanceVar}?.__dispose();");
        }
        
        code.AppendLine("    }");
        
        return code.ToString();
    }
    
    public string Generate(TemplateRoot template, string className)
    {
        var code = new StringBuilder();
        var context = new CodeGenerationContext
        {
            ParentVar = "container",
            ClassName = className,
            IndentLevel = 1,
            SymbolTable = _symbolTable
        };
        
        // Reset var counter for each template
        context.ResetVarCounter();
        
        // Generate render method signature
        code.AppendLine("public __render(container: HTMLElement): void {");
        code.AppendLine("    // Store container reference for re-renders");
        code.AppendLine("    this.__container = container;");
        code.AppendLine("    // Cancel any pending render to prevent double-rendering");
        code.AppendLine("    this.__renderScheduled = false;");
        code.AppendLine();
        code.AppendLine("    // Differential DOM update: only rebuild if first render or structure changed");
        code.AppendLine("    const isFirstRender = !this.__mounted || container.children.length === 0;");
        code.AppendLine("    ");
        code.AppendLine("    if (isFirstRender) {");
        code.AppendLine("        // First render: build full DOM");
        code.AppendLine("        container.innerHTML = '';");
        code.AppendLine("    } else {");
        code.AppendLine("        // Subsequent renders: preserve DOM structure, only update dynamic content");
        code.AppendLine("        // Focus preservation is automatic since we don't destroy elements");
        code.AppendLine("    }");
        code.AppendLine();
        
        // Generate DOM nodes
        foreach (var node in template.Nodes)
        {
            code.Append(GenerateNode(node, context));
        }
        
        code.AppendLine();
        
        // Focus preservation is automatic with differential DOM updates
        // Elements are not destroyed, so focus and selection are maintained
        
        // Lifecycle hooks
        code.AppendLine("    if (!this.__mounted && (this as any).onMounted) {");
        code.AppendLine("        this.__mounted = true;");
        code.AppendLine("        setTimeout(() => (this as any).onMounted?.(), 0);");
        code.AppendLine("    } else if ((this as any).onUpdated) {");
        code.AppendLine("        setTimeout(() => (this as any).onUpdated?.(), 0);");
        code.AppendLine("    }");
        
        code.AppendLine("}");
        
        // Append child disposal method
        var childDisposal = GenerateChildDisposal(context);
        if (!string.IsNullOrEmpty(childDisposal))
        {
            code.Append(childDisposal);
        }
        
        // Prepend instance fields if any components were generated
        var instanceFields = GenerateInstanceFields(context);
        if (!string.IsNullOrEmpty(instanceFields))
        {
            return instanceFields + "\n" + code.ToString();
        }
        
        return code.ToString();
    }
    
    private string GenerateNode(TemplateNode node, CodeGenerationContext context)
    {
        // Handle directives with special child context first
        if (node is TemplateIfDirective ifDir)
        {
            return GenerateIfWithChildren(ifDir, context);
        }
        else if (node is TemplateForEachDirective forEach)
        {
            return GenerateForEachWithChildren(forEach, context);
        }
        else if (node is TemplateSwitchDirective switchDir)
        {
            return GenerateSwitchWithChildren(switchDir, context);
        }
        
        // Try each generator
        foreach (var generator in _generators)
        {
            if (generator.CanGenerate(node))
            {
                var result = generator.Generate(node, context);
                
                // Handle children for container nodes
                if (node is TemplateElement element)
                {
                    // For components with slots, use the slot array as parent
                    string parentVar = context.ParentVar;
                    if (result.Contains("slotContent_"))
                    {
                        // Extract slot variable name (e.g., "slotContent_el3")
                        var slotMatch = System.Text.RegularExpressions.Regex.Match(result, @"const (slotContent_\w+) = \[\]");
                        if (slotMatch.Success)
                        {
                            parentVar = slotMatch.Groups[1].Value;
                        }
                    }
                    else if (result.Contains("const el"))
                    {
                        // Regular element
                        parentVar = result.Split("const ")[1].Split(' ')[0];
                    }
                    
                    var childContext = new CodeGenerationContext
                    {
                        ParentVar = parentVar,
                        ClassName = context.ClassName,
                        IndentLevel = context.IndentLevel,
                        LoopVariables = context.LoopVariables,
                        SymbolTable = context.SymbolTable,
                        ConditionalContext = context.ConditionalContext,
                        LoopContext = context.LoopContext,
                        ComponentInstances = context.ComponentInstances
                    };
                    
                    var childCode = new StringBuilder();
                    foreach (var child in element.ChildNodes)
                    {
                        childCode.Append(GenerateNode(child, childContext));
                    }
                    
                    // Insert children before appendChild or push
                    // For components with slots, insert before the slot array push
                    // For regular elements, insert before the parent appendChild
                    if (result.Contains(".push("))
                    {
                        // Component with slot - find the line with push and insert before it
                        var lines = result.Split('\n').ToList();
                        var pushLineIndex = lines.FindLastIndex(l => l.Contains(".push("));
                        if (pushLineIndex > 0)
                        {
                            lines.Insert(pushLineIndex, childCode.ToString().TrimEnd('\n', '\r'));
                            result = string.Join("\n", lines);
                        }
                    }
                    else if (result.Contains($"{context.ParentVar}.appendChild"))
                    {
                        result = result.Replace($"{context.ParentVar}.appendChild", 
                            childCode.ToString() + $"{context.ParentVar}.appendChild");
                    }
                }
                
                return result;
            }
        }
        
        return "";
    }
    
    private string GenerateIfWithChildren(TemplateIfDirective ifNode, CodeGenerationContext context)
    {
        var code = new StringBuilder();
        var condition = AddThisPrefix(ifNode.Condition, context.LoopVariables);
        var contextName = condition.Replace(".", "_").Replace("this_", "").Replace("!", "not_").Replace(" ", "");
        
        // Track current and previous state for disposal
        code.AppendLine($"{context.Indent()}const __if_{contextName}_current = {condition};");
        code.AppendLine($"{context.Indent()}if (__if_{contextName}_current) {{");
        
        var thenContext = new CodeGenerationContext
        {
            ParentVar = context.ParentVar,
            ClassName = context.ClassName,
            IndentLevel = context.IndentLevel + 1,
            LoopVariables = context.LoopVariables,
            SymbolTable = context.SymbolTable,
            ConditionalContext = condition,
            ComponentInstances = context.ComponentInstances  // Share same list!
        };
        
        // Generate children
        foreach (var child in ifNode.ThenNodes)
        {
            code.Append(GenerateNode(child, thenContext));
        }
        
        // Check if any components were added
        var hasConditionalComponents = context.ComponentInstances.Any(c => c.ConditionalContext == condition);
        
        if (hasConditionalComponents)
        {
            // Generate disposal code only if there are components
            code.AppendLine($"{context.Indent()}}} else {{");
            code.AppendLine($"{context.Indent()}    // Dispose if was showing");
            code.AppendLine($"{context.Indent()}    if (this.__if_{contextName}_prev && this.__if_{contextName}_comp) {{");
            code.AppendLine($"{context.Indent()}        this.__if_{contextName}_comp.__dispose();");
            code.AppendLine($"{context.Indent()}        this.__if_{contextName}_comp = null;");
            code.AppendLine($"{context.Indent()}    }}");
            code.AppendLine($"{context.Indent()}}}");
            code.AppendLine($"{context.Indent()}this.__if_{contextName}_prev = __if_{contextName}_current;");
        }
        else
        {
            // No components, just close the if block
            code.AppendLine($"{context.Indent()}}}");
        }
        
        // Note: elseIf and else branches not yet implemented for disposal
        // Would need separate tracking per branch
        
        return code.ToString();
    }
    
    private string GenerateForEachWithChildren(TemplateForEachDirective forEach, CodeGenerationContext context)
    {
        var code = new StringBuilder();
        var itemVar = forEach.ItemVariable;
        var indexVar = forEach.IndexVariable ?? "index";
        var collectionExpr = AddThisPrefix(forEach.CollectionExpression, context.LoopVariables);
        var contextName = forEach.CollectionExpression.Replace(".", "_").Replace("this_", "");
        
        // Track loop variables
        var loopVars = new HashSet<string>(context.LoopVariables) { itemVar, indexVar };
        
        // Always declare map (components may be added during generation)
        code.AppendLine($"{context.Indent()}const __new_{contextName}_map = new Map<any, any>();");
        code.AppendLine($"{context.Indent()}({collectionExpr} || []).forEach(({itemVar}, {indexVar}) => {{");
        
        var bodyContext = new CodeGenerationContext
        {
            ParentVar = context.ParentVar,
            ClassName = context.ClassName,
            IndentLevel = context.IndentLevel + 1,
            LoopVariables = loopVars,
            SymbolTable = context.SymbolTable,
            LoopContext = forEach.CollectionExpression,
            ComponentInstances = context.ComponentInstances
        };
        
        foreach (var child in forEach.BodyNodes)
        {
            code.Append(GenerateNode(child, bodyContext));
        }
        
        code.AppendLine($"{context.Indent()}}});");
        
        // Only generate disposal code if loop has components (check after generation)
        var hasLoopComponents = context.ComponentInstances.Any(c => c.LoopContext == forEach.CollectionExpression);
        if (hasLoopComponents)
        {
            code.AppendLine();
            code.AppendLine($"{context.Indent()}// Dispose components no longer in collection");
            code.AppendLine($"{context.Indent()}if (this.__foreach_{contextName}_instances) {{");
            code.AppendLine($"{context.Indent()}    this.__foreach_{contextName}_instances.forEach((comp, key) => {{");
            code.AppendLine($"{context.Indent()}        if (!__new_{contextName}_map.has(key)) {{");
            code.AppendLine($"{context.Indent()}            comp.__dispose();");
            code.AppendLine($"{context.Indent()}        }}");
            code.AppendLine($"{context.Indent()}    }});");
            code.AppendLine($"{context.Indent()}    this.__foreach_{contextName}_instances = __new_{contextName}_map;");
            code.AppendLine($"{context.Indent()}}}");
        }
        
        return code.ToString();
    }
    
    private string GenerateSwitchWithChildren(TemplateSwitchDirective switchNode, CodeGenerationContext context)
    {
        var code = new StringBuilder();
        var expr = AddThisPrefix(switchNode.Expression, context.LoopVariables);
        
        code.AppendLine($"{context.Indent()}switch ({expr}) {{");
        
        var caseContext = new CodeGenerationContext
        {
            ParentVar = context.ParentVar,
            ClassName = context.ClassName,
            IndentLevel = context.IndentLevel + 1,
            LoopVariables = context.LoopVariables,
            SymbolTable = context.SymbolTable,
            ComponentInstances = context.ComponentInstances
        };
        
        foreach (var caseNode in switchNode.Cases)
        {
            code.AppendLine($"{caseContext.Indent()}case {caseNode.Value}:");
            
            var caseBodyContext = new CodeGenerationContext
            {
                ParentVar = caseContext.ParentVar,
                ClassName = caseContext.ClassName,
                IndentLevel = caseContext.IndentLevel + 1,
                LoopVariables = caseContext.LoopVariables,
                SymbolTable = caseContext.SymbolTable,
                ComponentInstances = caseContext.ComponentInstances
            };
            foreach (var child in caseNode.Nodes)
            {
                code.Append(GenerateNode(child, caseBodyContext));
            }
            
            code.AppendLine($"{caseBodyContext.Indent()}break;");
        }
        
        if (switchNode.DefaultCase != null)
        {
            code.AppendLine($"{caseContext.Indent()}default:");
            
            var defaultContext = new CodeGenerationContext
            {
                ParentVar = caseContext.ParentVar,
                ClassName = caseContext.ClassName,
                IndentLevel = caseContext.IndentLevel + 1,
                LoopVariables = caseContext.LoopVariables,
                SymbolTable = caseContext.SymbolTable,
                ComponentInstances = caseContext.ComponentInstances
            };
            foreach (var child in switchNode.DefaultCase.Nodes)
            {
                code.Append(GenerateNode(child, defaultContext));
            }
        }
        
        code.AppendLine($"{context.Indent()}}}");
        
        return code.ToString();
    }
    
    private string AddThisPrefix(string expression, HashSet<string> loopVariables)
    {
        expression = expression.Trim();
        
        if (expression.StartsWith("this.") || expression.StartsWith("!this."))
            return expression;
        
        // Handle negation
        if (expression.StartsWith("!"))
        {
            var rest = expression.Substring(1).Trim();
            if (!rest.StartsWith("this."))
                return "!this." + rest;
            return expression;
        }
        
        // Simple identifier or property access
        var firstPart = expression.Split('.', '(', ' ', '?', '!', '[', '=', '+', '-', '*', '/', '%', '&', '|', '<', '>')[0];
        
        if (loopVariables.Contains(firstPart))
            return expression;
        
        // Simple cases - just add this.
        if (!expression.Contains("(") && !expression.Contains(" ") && !expression.Contains("?"))
            return "this." + expression;
        
        // Extract arrow function parameters to skip them
        var arrowFunctionParams = new HashSet<string>();
        var arrowMatches = System.Text.RegularExpressions.Regex.Matches(expression, @"\(([^)]+?)\)\s*=>");
        foreach (System.Text.RegularExpressions.Match arrowMatch in arrowMatches)
        {
            var paramList = arrowMatch.Groups[1].Value;
            // Extract parameter names, handling both "a, b" and "a: type, b: type"
            foreach (var p in paramList.Split(','))
            {
                var trimmed = p.Trim();
                // Remove type annotations if present (e.g., "a: number" -> "a")
                var colonIndex = trimmed.IndexOf(':');
                if (colonIndex > 0)
                    trimmed = trimmed.Substring(0, colonIndex).Trim();
                
                // Only add if it's a valid identifier
                if (!string.IsNullOrEmpty(trimmed) && char.IsLetter(trimmed[0]))
                {
                    arrowFunctionParams.Add(trimmed);
                }
            }
        }
        
        // Also check for single parameter arrow functions: x => x * 2
        // But not if preceded by ) which means it's part of multi-param arrow function
        var singleParamMatches = System.Text.RegularExpressions.Regex.Matches(expression, @"(?<![)\w])\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=>");
        foreach (System.Text.RegularExpressions.Match singleMatch in singleParamMatches)
        {
            arrowFunctionParams.Add(singleMatch.Groups[1].Value);
        }
        
        // Complex expressions - use regex to add this. to identifiers
        var result = System.Text.RegularExpressions.Regex.Replace(
            expression,
            @"\b([a-zA-Z_][a-zA-Z0-9_]*)\b",
            match =>
            {
                var identifier = match.Value;
                var startIndex = match.Index;
                
                // Skip keywords, loop variables, and arrow function parameters
                if (loopVariables.Contains(identifier) ||
                    arrowFunctionParams.Contains(identifier) ||
                    identifier == "true" || identifier == "false" || identifier == "null" ||
                    identifier == "undefined" || identifier == "this" || identifier == "new" ||
                    identifier == "typeof" || identifier == "void" || identifier == "delete" ||
                    identifier == "in" || identifier == "of" || identifier == "return")
                {
                    return identifier;
                }
                
                // Skip if preceded by dot (property access)
                if (startIndex > 0 && expression[startIndex - 1] == '.')
                    return identifier;
                
                // Skip if already prefixed with this.
                if (startIndex >= 5 && expression.Substring(startIndex - 5, 5) == "this.")
                    return identifier;
                
                // Skip if inside string literal (check for quotes before this position)
                var beforeMatch = expression.Substring(0, startIndex);
                int singleQuotes = 0, doubleQuotes = 0;
                bool escaped = false;
                
                for (int i = 0; i < beforeMatch.Length; i++)
                {
                    char c = beforeMatch[i];
                    if (c == '\\' && !escaped)
                    {
                        escaped = true;
                        continue;
                    }
                    if (!escaped)
                    {
                        if (c == '\'') singleQuotes++;
                        if (c == '"') doubleQuotes++;
                    }
                    escaped = false;
                }
                
                // If odd number of quotes, we're inside a string
                if (singleQuotes % 2 == 1 || doubleQuotes % 2 == 1)
                    return identifier;
                
                return "this." + identifier;
            });
        
        return result;
    }
}
