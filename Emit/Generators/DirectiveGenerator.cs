using System.Text;
using Soft.Compiler.Template;
using Soft.Compiler.Abstractions;

namespace Soft.Compiler.Emit.Generators;

public class DirectiveGenerator : INodeGenerator
{
    public bool CanGenerate(TemplateNode node) => 
        node is TemplateIfDirective || 
        node is TemplateForEachDirective || 
        node is TemplateSwitchDirective;
    
    public string Generate(TemplateNode node, CodeGenerationContext context)
    {
        return node switch
        {
            TemplateIfDirective ifDir => GenerateIf(ifDir, context),
            TemplateForEachDirective forEach => GenerateForEach(forEach, context),
            TemplateSwitchDirective switchDir => GenerateSwitch(switchDir, context),
            _ => ""
        };
    }
    
    private string GenerateIf(TemplateIfDirective ifNode, CodeGenerationContext context)
    {
        var code = new StringBuilder();
        var condition = AddThisPrefix(ifNode.Condition, context.LoopVariables);
        
        code.AppendLine($"{context.Indent()}if ({condition}) {{");
        // Children handled by orchestrator
        code.AppendLine($"{context.Indent()}}}");
        
        foreach (var elseIf in ifNode.ElseIfBranches)
        {
            var elseIfCondition = AddThisPrefix(elseIf.Condition, context.LoopVariables);
            code.AppendLine($"{context.Indent()}else if ({elseIfCondition}) {{");
            code.AppendLine($"{context.Indent()}}}");
        }
        
        if (ifNode.ElseBranch != null)
        {
            code.AppendLine($"{context.Indent()}else {{");
            code.AppendLine($"{context.Indent()}}}");
        }
        
        return code.ToString();
    }
    
    private string GenerateForEach(TemplateForEachDirective forEach, CodeGenerationContext context)
    {
        var code = new StringBuilder();
        var itemVar = forEach.ItemVariable;
        var indexVar = forEach.IndexVariable ?? "index";
        var collectionExpr = forEach.CollectionExpression;
        
        code.AppendLine($"{context.Indent()}(this.{collectionExpr} || []).forEach(({itemVar}, {indexVar}) => {{");
        // Children handled by orchestrator
        code.AppendLine($"{context.Indent()}}});");
        
        return code.ToString();
    }
    
    private string GenerateSwitch(TemplateSwitchDirective switchNode, CodeGenerationContext context)
    {
        var code = new StringBuilder();
        var expr = AddThisPrefix(switchNode.Expression, context.LoopVariables);
        
        code.AppendLine($"{context.Indent()}switch ({expr}) {{");
        
        foreach (var caseNode in switchNode.Cases)
        {
            code.AppendLine($"{context.Indent()}  case {caseNode.Value}:");
            // Children handled by orchestrator
            code.AppendLine($"{context.Indent()}    break;");
        }
        
        if (switchNode.DefaultCase != null)
        {
            code.AppendLine($"{context.Indent()}  default:");
            // Children handled by orchestrator
        }
        
        code.AppendLine($"{context.Indent()}}}");
        
        return code.ToString();
    }
    
    private string AddThisPrefix(string expression, HashSet<string> loopVariables)
    {
        expression = expression.Trim();
        
        if (expression.StartsWith("this.") || expression.StartsWith("!this."))
            return expression;
        
        if (expression.StartsWith("!"))
        {
            var rest = expression.Substring(1).Trim();
            if (!rest.StartsWith("this."))
                return "!this." + rest;
            return expression;
        }
        
        var firstPart = expression.Split('.', '(', ' ', '?', '!', '[')[0];
        
        if (loopVariables.Contains(firstPart))
            return expression;
        
        if (!expression.Contains("(") && !expression.Contains(" ") && !expression.Contains("?"))
            return "this." + expression;
        
        return expression;
    }
}
