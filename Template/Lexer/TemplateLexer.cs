using System.Text;
using Soft.Compiler.Models;

namespace Soft.Compiler.Template.Lexer;

/// <summary>
/// Tokenizes template source into a stream of tokens.
/// Separates lexical analysis from parsing.
/// </summary>
public class TemplateLexer
{
    private readonly string _source;
    private readonly string _filePath;
    private int _position;
    private int _line = 1;
    private int _column = 1;
    
    public TemplateLexer(string source, string filePath)
    {
        _source = source ?? "";
        _filePath = filePath ?? "";
    }
    
    public List<Token> Tokenize()
    {
        var tokens = new List<Token>();
        
        while (!IsAtEnd())
        {
            var token = NextToken();
            if (token.Kind != TokenKind.Invalid)
            {
                tokens.Add(token);
            }
        }
        
        tokens.Add(new Token(TokenKind.EndOfFile, "", CreateLocation()));
        return tokens;
    }
    
    private Token NextToken()
    {
        SkipWhitespace();
        
        if (IsAtEnd())
            return new Token(TokenKind.EndOfFile, "", CreateLocation());
        
        var location = CreateLocation();
        var ch = Peek();
        
        // HTML/Template structure
        if (ch == '<')
        {
            if (LookAhead(1) == '!' && LookAhead(2) == '-' && LookAhead(3) == '-')
                return ScanComment();
            
            Advance();
            return new Token(TokenKind.LessThan, "<", location);
        }
        
        if (ch == '>')
        {
            Advance();
            return new Token(TokenKind.GreaterThan, ">", location);
        }
        
        if (ch == '/')
        {
            Advance();
            return new Token(TokenKind.Slash, "/", location);
        }
        
        if (ch == '=')
        {
            Advance();
            return new Token(TokenKind.Equals, "=", location);
        }
        
        if (ch == '{')
        {
            Advance();
            return new Token(TokenKind.LeftBrace, "{", location);
        }
        
        if (ch == '}')
        {
            Advance();
            return new Token(TokenKind.RightBrace, "}", location);
        }
        
        if (ch == '(')
        {
            Advance();
            return new Token(TokenKind.LeftParen, "(", location);
        }
        
        if (ch == ')')
        {
            Advance();
            return new Token(TokenKind.RightParen, ")", location);
        }
        
        if (ch == '.')
        {
            Advance();
            return new Token(TokenKind.Dot, ".", location);
        }
        
        if (ch == ':')
        {
            Advance();
            return new Token(TokenKind.Colon, ":", location);
        }
        
        if (ch == ',')
        {
            Advance();
            return new Token(TokenKind.Comma, ",", location);
        }
        
        // Directive
        if (ch == '@')
        {
            return ScanDirective();
        }
        
        // String literals
        if (ch == '"' || ch == '\'')
        {
            return ScanString(ch);
        }
        
        // Identifier
        if (char.IsLetter(ch) || ch == '_')
        {
            return ScanIdentifier();
        }
        
        // Text content (between tags)
        return ScanText();
    }
    
    private Token ScanComment()
    {
        var location = CreateLocation();
        var sb = new StringBuilder();
        
        // Skip <!--
        Advance(); Advance(); Advance(); Advance();
        
        while (!IsAtEnd())
        {
            if (Peek() == '-' && LookAhead(1) == '-' && LookAhead(2) == '>')
            {
                Advance(); Advance(); Advance();
                break;
            }
            sb.Append(Advance());
        }
        
        return new Token(TokenKind.Comment, sb.ToString(), location);
    }
    
    private Token ScanDirective()
    {
        var location = CreateLocation();
        Advance(); // Skip @
        
        var sb = new StringBuilder();
        while (!IsAtEnd() && (char.IsLetterOrDigit(Peek()) || Peek() == '_'))
        {
            sb.Append(Advance());
        }
        
        return new Token(TokenKind.Directive, sb.ToString(), location);
    }
    
    private Token ScanString(char quote)
    {
        var location = CreateLocation();
        Advance(); // Skip opening quote
        
        var sb = new StringBuilder();
        while (!IsAtEnd() && Peek() != quote)
        {
            if (Peek() == '\\' && LookAhead(1) == quote)
            {
                Advance(); // Skip backslash
            }
            sb.Append(Advance());
        }
        
        if (!IsAtEnd()) Advance(); // Skip closing quote
        
        return new Token(TokenKind.String, sb.ToString(), location);
    }
    
    private Token ScanIdentifier()
    {
        var location = CreateLocation();
        var sb = new StringBuilder();
        
        while (!IsAtEnd() && (char.IsLetterOrDigit(Peek()) || Peek() == '_' || Peek() == '-'))
        {
            sb.Append(Advance());
        }
        
        return new Token(TokenKind.Identifier, sb.ToString(), location);
    }
    
    private Token ScanText()
    {
        var location = CreateLocation();
        var sb = new StringBuilder();
        
        while (!IsAtEnd())
        {
            var ch = Peek();
            if (ch == '<' || ch == '@' || ch == '}')
                break;
            
            sb.Append(Advance());
        }
        
        return new Token(TokenKind.Text, sb.ToString(), location);
    }
    
    private void SkipWhitespace()
    {
        while (!IsAtEnd() && char.IsWhiteSpace(Peek()))
        {
            Advance();
        }
    }
    
    private bool IsAtEnd() => _position >= _source.Length;
    
    private char Peek() => IsAtEnd() ? '\0' : _source[_position];
    
    private char LookAhead(int offset)
    {
        var pos = _position + offset;
        return pos >= _source.Length ? '\0' : _source[pos];
    }
    
    private char Advance()
    {
        if (IsAtEnd()) return '\0';
        
        var ch = _source[_position++];
        if (ch == '\n')
        {
            _line++;
            _column = 1;
        }
        else
        {
            _column++;
        }
        return ch;
    }
    
    private SourceLocation CreateLocation() => new SourceLocation(_filePath, _line, _column);
}
