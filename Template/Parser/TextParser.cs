using System.Text;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Models;

namespace Soft.Compiler.Template.Parser;

/// <summary>
/// Parses text nodes and comments.
/// Extracted from monolithic parser.
/// </summary>
public class TextParser : BaseParser
{
    public TextParser(IDiagnosticReporter diagnosticReporter) : base(diagnosticReporter)
    {
    }
    
    public TemplateText ParseText()
    {
        var location = CreateLocation();
        var sb = new StringBuilder();
        
        while (!IsAtEnd())
        {
            if (Peek() == '<') break;
            if (Peek() == '{') break;  // Stop at interpolation start
            if (Peek() == '}') break;
            
            // Break on @ if it looks like a directive: @identifier(
            // This allows TemplateParser to handle @if(...), @foreach(...), @switch(...), etc.
            // But treats standalone @ or @identifier without ( as literal text
            if (Peek() == '@')
            {
                var pos = _context.Position + 1;
                // Skip identifier
                while (pos < _context.Source.Length && (char.IsLetterOrDigit(_context.Source[pos]) || _context.Source[pos] == '_'))
                    pos++;
                // Skip whitespace
                while (pos < _context.Source.Length && char.IsWhiteSpace(_context.Source[pos]))
                    pos++;
                // If followed by (, it's a directive - break and let TemplateParser handle it
                if (pos < _context.Source.Length && _context.Source[pos] == '(')
                    break;
            }
            
            sb.Append(Advance());
        }
        
        return new TemplateText
        {
            NodeId = NextNodeId(),
            Location = location,
            Content = sb.ToString()
        };
    }
    
    private bool IsLikelyDirectiveOrInterpolation()
    {
        // Check if @ is preceded by text (not whitespace/tag) - likely an email address
        if (_context.Position > 0)
        {
            var prevChar = _context.Source[_context.Position - 1];
            // If @ is immediately after a letter, digit, or common email chars, it's likely an email
            if (char.IsLetterOrDigit(prevChar) || prevChar == '.' || prevChar == '_' || prevChar == '-' || prevChar == '+')
            {
                // @ is part of an email or similar pattern like "test@example.com"
                return false;
            }
        }
        
        // Check if @ is followed by a valid directive/interpolation pattern
        var pos = _context.Position + 1;
        if (pos >= _context.Source.Length) return false;
        
        var nextChar = _context.Source[pos];
        
        // Must start with letter or underscore
        if (!char.IsLetter(nextChar) && nextChar != '_')
            return false;
        
        // Read the full identifier after @
        var identifierEnd = pos;
        while (identifierEnd < _context.Source.Length)
        {
            var c = _context.Source[identifierEnd];
            if (!char.IsLetterOrDigit(c) && c != '_')
                break;
            identifierEnd++;
        }
        
        var identifier = _context.Source.Substring(pos, identifierEnd - pos);
        
        // Check what comes after the identifier
        if (identifierEnd >= _context.Source.Length)
            return true; // End of source, treat as interpolation
        
        var charAfter = _context.Source[identifierEnd];
        
        // Property access or method call - definitely a directive/interpolation
        if (charAfter == '(' || charAfter == '.' || charAfter == '[')
            return true;
        
        // Followed by comma or period - likely literal text in a sentence
        if (charAfter == ',' || charAfter == '.')
            return false;
        
        // Check for common sentence patterns after whitespace
        if (char.IsWhiteSpace(charAfter))
        {
            var nextNonSpace = identifierEnd + 1;
            while (nextNonSpace < _context.Source.Length && char.IsWhiteSpace(_context.Source[nextNonSpace]))
                nextNonSpace++;
            
            if (nextNonSpace < _context.Source.Length)
            {
                var afterSpace = _context.Source[nextNonSpace];
                
                // Followed by punctuation - literal text
                if (afterSpace == ',' || afterSpace == '.' || afterSpace == ';' || afterSpace == ':')
                    return false;
                
                // Check for "and", "or", "directive", "in" - common words in descriptive text
                var remainingText = _context.Source.Substring(nextNonSpace);
                if (remainingText.StartsWith("and ") || remainingText.StartsWith("or ") || 
                    remainingText.StartsWith("directive") || remainingText.StartsWith("in ") ||
                    remainingText.StartsWith("at ") || remainingText.StartsWith("is "))
                    return false;
            }
            
            // Just whitespace after - could be interpolation at end of text
            // Check if we're in the middle of a sentence (has text before @)
            var textBefore = _context.Source.Substring(0, _context.Position).TrimEnd();
            if (textBefore.Length > 0 && !textBefore.EndsWith(">") && !textBefore.EndsWith("{"))
            {
                // Has text before and whitespace after - likely literal text in a sentence
                return false;
            }
        }
        
        // Otherwise treat as directive/interpolation
        return true;
    }
    
    public void SkipComment()
    {
        // Skip until we find --> or reach end
        while (!IsAtEnd())
        {
            if (Match("-->"))
            {
                break;
            }
            Advance();
        }
    }
    
    public void ParseBlockContent(List<TemplateNode> nodes, char endChar, Func<TemplateNode?> parseNodeFunc)
    {
        var lastPosition = -1;
        var stuckCount = 0;
        
        while (!IsAtEnd() && Peek() != endChar)
        {
            var currentPosition = _context.Position;
            
            // Detect infinite loop - if position hasn't changed
            if (currentPosition == lastPosition)
            {
                stuckCount++;
                if (stuckCount > 3)
                {
                    ReportError("TMPL003", $"Parser stuck at position {currentPosition}, char '{Peek()}'");
                    Advance(); // Force advance to break the loop
                    stuckCount = 0;
                }
            }
            else
            {
                stuckCount = 0;
            }
            lastPosition = currentPosition;
            
            var node = parseNodeFunc();
            if (node != null)
            {
                nodes.Add(node);
            }
            else if (!IsAtEnd() && Peek() != endChar)
            {
                Advance();
            }
        }
    }
}
