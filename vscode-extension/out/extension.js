"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function activate(context) {
    console.log('Soft Language Extension activated');
    // Note: .s files are associated with 'soft' language via package.json
    // Do NOT override with file associations - it breaks all providers
    // Register build command
    const buildCommand = vscode.commands.registerCommand('soft.build', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }
        const terminal = vscode.window.createTerminal('Soft Build');
        terminal.show();
        terminal.sendText('soft build');
    });
    // Register dev server command
    const devCommand = vscode.commands.registerCommand('soft.dev', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }
        const terminal = vscode.window.createTerminal('Soft Dev Server');
        terminal.show();
        terminal.sendText('soft dev');
    });
    // Register unified smart completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider('soft', {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substring(0, position.character);
            const line = document.lineAt(position).text;
            // Detect context: are we in template or at top level?
            const textBefore = document.getText(new vscode.Range(0, 0, position.line, position.character));
            const templateIndex = textBefore.lastIndexOf('@Template');
            const codeIndex = textBefore.lastIndexOf('@Code');
            const inTemplate = templateIndex > codeIndex && templateIndex !== -1;
            const inCode = codeIndex > templateIndex && codeIndex !== -1;
            // Check what user is typing after @
            const atMatch = linePrefix.match(/@([a-zA-Z:]*)$/);
            if (!atMatch) {
                return undefined;
            }
            const afterAt = atMatch[1] || ''; // Handle empty match when just @ is typed
            const completions = [];
            // In template: offer directives and attributes
            if (inTemplate) {
                // Check if we're inside an HTML tag
                const inTag = /<[^>]*$/.test(linePrefix);
                if (inTag) {
                    // Inside tag: offer attributes
                    completions.push(createAttribute('bind:value', 'Two-way data binding'), createAttribute('bind:checked', 'Checkbox binding'), createAttribute('click', 'Click event handler'), createAttribute('submit', 'Form submit handler'), createAttribute('input', 'Input event handler'), createAttribute('validate:required', 'Required field validation'), createAttribute('validate:email', 'Email validation'), createAttribute('validate:minLength', 'Minimum length validation', '="3"'), createAttribute('validate:maxLength', 'Maximum length validation', '="100"'), createAttribute('class:active', 'Conditional class'), createAttribute('style:color', 'Dynamic style'), createAttribute('ref', 'Element reference'));
                }
                // Always show directives in template
                completions.push(createDirective('if', 'Conditional rendering', '(condition) {'), createDirective('foreach', 'Loop rendering', '(item in items) {'), createDirective('switch', 'Switch statement', '(value) {'), createDirective('case', 'Switch case', '("value") {'), createDirective('default', 'Switch default case', ' {'), createDirective('Navigate', 'Navigate to route', "('/path')"));
            }
            // Always show decorators (at top level or in code)
            if (!inTemplate) {
                completions.push(createDecorator('Page', 'Mark class as a page component'), createDecorator('Service', 'Mark class as an injectable service'), createDecorator('Route', 'Define route for page', '("/path")'), createDecorator('Template', 'Define component template'), createDecorator('Code', 'Define component code'), createDecorator('Style', 'Define component styles'), createDecorator('importComponent', 'Import another component', ' Name from "./path.s"'), createDecorator('State', 'Reactive state property'), createDecorator('Computed', 'Computed property'), createDecorator('Watch', 'Watch property changes', "('property')"), createDecorator('Prop', 'Component property'));
            }
            return completions;
        }
    }, '@', ':');
    // Register TypeScript-like completion provider for @Code blocks
    const codeCompletionProvider = vscode.languages.registerCompletionItemProvider('soft', {
        provideCompletionItems(document, position) {
            // Check if we're in @Code block
            const textBefore = document.getText(new vscode.Range(0, 0, position.line, position.character));
            const templateIndex = textBefore.lastIndexOf('@Template');
            const codeIndex = textBefore.lastIndexOf('@Code');
            const inCode = codeIndex > templateIndex && codeIndex !== -1;
            if (!inCode) {
                return undefined;
            }
            const linePrefix = document.lineAt(position).text.substring(0, position.character);
            const completions = [];
            const fullText = document.getText();
            // Detect 'this.' - provide class members
            if (linePrefix.endsWith('this.')) {
                const members = extractClassMembers(document, fullText);
                return members;
            }
            // Check for nested property access (e.g., "this.HelloContent.")
            const thisNestedMatch = linePrefix.match(/this\.([a-zA-Z_$][a-zA-Z0-9_$]*)\.\s*$/);
            if (thisNestedMatch) {
                const objectName = thisNestedMatch[1];
                const nestedProps = extractNestedProperties(fullText, objectName);
                if (nestedProps.length > 0) {
                    return nestedProps;
                }
            }
            // Console API - triggered by 'console.'
            if (linePrefix.endsWith('console.')) {
                return [
                    createTSMethod('log', 'Log to console', '($0)'),
                    createTSMethod('error', 'Log error', '($0)'),
                    createTSMethod('warn', 'Log warning', '($0)'),
                    createTSMethod('info', 'Log info', '($0)'),
                    createTSMethod('debug', 'Log debug', '($0)'),
                    createTSMethod('table', 'Display table', '($0)'),
                    createTSMethod('clear', 'Clear console', '()')
                ];
            }
            // Don't show completions if typing after a dot (let specific handlers above deal with it)
            if (/\.\s*$/.test(linePrefix) && !linePrefix.match(/\b(this|console)\.\s*$/)) {
                return undefined;
            }
            // TypeScript keywords - always available
            completions.push(createTSKeyword('export', 'Export declaration'), createTSKeyword('class', 'Class declaration'), createTSKeyword('interface', 'Interface declaration'), createTSKeyword('type', 'Type alias'), createTSKeyword('function', 'Function declaration'), createTSKeyword('const', 'Constant declaration'), createTSKeyword('let', 'Variable declaration'), createTSKeyword('var', 'Variable declaration'), createTSKeyword('if', 'If statement'), createTSKeyword('else', 'Else statement'), createTSKeyword('for', 'For loop'), createTSKeyword('while', 'While loop'), createTSKeyword('return', 'Return statement'), createTSKeyword('async', 'Async function'), createTSKeyword('await', 'Await expression'), createTSKeyword('try', 'Try block'), createTSKeyword('catch', 'Catch block'), createTSKeyword('throw', 'Throw statement'), createTSKeyword('new', 'New instance'), createTSKeyword('this', 'This reference'), createTSKeyword('super', 'Super reference'), createTSKeyword('public', 'Public modifier'), createTSKeyword('private', 'Private modifier'), createTSKeyword('protected', 'Protected modifier'), createTSKeyword('readonly', 'Readonly modifier'), createTSKeyword('static', 'Static modifier'), createTSKeyword('true', 'Boolean true'), createTSKeyword('false', 'Boolean false'), createTSKeyword('null', 'Null value'), createTSKeyword('undefined', 'Undefined value'));
            // Common TypeScript types
            completions.push(createTSType('string', 'String type'), createTSType('number', 'Number type'), createTSType('boolean', 'Boolean type'), createTSType('any', 'Any type'), createTSType('void', 'Void type'), createTSType('never', 'Never type'), createTSType('unknown', 'Unknown type'), createTSType('Array', 'Array type'), createTSType('Promise', 'Promise type'), createTSType('Date', 'Date type'), createTSType('RegExp', 'RegExp type'));
            return completions;
        }
    }, '.', ' ', '\n' // Trigger on dot, space, and newline
    );
    // Register hover provider for decorators
    const hoverProvider = vscode.languages.registerHoverProvider('soft', {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position, /@[a-zA-Z]+/);
            if (!range) {
                return;
            }
            const word = document.getText(range);
            const docs = getDecoratorDocumentation(word);
            if (docs) {
                return new vscode.Hover(docs);
            }
        }
    });
    // Register document change listener for auto-closing tags
    const changeListener = vscode.workspace.onDidChangeTextDocument(async (event) => {
        if (event.document.languageId !== 'soft')
            return;
        if (event.contentChanges.length === 0)
            return;
        const change = event.contentChanges[0];
        if (change.text !== '>')
            return;
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== event.document)
            return;
        const position = editor.selection.active;
        const textBefore = event.document.getText(new vscode.Range(0, 0, position.line, position.character));
        const templateIndex = textBefore.lastIndexOf('@Template');
        const codeIndex = textBefore.lastIndexOf('@Code');
        const inTemplate = templateIndex > codeIndex && templateIndex !== -1;
        if (!inTemplate)
            return;
        const line = event.document.lineAt(position.line).text;
        const beforeCursor = line.substring(0, position.character);
        // Match opening tag: <tagname>
        const tagMatch = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9-]*)[^>]*>$/);
        if (!tagMatch)
            return;
        const tagName = tagMatch[1];
        // Don't auto-close self-closing tags
        const selfClosing = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
        if (selfClosing.includes(tagName.toLowerCase()))
            return;
        // Check if already has closing tag or is self-closing
        if (beforeCursor.endsWith('/>') || beforeCursor.match(/\/\s*>$/))
            return;
        // Check if closing tag already exists
        const afterCursor = line.substring(position.character);
        if (afterCursor.startsWith(`</${tagName}>`))
            return;
        // Insert closing tag
        await editor.edit(editBuilder => {
            editBuilder.insert(position, `</${tagName}>`);
        });
    });
    // Register linked editing provider for HTML tags
    const linkedEditingProvider = vscode.languages.registerLinkedEditingRangeProvider('soft', {
        provideLinkedEditingRanges(document, position) {
            const textBefore = document.getText(new vscode.Range(0, 0, position.line, position.character));
            const templateIndex = textBefore.lastIndexOf('@Template');
            const codeIndex = textBefore.lastIndexOf('@Code');
            const inTemplate = templateIndex > codeIndex && templateIndex !== -1;
            if (!inTemplate) {
                return undefined;
            }
            const line = document.lineAt(position.line).text;
            const char = position.character;
            const fullText = document.getText();
            // Check if we're in an HTML tag name
            const beforeCursor = line.substring(0, char);
            const afterCursor = line.substring(char);
            // Match if cursor is in opening tag name: <tagname
            const openMatch = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9-]*)$/);
            if (openMatch) {
                const tagName = openMatch[1];
                const tagStart = char - tagName.length;
                // Find corresponding closing tag
                const fullText = document.getText();
                const afterPos = fullText.substring(document.offsetAt(position));
                const closingMatch = afterPos.match(new RegExp(`</${tagName}>`));
                if (closingMatch) {
                    const closingOffset = document.offsetAt(position) + closingMatch.index + 2;
                    const closingPos = document.positionAt(closingOffset);
                    return {
                        ranges: [
                            new vscode.Range(position.line, tagStart, position.line, char),
                            new vscode.Range(closingPos.line, closingPos.character, closingPos.line, closingPos.character + tagName.length)
                        ],
                        wordPattern: /[a-zA-Z][a-zA-Z0-9-]*/
                    };
                }
            }
            // Match if cursor is in closing tag name: </tagname
            const closeMatch = beforeCursor.match(/<\/([a-zA-Z][a-zA-Z0-9-]*)$/);
            if (closeMatch) {
                const tagName = closeMatch[1];
                const tagStart = char - tagName.length;
                // Find corresponding opening tag (search backwards)
                const beforePos = fullText.substring(0, document.offsetAt(position) - tagName.length - 2);
                const openingMatch = beforePos.match(new RegExp(`<${tagName}[^>]*>(?!.*<${tagName}[^>]*>)`, 's'));
                if (openingMatch) {
                    const openingOffset = openingMatch.index + 1;
                    const openingPos = document.positionAt(openingOffset);
                    return {
                        ranges: [
                            new vscode.Range(openingPos.line, openingPos.character, openingPos.line, openingPos.character + tagName.length),
                            new vscode.Range(position.line, tagStart, position.line, char)
                        ],
                        wordPattern: /[a-zA-Z][a-zA-Z0-9-]*/
                    };
                }
            }
            return undefined;
        }
    });
    // Register completion provider for interpolation expressions
    const interpolationCompletionProvider = vscode.languages.registerCompletionItemProvider('soft', {
        provideCompletionItems(document, position) {
            const textBefore = document.getText(new vscode.Range(0, 0, position.line, position.character));
            const templateIndex = textBefore.lastIndexOf('@Template');
            const codeIndex = textBefore.lastIndexOf('@Code');
            const inTemplate = templateIndex > codeIndex && templateIndex !== -1;
            if (!inTemplate) {
                return undefined;
            }
            const linePrefix = document.lineAt(position).text.substring(0, position.character);
            // Check if we're inside {expression} or @(expression)
            const curlyMatch = linePrefix.match(/\{([^}]*)$/);
            const atParenMatch = linePrefix.match(/@\(([^)]*)$/);
            const interpolationMatch = curlyMatch || atParenMatch;
            if (!interpolationMatch) {
                return undefined;
            }
            const expression = interpolationMatch[1].trim();
            const fullText = document.getText();
            // Check for 'this.' access first
            if (expression.endsWith('this.')) {
                const members = extractClassMembers(document, fullText);
                return members;
            }
            // Check for nested property access (e.g., "HelloContent.")
            // Must end with a dot and have a complete identifier before it
            const nestedMatch = expression.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\.\s*$/);
            if (nestedMatch) {
                const objectName = nestedMatch[1];
                // Extract nested properties from the object
                const nestedProps = extractNestedProperties(fullText, objectName);
                if (nestedProps.length > 0) {
                    return nestedProps;
                }
            }
            // Default: show all class members (only if not typing after a dot)
            if (!expression.includes('.') || expression.trim() === '') {
                const members = extractClassMembers(document, fullText);
                // Add 'this' keyword suggestion
                const thisItem = new vscode.CompletionItem('this', vscode.CompletionItemKind.Keyword);
                thisItem.detail = 'Component reference';
                thisItem.insertText = 'this.';
                return [thisItem, ...members];
            }
            return undefined;
        }
    }, '{', '.', '@', '(');
    // Register CSS completion provider for @Style blocks
    const cssCompletionProvider = vscode.languages.registerCompletionItemProvider('soft', {
        provideCompletionItems(document, position) {
            const textBefore = document.getText(new vscode.Range(0, 0, position.line, position.character));
            const styleIndex = textBefore.lastIndexOf('@Style');
            const codeIndex = textBefore.lastIndexOf('@Code');
            const templateIndex = textBefore.lastIndexOf('@Template');
            const inStyle = styleIndex > Math.max(codeIndex, templateIndex) && styleIndex !== -1;
            if (!inStyle) {
                return undefined;
            }
            const linePrefix = document.lineAt(position).text.substring(0, position.character);
            const completions = [];
            // Common CSS properties
            const cssProps = [
                'display', 'position', 'top', 'right', 'bottom', 'left',
                'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height',
                'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
                'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
                'background', 'background-color', 'background-image', 'background-size', 'background-position',
                'color', 'font-size', 'font-family', 'font-weight', 'line-height',
                'text-align', 'text-decoration', 'text-transform',
                'border', 'border-radius', 'border-width', 'border-color', 'border-style',
                'box-shadow', 'opacity', 'z-index', 'overflow', 'cursor',
                'flex', 'flex-direction', 'justify-content', 'align-items', 'gap',
                'grid', 'grid-template-columns', 'grid-template-rows', 'grid-gap',
                'transition', 'transform', 'animation'
            ];
            for (const prop of cssProps) {
                const item = new vscode.CompletionItem(prop, vscode.CompletionItemKind.Property);
                item.insertText = new vscode.SnippetString(`${prop}: $0;`);
                completions.push(item);
            }
            return completions;
        }
    });
    context.subscriptions.push(buildCommand, devCommand, completionProvider, codeCompletionProvider, hoverProvider, changeListener, linkedEditingProvider, interpolationCompletionProvider, cssCompletionProvider);
}
function createDecorator(name, description, suffix = '') {
    const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
    item.detail = description;
    item.insertText = name + suffix;
    item.documentation = new vscode.MarkdownString(`**@${name}**\n\n${description}`);
    return item;
}
function createTSKeyword(name, description) {
    const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
    item.detail = description;
    item.insertText = name;
    return item;
}
function createTSMethod(name, description, suffix = '') {
    const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Method);
    item.detail = description;
    item.insertText = new vscode.SnippetString(name + suffix);
    return item;
}
function createTSType(name, description) {
    const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class);
    item.detail = description;
    item.insertText = name;
    return item;
}
function extractClassMembers(document, textBefore) {
    const completions = [];
    // Extract @Code block
    const codeMatch = textBefore.match(/@Code\s+([\s\S]*?)$/);
    if (!codeMatch) {
        return completions;
    }
    const codeBlock = codeMatch[1];
    // Collect object names that have nested properties (to exclude their children)
    const objectsWithNested = new Set();
    const objectRegex = /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\{/g;
    let objMatch;
    while ((objMatch = objectRegex.exec(codeBlock)) !== null) {
        objectsWithNested.add(objMatch[1]);
    }
    // Find class properties (name = value, name: type, etc.)
    // But exclude properties that are inside object literals
    const propertyRegex = /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[:=]/gm;
    let match;
    while ((match = propertyRegex.exec(codeBlock)) !== null) {
        const propName = match[1];
        const matchIndex = match.index;
        // Check if this property is inside an object literal by looking at the line
        const lineStart = codeBlock.lastIndexOf('\n', matchIndex) + 1;
        const lineContent = codeBlock.substring(lineStart, matchIndex);
        // If the line has significant indentation (more than class-level), it's likely nested
        // Class-level properties typically have 4 spaces, nested have 8+
        const indentation = lineContent.match(/^\s*/)?.[0].length || 0;
        const isNested = indentation > 6; // More than typical class property indentation
        // Skip if nested, or if it's a keyword/modifier
        if (isNested) {
            continue;
        }
        if (!['export', 'class', 'function', 'const', 'let', 'var', 'public', 'private', 'protected', 'static', 'readonly'].includes(propName)) {
            const item = new vscode.CompletionItem(propName, vscode.CompletionItemKind.Property);
            item.detail = 'Component property';
            completions.push(item);
        }
    }
    // Find methods (methodName() { or methodName(): type {)
    const methodRegex = /^\s*(?:async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/gm;
    while ((match = methodRegex.exec(codeBlock)) !== null) {
        const methodName = match[1];
        // Skip constructor and keywords
        if (methodName !== 'constructor' && !['export', 'class', 'function'].includes(methodName)) {
            const item = new vscode.CompletionItem(methodName, vscode.CompletionItemKind.Method);
            item.detail = 'Component method';
            item.insertText = new vscode.SnippetString(methodName + '($0)');
            completions.push(item);
        }
    }
    // Add lifecycle hooks if not already defined
    const lifecycleHooks = ['onInit', 'onMounted', 'onUpdated', 'onDestroy'];
    for (const hook of lifecycleHooks) {
        if (!completions.some(c => c.label === hook)) {
            const item = new vscode.CompletionItem(hook, vscode.CompletionItemKind.Method);
            item.detail = 'Lifecycle hook';
            item.insertText = new vscode.SnippetString(hook + '($0)');
            completions.push(item);
        }
    }
    return completions;
}
function extractNestedProperties(fullText, objectName) {
    const completions = [];
    // Extract @Code block
    const codeMatch = fullText.match(/@Code\s+([\s\S]*?)(?=@Template|@Style|$)/);
    if (!codeMatch) {
        return completions;
    }
    const codeBlock = codeMatch[1];
    // Find object literal: objectName = { ... }
    const objectRegex = new RegExp(`${objectName}\\s*=\\s*\\{([^}]+)\\}`, 's');
    const objectMatch = codeBlock.match(objectRegex);
    if (!objectMatch) {
        return completions;
    }
    const objectContent = objectMatch[1];
    // Extract properties from object literal
    // Match: propName: value or propName = value
    const propRegex = /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[:=]/g;
    let match;
    while ((match = propRegex.exec(objectContent)) !== null) {
        const propName = match[1];
        const item = new vscode.CompletionItem(propName, vscode.CompletionItemKind.Property);
        item.detail = `Property of ${objectName}`;
        completions.push(item);
    }
    return completions;
}
function createDirective(name, description, suffix = '') {
    const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
    item.detail = description;
    item.insertText = name + suffix;
    item.documentation = new vscode.MarkdownString(`**@${name}**\n\n${description}`);
    return item;
}
function createAttribute(name, description, suffix = '') {
    const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Property);
    item.detail = description;
    item.insertText = name + suffix;
    item.documentation = new vscode.MarkdownString(`**@${name}**\n\n${description}`);
    return item;
}
function getDecoratorDocumentation(decorator) {
    const docs = {
        '@Page': '**@Page** - Marks a class as a page component\n\nPages are routable components that can be navigated to.',
        '@Service': '**@Service** - Marks a class as an injectable service\n\nServices can be injected into components via constructor parameters.',
        '@Route': '**@Route** - Defines the route path for a page\n\nExample: `@Route("/users/:id")`',
        '@Template': '**@Template** - Defines the HTML template for the component',
        '@Code': '**@Code** - Contains the TypeScript code for the component',
        '@Style': '**@Style** - Contains the CSS styles for the component',
        '@State': '**@State** - Marks a property as reactive state\n\nChanges trigger re-renders.',
        '@Computed': '**@Computed** - Marks a getter as a computed property\n\nAutomatically recalculates when dependencies change.',
        '@Watch': '**@Watch** - Watches a property for changes\n\nExample: `@Watch("property")`',
        '@Prop': '**@Prop** - Marks a property as a component prop\n\nReceived from parent components.',
    };
    return docs[decorator] ? new vscode.MarkdownString(docs[decorator]) : undefined;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map