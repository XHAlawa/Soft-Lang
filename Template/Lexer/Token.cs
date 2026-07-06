using Soft.Compiler.Models;

namespace Soft.Compiler.Template.Lexer;

public enum TokenKind
{
    // Structural
    LessThan,           // <
    GreaterThan,        // >
    Slash,              // /
    Equals,             // =
    At,                 // @
    LeftBrace,          // {
    RightBrace,         // }
    LeftParen,          // (
    RightParen,         // )
    Dot,                // .
    Colon,              // :
    Comma,              // ,
    
    // Literals
    Identifier,         // tagName, attrName, etc.
    String,             // "value" or 'value'
    Text,               // plain text content
    
    // Special
    Comment,            // <!-- -->
    Directive,          // @if, @foreach, etc.
    EndOfFile,
    Invalid
}

public readonly struct Token
{
    public TokenKind Kind { get; init; }
    public string Value { get; init; }
    public SourceLocation Location { get; init; }
    
    public Token(TokenKind kind, string value, SourceLocation location)
    {
        Kind = kind;
        Value = value;
        Location = location;
    }
    
    public override string ToString() => $"{Kind}: '{Value}' at {Location.Line}:{Location.Column}";
}
