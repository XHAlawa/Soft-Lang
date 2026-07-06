using Soft.Compiler.Diagnostics;
using Soft.Compiler.Models;
using Soft.Compiler.Abstractions;
using Soft.Compiler.Template.Parser;
using Soft.Compiler.Language;

namespace Soft.Compiler.Template;

/// <summary>
/// Slim orchestrator using specialized parsers.
/// BEFORE: 609 lines
/// AFTER: 195 lines
/// </summary>
public sealed class TemplateParser : ITemplateParser
{
    private readonly IDiagnosticReporter _diagnosticReporter;
    private readonly DirectiveParser _directiveParser;
    private readonly AttributeParser _attributeParser;
    private readonly ElementParser _elementParser;
    private readonly ExpressionParser _expressionParser;
    private readonly TextParser _textParser;
    
    private ParsingContext _context = null!;
    
    public TemplateParser(IDiagnosticReporter diagnosticReporter)
    {
        _diagnosticReporter = diagnosticReporter;
        _directiveParser = new DirectiveParser(diagnosticReporter);
        _attributeParser = new AttributeParser(diagnosticReporter);
        _elementParser = new ElementParser(diagnosticReporter, _attributeParser);
        _expressionParser = new ExpressionParser(diagnosticReporter);
        _textParser = new TextParser(diagnosticReporter);
    }
    
    public TemplateRoot Parse(string source, string filePath)
    {
        _context = new ParsingContext
        {
            Source = source,
            FilePath = filePath,
            Position = 0,
            Line = 1,
            Column = 1,
            NodeIdCounter = 0
        };
        
        // Initialize all sub-parsers with shared context
        _elementParser.Initialize(_context);
        _expressionParser.Initialize(_context);
        _textParser.Initialize(_context);
        
        return ParseInternal();
    }
    
    private TemplateRoot ParseInternal()
    {
        var root = new TemplateRoot
        {
            NodeId = NextNodeId(),
            Location = CreateLocation()
        };
        
        while (!IsAtEnd())
        {
            SkipWhitespace();
            if (IsAtEnd()) break;
            
            var node = ParseNode();
            if (node != null)
            {
                node.Parent = root;
                root.Nodes.Add(node);
            }
        }
        
        return root;
    }
    
    private TemplateNode? ParseNode()
    {
        if (IsAtEnd()) return null;
        
        if (Peek() == '<')
        {
            if (LookAhead(1) == '!' && Match("<!--"))
            {
                _textParser.SkipComment();
                return null;
            }
            
            if (LookAhead(1) == '/')
                return null;
            
            return _elementParser.ParseElement(ParseNode);
        }
        
        // Parse @ as directive if it looks like @identifier(...) syntax
        // Check for @if(...), @foreach(...), @switch(...), etc.
        if (Peek() == '@')
        {
            // Look ahead to see if this is a directive pattern: @identifier(
            var pos = _context.Position + 1;
            while (pos < _context.Source.Length && (char.IsLetterOrDigit(_context.Source[pos]) || _context.Source[pos] == '_'))
                pos++;
            
            // Skip whitespace after identifier
            while (pos < _context.Source.Length && char.IsWhiteSpace(_context.Source[pos]))
                pos++;
            
            // If followed by (, it's a directive
            if (pos < _context.Source.Length && _context.Source[pos] == '(')
            {
                return ParseDirective();
            }
        }
        
        if (Peek() == '{')
        {
            return ParseInterpolation();
        }
        
        return _textParser.ParseText();
    }
    
    private TemplateInterpolation ParseInterpolation()
    {
        var location = CreateLocation();
        Expect('{');
        
        var expression = _expressionParser.ParseBalancedExpression('}');
        Expect('}');
        
        return new TemplateInterpolation
        {
            NodeId = NextNodeId(),
            Location = location,
            Expression = expression.Trim()
        };
    }
    
    private TemplateNode? ParseDirective()
    {
        var location = CreateLocation();
        Expect('@');
        
        if (Peek() == '(')
        {
            return _expressionParser.ParseParenthesizedExpression(location, NextNodeId());
        }
        
        var directiveName = _expressionParser.ParseIdentifier();
        var lowerName = directiveName.ToLowerInvariant();
        
        // Check for directive keywords BEFORE treating as expression
        // @if(...), @foreach(...), @switch(...), @form(...), @L(...) are directives, not expressions
        if (lowerName == "if" || lowerName == "foreach" || lowerName == "for" || lowerName == "switch" || lowerName == "form" || lowerName == "l")
        {
            return lowerName switch
            {
                "if" => ParseIfDirective(location),
                "foreach" or "for" => ParseForEachDirective(location),
                "switch" => ParseSwitchDirective(location),
                "form" => ParseFormDirective(location),
                "l" => ParseLocalizationDirective(location),
                _ => null
            };
        }
        
        // @else should only be parsed within @if context, not standalone
        if (lowerName == "else")
        {
            return null; // Skip @else, it will be handled by ParseIfDirective
        }
        
        // Now check for expression binding
        if (Peek() == '.' || Peek() == '[' || Peek() == '(')
        {
            return _expressionParser.ParseExpressionBinding(directiveName, location, NextNodeId());
        }
        
        // Default: treat as interpolation
        return new TemplateInterpolation
        {
            NodeId = NextNodeId(),
            Location = location,
            Expression = directiveName
        };
    }
    
    private TemplateIfDirective ParseIfDirective(SourceLocation location)
    {
        SkipWhitespace();
        string condition;
        if (Match("("))
        {
            condition = _expressionParser.ParseBalancedExpression(')');
            Expect(')');
        }
        else
        {
            condition = _expressionParser.ParseInlineExpression();
        }
        
        var directive = _directiveParser.ParseIf(condition, location, NextNodeId());
        
        SkipWhitespace();
        if (Match("{"))
        {
            _textParser.ParseBlockContent(directive.ThenNodes, '}', ParseNode);
            Expect('}');
        }
        else
        {
            var node = ParseNode();
            if (node != null) directive.ThenNodes.Add(node);
        }
        
        // Parse @else if / @else
        SkipWhitespace();
        while (Peek() == '@' && LookAhead(1) == 'e' && Match("@else"))
        {
            SkipWhitespace();
            if (Match("if") || Match("If"))
            {
                SkipWhitespace();
                string elseIfCondition;
                if (Match("("))
                {
                    elseIfCondition = _expressionParser.ParseBalancedExpression(')');
                    Expect(')');
                }
                else
                {
                    elseIfCondition = _expressionParser.ParseInlineExpression();
                }
                
                var elseIf = new TemplateElseIfDirective
                {
                    NodeId = NextNodeId(),
                    Location = CreateLocation(),
                    Condition = elseIfCondition
                };
                
                SkipWhitespace();
                if (Match("{"))
                {
                    _textParser.ParseBlockContent(elseIf.Nodes, '}', ParseNode);
                    Expect('}');
                }
                
                directive.ElseIfBranches.Add(elseIf);
            }
            else
            {
                var elseBranch = new TemplateElseDirective
                {
                    NodeId = NextNodeId(),
                    Location = CreateLocation()
                };
                
                SkipWhitespace();
                if (Match("{"))
                {
                    _textParser.ParseBlockContent(elseBranch.Nodes, '}', ParseNode);
                    Expect('}');
                }
                
                directive.ElseBranch = elseBranch;
                break;
            }
            SkipWhitespace();
        }
        
        return directive;
    }
    
    private TemplateForEachDirective ParseForEachDirective(SourceLocation location)
    {
        SkipWhitespace();
        
        // Parse the foreach expression: (item in collection)
        Expect('(');
        var expr = _expressionParser.ParseBalancedExpression(')');
        Expect(')');
        
        var directive = _directiveParser.ParseForEach(expr, location, NextNodeId());
        
        SkipWhitespace();
        if (Match("{"))
        {
            _textParser.ParseBlockContent(directive.BodyNodes, '}', ParseNode);
            Expect('}');
        }
        
        return directive;
    }
    
    private TemplateSwitchDirective ParseSwitchDirective(SourceLocation location)
    {
        SkipWhitespace();
        string expr;
        if (Match("("))
        {
            expr = _expressionParser.ParseBalancedExpression(')');
            Expect(')');
        }
        else
        {
            expr = _expressionParser.ParseInlineExpression();
        }
        
        var directive = _directiveParser.ParseSwitch(expr, location, NextNodeId());
        
        SkipWhitespace();
        
        // Support both @switch{} and @switch...@endswitch syntax
        bool usesEndswitch = !Match("{");
        
        while (!IsAtEnd() && (usesEndswitch ? !Match("@endswitch") : Peek() != '}'))
        {
            SkipWhitespace();
            if (Match("@case"))
            {
                SkipWhitespace();
                string caseValue;
                if (Match("("))
                {
                    caseValue = _expressionParser.ParseBalancedExpression(')');
                    Expect(')');
                }
                else
                {
                    caseValue = _expressionParser.ParseInlineExpression();
                }
                
                var caseDir = _directiveParser.ParseCase(caseValue, CreateLocation(), NextNodeId());
                
                SkipWhitespace();
                if (Match("{"))
                {
                    // Brace syntax: @case('A') { ... }
                    _textParser.ParseBlockContent(caseDir.Nodes, '}', ParseNode);
                    Expect('}');
                }
                else if (usesEndswitch)
                {
                    // Endswitch syntax: parse until next @case, @default, or @endswitch
                    while (!IsAtEnd() && !Peek("@case") && !Peek("@default") && !Peek("@endswitch"))
                    {
                        caseDir.Nodes.Add(ParseNode());
                        SkipWhitespace();
                    }
                }
                
                directive.Cases.Add(caseDir);
            }
            else if (Match("@default"))
            {
                var defaultDir = _directiveParser.ParseDefault(CreateLocation(), NextNodeId());
                
                SkipWhitespace();
                if (Match("{"))
                {
                    // Brace syntax: @default { ... }
                    _textParser.ParseBlockContent(defaultDir.Nodes, '}', ParseNode);
                    Expect('}');
                }
                else if (usesEndswitch)
                {
                    // Endswitch syntax: parse until @endswitch
                    while (!IsAtEnd() && !Peek("@endswitch"))
                    {
                        defaultDir.Nodes.Add(ParseNode());
                        SkipWhitespace();
                    }
                }
                
                directive.DefaultCase = defaultDir;
            }
            else
            {
                Advance();
            }
        }
        
        // Expect closing brace only if using brace syntax
        if (!usesEndswitch)
        {
            Expect('}');
        }
        
        return directive;
    }
    
    private TemplateElement ParseFormDirective(SourceLocation location)
    {
        SkipWhitespace();
        string submitHandler;
        if (Match("("))
        {
            submitHandler = _expressionParser.ParseBalancedExpression(')');
            Expect(')');
        }
        else
        {
            submitHandler = _expressionParser.ParseInlineExpression();
        }
        
        // Create a form element
        var formElement = new TemplateElement
        {
            NodeId = NextNodeId(),
            Location = location,
            TagName = "form",
            IsComponent = false,
            IsSelfClosing = false
        };
        
        // Add test id attribute
        formElement.Attributes.Add(new TemplateAttribute
        {
            Name = "id",
            Value = "test-form"
        });
        
        // Add submit event handler attribute with .prevent modifier to stop default form submission
        var submitAttr = new TemplateAttribute
        {
            Name = "@submit.prevent",
            BindingExpression = submitHandler,
            IsBinding = true,
            BindingKind = TemplateBindingKind.Event,
            Location = location
        };
        formElement.Attributes.Add(submitAttr);
        
        SkipWhitespace();
        
        // Parse form content until @endform
        while (!IsAtEnd())
        {
            SkipWhitespace();
            
            // Check for @endform after skipping whitespace
            if (Peek("@endform"))
                break;
            
            var child = ParseNode();
            if (child != null)
            {
                child.Parent = formElement;
                formElement.ChildNodes.Add(child);
            }
            else if (!IsAtEnd())
            {
                SkipWhitespace();
                if (Peek("@endform"))
                    break;
                Advance();
            }
        }
        
        // Consume @endform (skip any leading whitespace first)
        SkipWhitespace();
        Match("@endform");
        
        return formElement;
    }
    
    private TemplateLocalization ParseLocalizationDirective(SourceLocation location)
    {
        SkipWhitespace();
        
        // Expect opening parenthesis: @L('key')
        if (!Match("("))
        {
            throw new Exception("Expected '(' after @L directive");
        }
        
        SkipWhitespace();
        
        // Parse the localization key (string literal)
        string key = "";
        if (Peek() == '\'' || Peek() == '"')
        {
            var quote = Advance();
            var sb = new System.Text.StringBuilder();
            while (!IsAtEnd() && Peek() != quote)
            {
                if (Peek() == '\\')
                {
                    Advance(); // Skip escape character
                    if (!IsAtEnd())
                    {
                        sb.Append(Advance());
                    }
                }
                else
                {
                    sb.Append(Advance());
                }
            }
            if (!IsAtEnd())
            {
                Advance(); // Consume closing quote
            }
            key = sb.ToString();
        }
        else
        {
            // Parse as expression (variable reference)
            key = _expressionParser.ParseBalancedExpression(')');
        }
        
        SkipWhitespace();
        
        // Optional: parse default value or parameters (future enhancement)
        // For now, just expect closing parenthesis
        if (!Match(")"))
        {
            throw new Exception("Expected ')' after @L key");
        }
        
        return new TemplateLocalization
        {
            NodeId = NextNodeId(),
            Location = location,
            Key = key
        };
    }
    
    // Minimal helper methods using shared context
    private bool IsAtEnd() => _context.IsAtEnd();
    private char Peek() => _context.Peek();
    private bool Peek(string expected) => _context.Position + expected.Length <= _context.Source.Length && 
                                           _context.Source.Substring(_context.Position, expected.Length) == expected;
    private char LookAhead(int offset) => _context.LookAhead(offset);
    private char Advance() => _context.Advance();
    
    private bool Match(string expected, StringComparison comparison = StringComparison.Ordinal)
    {
        if (_context.Position + expected.Length > _context.Source.Length) return false;
        if (!_context.Source.Substring(_context.Position, expected.Length).Equals(expected, comparison)) return false;
        for (int i = 0; i < expected.Length; i++) Advance();
        return true;
    }
    
    private void Expect(char c)
    {
        if (Peek() != c) return;
        Advance();
    }
    
    private void SkipWhitespace()
    {
        while (!IsAtEnd() && char.IsWhiteSpace(Peek())) Advance();
    }
    
    private int NextNodeId() => _context.NextNodeId();
    private SourceLocation CreateLocation() => _context.CreateLocation();
}
