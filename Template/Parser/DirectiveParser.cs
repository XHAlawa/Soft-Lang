using System.Text;
using System.Text.RegularExpressions;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Models;

namespace Soft.Compiler.Template.Parser;

/// <summary>
/// Parses template directives (@if, @foreach, @switch, etc.)
/// Extracted from monolithic TemplateParser.
/// </summary>
public class DirectiveParser
{
    private readonly IDiagnosticReporter _diagnosticReporter;
    
    public DirectiveParser(IDiagnosticReporter diagnosticReporter)
    {
        _diagnosticReporter = diagnosticReporter;
    }
    
    public TemplateIfDirective ParseIf(string condition, SourceLocation location, int nodeId)
    {
        return new TemplateIfDirective
        {
            NodeId = nodeId,
            Location = location,
            Condition = condition.Trim()
        };
    }
    
    public TemplateForEachDirective ParseForEach(string expression, SourceLocation location, int nodeId)
    {
        var directive = new TemplateForEachDirective
        {
            NodeId = nodeId,
            Location = location
        };
        
        ParseForEachExpression(directive, expression);
        return directive;
    }
    
    private void ParseForEachExpression(TemplateForEachDirective directive, string expr)
    {
        // Pattern: item in collection
        // Pattern: item, index in collection
        // Pattern: item in collection trackby item.id
        var inMatch = Regex.Match(expr, @"(\w+)(?:\s*,\s*(\w+))?\s+(?:in|of)\s+(.+?)(?:\s+trackby\s+(.+))?$", RegexOptions.IgnoreCase);
        
        if (inMatch.Success)
        {
            directive.ItemVariable = inMatch.Groups[1].Value;
            if (inMatch.Groups[2].Success)
            {
                directive.IndexVariable = inMatch.Groups[2].Value;
            }
            directive.CollectionExpression = inMatch.Groups[3].Value.Trim();
            if (inMatch.Groups[4].Success)
            {
                directive.TrackByExpression = inMatch.Groups[4].Value.Trim();
            }
        }
        else
        {
            directive.ItemVariable = "item";
            directive.CollectionExpression = expr.Trim();
        }
    }
    
    public TemplateSwitchDirective ParseSwitch(string expression, SourceLocation location, int nodeId)
    {
        return new TemplateSwitchDirective
        {
            NodeId = nodeId,
            Location = location,
            Expression = expression.Trim()
        };
    }
    
    public TemplateCaseDirective ParseCase(string value, SourceLocation location, int nodeId)
    {
        return new TemplateCaseDirective
        {
            NodeId = nodeId,
            Location = location,
            Value = value.Trim()
        };
    }
    
    public TemplateDefaultDirective ParseDefault(SourceLocation location, int nodeId)
    {
        return new TemplateDefaultDirective
        {
            NodeId = nodeId,
            Location = location
        };
    }
}
