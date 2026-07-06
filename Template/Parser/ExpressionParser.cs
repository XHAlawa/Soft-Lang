using System.Text;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Models;

namespace Soft.Compiler.Template.Parser;

/// <summary>
/// Parses expressions in templates.
/// Extracted from monolithic parser.
/// </summary>
public class ExpressionParser : BaseParser
{
    public ExpressionParser(IDiagnosticReporter diagnosticReporter) : base(diagnosticReporter)
    {
    }
    
    public string ParseBalancedExpression(char endChar)
    {
        var sb = new StringBuilder();
        var parenDepth = 0;
        var bracketDepth = 0;
        var braceDepth = 0;
        bool inString = false;
        char stringChar = '\0';
        bool escaped = false;
        
        while (!IsAtEnd())
        {
            var c = Peek();
            
            // Handle escape sequences
            if (escaped)
            {
                escaped = false;
                sb.Append(Advance());
                continue;
            }
            
            if (c == '\\' && inString)
            {
                escaped = true;
                sb.Append(Advance());
                continue;
            }
            
            // Track string literals
            if ((c == '"' || c == '\'' || c == '`') && !inString)
            {
                inString = true;
                stringChar = c;
                sb.Append(Advance());
                continue;
            }
            else if (c == stringChar && inString)
            {
                inString = false;
                sb.Append(Advance());
                continue;
            }
            
            // Only process delimiters if NOT inside string
            if (!inString)
            {
                // Stop at template boundaries, but allow comparison operators
                if (c == '<')
                {
                    // Check if it's a comparison operator (<=, <, <<)
                    var next = LookAhead(1);
                    if (next != '=' && next != '<' && !char.IsWhiteSpace(next) && !char.IsLetterOrDigit(next))
                        break; // Likely start of HTML tag
                }
                else if (c == '>')
                {
                    // Check if it's a comparison operator (>=, >, >>)
                    var prev = sb.Length > 0 ? sb[sb.Length - 1] : '\0';
                    var next = LookAhead(1);
                    if (prev != '=' && prev != '>' && prev != '<' && next != '=' && next != '>')
                    {
                        // Could be end of HTML tag, but also could be comparison
                        // If we're at depth 0 and it's not followed by space or operator, it's likely HTML
                        if (parenDepth == 0 && bracketDepth == 0 && braceDepth == 0 && !char.IsWhiteSpace(next) && next != '=' && next != '>')
                            break;
                    }
                }
                
                // Handle parentheses balancing
                if (c == '(' && endChar == ')') parenDepth++;
                else if (c == ')' && endChar == ')')
                {
                    if (parenDepth == 0) break;
                    parenDepth--;
                }
                
                // Handle bracket balancing
                if (c == '[' && endChar == ']') bracketDepth++;
                else if (c == ']' && endChar == ']')
                {
                    if (bracketDepth == 0) break;
                    bracketDepth--;
                }
                
                // Handle brace balancing for {expression} interpolation
                if (c == '{' && endChar == '}') braceDepth++;
                else if (c == '}' && endChar == '}')
                {
                    if (braceDepth == 0) break;
                    braceDepth--;
                }
            }
            
            sb.Append(Advance());
        }
        
        return sb.ToString().Trim();
    }
    
    public string ParseInlineExpression()
    {
        var sb = new StringBuilder();
        while (!IsAtEnd() && !char.IsWhiteSpace(Peek()) && Peek() != '<' && Peek() != '>' && Peek() != '{' && Peek() != '}')
        {
            sb.Append(Advance());
        }
        return sb.ToString().Trim();
    }
    
    public string ParseIdentifier()
    {
        var sb = new StringBuilder();
        while (!IsAtEnd() && (char.IsLetterOrDigit(Peek()) || Peek() == '_'))
        {
            sb.Append(Advance());
        }
        return sb.ToString();
    }
    
    public TemplateInterpolation ParseParenthesizedExpression(SourceLocation location, int nodeId)
    {
        Expect('(');
        var expression = ParseBalancedExpression(')');
        Expect(')');
        
        return new TemplateInterpolation
        {
            NodeId = nodeId,
            Location = location,
            Expression = expression.Trim()
        };
    }
    
    public TemplateInterpolation ParseExpressionBinding(string identifier, SourceLocation location, int nodeId)
    {
        var sb = new StringBuilder();
        sb.Append(identifier);
        
        while (Peek() == '.' || Peek() == '(' || Peek() == '[')
        {
            if (Peek() == '.')
            {
                sb.Append(Advance());
                var member = ParseIdentifier();
                sb.Append(member);
            }
            else if (Peek() == '(')
            {
                // Parse method call with arguments
                sb.Append('(');
                Advance(); // consume '('
                var args = ParseBalancedExpression(')');
                sb.Append(args);
                sb.Append(')');
                Expect(')');
            }
            else if (Peek() == '[')
            {
                // Parse array indexing
                sb.Append('[');
                Advance(); // consume '['
                var index = ParseBalancedExpression(']');
                sb.Append(index);
                sb.Append(']');
                Expect(']');
            }
        }
        
        return new TemplateInterpolation
        {
            NodeId = nodeId,
            Location = location,
            Expression = sb.ToString()
        };
    }
}
