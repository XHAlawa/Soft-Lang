using System.Text;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Models;

namespace Soft.Compiler.Template.Parser;

/// <summary>
/// Parses HTML elements and their attributes.
/// Extracted from monolithic parser.
/// </summary>
public class ElementParser : BaseParser
{
    private readonly AttributeParser _attributeParser;
    
    private static readonly HashSet<string> VoidElements = new(StringComparer.OrdinalIgnoreCase)
    {
        "area", "base", "br", "col", "command", "embed", "hr", "img",
        "input", "keygen", "link", "meta", "param", "source", "track", "wbr"
    };
    
    public ElementParser(IDiagnosticReporter diagnosticReporter, AttributeParser attributeParser) 
        : base(diagnosticReporter)
    {
        _attributeParser = attributeParser;
    }
    
    public TemplateElement ParseElement(Func<TemplateNode?> parseNodeFunc)
    {
        var startLocation = CreateLocation();
        Expect('<');
        
        var tagName = ParseTagName();
        var element = new TemplateElement
        {
            TagName = tagName,
            NodeId = NextNodeId(),
            Location = startLocation,
            IsComponent = char.IsUpper(tagName[0])
        };
        
        SkipWhitespace();
        
        // Parse attributes
        while (!IsAtEnd() && Peek() != '>' && !(Peek() == '/' && LookAhead(1) == '>'))
        {
            var attrName = ParseAttributeName();
            if (string.IsNullOrEmpty(attrName))
            {
                if (!IsAtEnd()) Advance();
                continue;
            }
            
            string? attrValue = null;
            if (Match("="))
            {
                attrValue = ParseAttributeValue();
            }
            
            var attr = _attributeParser.ParseAttribute(attrName, attrValue, tagName, CreateLocation());
            element.Attributes.Add(attr);
            
            SkipWhitespace();
        }
        
        if (Match("/>"))
        {
            element.IsSelfClosing = true;
            return element;
        }
        
        Expect('>');
        
        if (VoidElements.Contains(tagName))
        {
            element.IsSelfClosing = true;
            return element;
        }
        
        // Parse children
        var lastPosition = -1;
        var stuckCount = 0;
        
        while (!IsAtEnd())
        {
            var currentPosition = _context.Position;
            
            // Detect infinite loop
            if (currentPosition == lastPosition)
            {
                stuckCount++;
                if (stuckCount > 3)
                {
                    ReportError("TMPL004", $"Parser stuck parsing children of <{tagName}> at position {currentPosition}");
                    Advance(); // Force advance
                    stuckCount = 0;
                }
            }
            else
            {
                stuckCount = 0;
            }
            lastPosition = currentPosition;
            
            SkipWhitespace();
            
            if (Match($"</{tagName}", StringComparison.OrdinalIgnoreCase))
            {
                SkipWhitespace();
                Expect('>');
                break;
            }
            
            if (Peek() == '<' && LookAhead(1) == '/')
            {
                break;
            }
            
            var child = parseNodeFunc();
            if (child != null)
            {
                child.Parent = element;
                element.ChildNodes.Add(child);
            }
            else if (!IsAtEnd())
            {
                // If parseNodeFunc returns null and we're not at a closing tag, advance to prevent infinite loop
                if (Peek() != '<' || LookAhead(1) != '/')
                {
                    Advance();
                }
            }
        }
        
        return element;
    }
    
    public string ParseTagName()
    {
        var sb = new StringBuilder();
        while (!IsAtEnd() && (char.IsLetterOrDigit(Peek()) || Peek() == '-' || Peek() == '_'))
        {
            sb.Append(Advance());
        }
        return sb.ToString();
    }
    
    public string ParseAttributeName()
    {
        var sb = new StringBuilder();
        while (!IsAtEnd() && (char.IsLetterOrDigit(Peek()) || Peek() == '-' || Peek() == '_' || Peek() == ':' || Peek() == '@' || Peek() == '.'))
        {
            sb.Append(Advance());
        }
        return sb.ToString();
    }
    
    public string? ParseAttributeValue()
    {
        SkipWhitespace();
        
        if (Peek() == '"' || Peek() == '\'')
        {
            var quote = Advance();
            var sb = new StringBuilder();
            while (!IsAtEnd() && Peek() != quote)
            {
                if (Peek() == '\\' && LookAhead(1) == quote)
                {
                    Advance();
                }
                sb.Append(Advance());
            }
            if (!IsAtEnd()) Advance();
            return sb.ToString();
        }
        
        var value = new StringBuilder();
        while (!IsAtEnd() && !char.IsWhiteSpace(Peek()) && Peek() != '>' && Peek() != '/')
        {
            value.Append(Advance());
        }
        return value.Length > 0 ? value.ToString() : null;
    }
}
