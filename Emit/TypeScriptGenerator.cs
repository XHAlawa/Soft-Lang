using Soft.Compiler.Parser;
using Soft.Compiler.Template;
using Soft.Compiler.Diagnostics;

namespace Soft.Compiler.Emit;

/// <summary>
/// Generates TypeScript from SoftFileUnit.
/// NEW ARCHITECTURE: Emits code verbatim, only adds Soft-specific metadata.
/// </summary>
public sealed class TypeScriptGenerator
{
    private readonly Components.ComponentRegistry _componentRegistry;
    private Semantics.PageSymbolTable? _currentSymbolTable;
    
    public TypeScriptGenerator(Components.ComponentRegistry? componentRegistry = null)
    {
        _componentRegistry = componentRegistry ?? new Components.ComponentRegistry();
    }
    
    public string Generate(SoftFileUnit unit)
    {
        var writer = new CodeWriter();
        
        // Import SoftComponent base class
        writer.WriteLine("import { SoftComponent } from './SoftComponent.js';");
        writer.WriteLine();
        
        // Import __router for pages
        if (unit.PageMetadata != null && unit.PageMetadata.Routes.Any())
        {
            writer.WriteLine("import { __router } from './router.js';");
            writer.WriteLine();
        }
        
        // Emit component imports as TypeScript imports
        // Include both explicit imports and auto-registered components
        var allComponents = new HashSet<string>();
        
        // Add explicit imports
        foreach (var import in unit.ComponentImports)
        {
            allComponents.Add(import.Alias ?? Path.GetFileNameWithoutExtension(import.Path));
        }
        
        // Add all registered components (except self)
        var selfName = unit.ClassName ?? Path.GetFileNameWithoutExtension(unit.FilePath);
        foreach (var comp in _componentRegistry.GetAll())
        {
            if (comp.Name != selfName)
            {
                allComponents.Add(comp.Name);
            }
        }
        
        if (allComponents.Any())
        {
            foreach (var compName in allComponents.OrderBy(n => n))
            {
                writer.WriteLine($"import {{ {compName} }} from './{compName}.generated';");
            }
            writer.WriteLine();
        }
        
        // Emit service dependency imports
        if (unit.ServiceDependencies.Any())
        {
            var uniqueTypes = unit.ServiceDependencies.Select(d => d.ServiceType).Distinct();
            foreach (var serviceType in uniqueTypes)
            {
                writer.WriteLine($"import {{ {serviceType} }} from './{serviceType}.generated';");
            }
            writer.WriteLine();
        }
        
        // Emit decorators as comments for reference
        if (unit.Decorators.Any())
        {
            writer.WriteLine("// Soft decorators:");
            foreach (var decorator in unit.Decorators)
            {
                var arg = decorator.Argument != null ? $"(\"{decorator.Argument}\")" : "";
                writer.WriteLine($"// @{decorator.Name}{arg}");
            }
            writer.WriteLine();
        }
        
        // Emit code content with template methods injected into class
        if (!string.IsNullOrEmpty(unit.CodeContent))
        {
            // Check if code already has a class declaration
            var hadClass = System.Text.RegularExpressions.Regex.IsMatch(unit.CodeContent, @"(?:export\s+)?class\s+\w+");
            
            // Ensure code has a class declaration - wrap if missing
            var codeWithClass = EnsureClassExists(unit.CodeContent, unit.ClassName ?? Path.GetFileNameWithoutExtension(unit.FilePath));
            
            // Ensure class has export keyword for proper bundling
            var codeWithExport = EnsureClassIsExported(codeWithClass);
            
            // Process @State, @Computed, @Prop, @Watch, @property, @nav:*, and @custom decorators
            var stateGenerator = new StateCodeGenerator();
            var computedGenerator = new ComputedCodeGenerator();
            var propsGenerator = new PropsCodeGenerator();
            var watchGenerator = new WatchCodeGenerator();
            var propertyGenerator = new PropertyCodeGenerator();
            var customDirectiveGenerator = new CustomDirectiveCodeGenerator();
            var processedCode = stateGenerator.ProcessStateDecorators(codeWithExport);
            processedCode = computedGenerator.ProcessComputedDecorators(processedCode);
            processedCode = propsGenerator.ProcessPropDecorators(processedCode);
            processedCode = watchGenerator.ProcessWatchDecorators(processedCode);
            processedCode = propertyGenerator.ProcessPropertyDecorators(processedCode);
            processedCode = ProcessNavDirectives(processedCode, unit);
            processedCode = customDirectiveGenerator.ProcessCustomDirectives(processedCode);
            
            // Process service dependencies (DI)
            if (unit.ServiceDependencies.Any())
            {
                processedCode = InjectServiceDependencies(processedCode, unit.ServiceDependencies);
            }
            
            // Generate template rendering code if template exists
            var hasTemplate = !string.IsNullOrEmpty(unit.TemplateContent);
            if (hasTemplate)
            {
                var className = unit.ClassName ?? Path.GetFileNameWithoutExtension(unit.FilePath);
                var templateCode = GenerateTemplateCode(unit.TemplateContent, className, unit.FilePath, unit, _currentSymbolTable);
                
                // Inject template methods into class before closing brace
                var code = processedCode;
                
                // If we just wrapped the code (no original class), the class closing brace is the last one
                // If there was an original class, we need to count braces to find the class closing brace
                if (!hadClass)
                {
                    // We wrapped it, so count braces from class declaration to find class closing brace
                    var classMatch = System.Text.RegularExpressions.Regex.Match(code, @"(?:export\s+)?class\s+\w+[^{]*\{");
                    if (classMatch.Success)
                    {
                        var classStart = classMatch.Index + classMatch.Length - 1; // Position of opening brace
                        var braceDepth = 1; // Start at 1 since we're at the class opening brace
                        var classClosingBrace = -1;
                        
                        for (int i = classStart + 1; i < code.Length; i++)
                        {
                            if (code[i] == '{')
                            {
                                braceDepth++;
                            }
                            else if (code[i] == '}')
                            {
                                braceDepth--;
                                if (braceDepth == 0)
                                {
                                    classClosingBrace = i;
                                    break;
                                }
                            }
                        }
                        
                        if (classClosingBrace > 0)
                        {
                            // Prepare the injected code (including template code)
                            // Runtime methods now inherited from SoftComponent base class
                            var injectedCode = "\n    // Router properties (injected at runtime)\n" +
                                              "    $route?: any;\n" +
                                              "    $navigate?: any;\n" +
                                              "\n    // Auto-generated template rendering code\n" +
                                              IndentCode(templateCode, 1);
                            
                            code = code.Substring(0, classClosingBrace) + injectedCode + "\n" + code.Substring(classClosingBrace);
                        }
                    }
                }
                else
                {
                    // Original class exists - count braces to find class closing brace
                    var classMatch = System.Text.RegularExpressions.Regex.Match(code, @"(?:export\s+)?class\s+\w+[^{]*\{");
                    if (classMatch.Success)
                    {
                        var classStart = classMatch.Index + classMatch.Length - 1; // Position of opening brace
                        var braceDepth = 1; // Start at 1 since we're at the class opening brace
                        var classClosingBrace = -1;
                        
                        for (int i = classStart + 1; i < code.Length; i++)
                        {
                            if (code[i] == '{')
                            {
                                braceDepth++;
                            }
                            else if (code[i] == '}')
                            {
                                braceDepth--;
                                if (braceDepth == 0)
                                {
                                    classClosingBrace = i;
                                    break;
                                }
                            }
                        }
                        
                        if (classClosingBrace > 0)
                        {
                            var injectedCode = "\n    // Router properties (injected at runtime)\n" +
                                              "    $route?: any;\n" +
                                              "    $navigate?: any;\n" +
                                              "\n    // Lifecycle state\n" +
                                              "    private __mounted = false;\n" +
                                              "    private __container?: HTMLElement;\n" +
                                              "    private __cacheStore = new Map<string, any>();\n" +
                                              "    private __cleanup: (() => void)[] = [];\n" +
                                              "    private __validationErrors?: Record<string, string | null>;\n" +
                                              "    private __touchedFields?: Record<string, boolean>;\n" +
                                              "    private __renderScheduled = false;\n" +
                                              "\n    // Schedule render with debouncing to prevent multiple queued renders\n" +
                                              "    private __scheduleRender(): void {\n" +
                                              "        if (this.__renderScheduled) return;\n" +
                                              "        this.__renderScheduled = true;\n" +
                                              "        queueMicrotask(() => {\n" +
                                              "            if (this.__mounted && this.__container) {\n" +
                                              "                this.__render(this.__container);\n" +
                                              "            }\n" +
                                              "        });\n" +
                                              "    }\n" +
                                              "\n    // Localization helper\n" +
                                              "    private __localize(key: string, fallback?: string): string {\n" +
                                              "        return (globalThis as any).__softLocalize?.(key, fallback) || fallback || key;\n" +
                                              "    }\n" +
                                              "\n    // Component disposal (compiler-generated)\n" +
                                              "    __dispose(): void {\n" +
                                              "        // Dispose children first\n" +
                                              "        (this as any).__disposeChildren?.();\n" +
                                              "        \n" +
                                              "        // Then own cleanup\n" +
                                              "        (this as any).onDestroy?.();\n" +
                                              "        this.__cleanup.forEach(fn => fn());\n" +
                                              "        this.__cleanup = [];\n" +
                                              "        this.__mounted = false;\n" +
                                              "    }\n" +
                                              "\n    // Auto-generated template rendering code\n" +
                                              IndentCode(templateCode, 1);
                            
                            code = code.Substring(0, classClosingBrace) + injectedCode + "\n" + code.Substring(classClosingBrace);
                        }
                    }
                }
                
                // Process @Cache decorators
                code = ProcessCacheDecorators(code);
                
                writer.WriteLine(code);
                
                // Check if this is a page component
                var hasPageDecorator = unit.Decorators.Any(d => d.Name == "Page");
                var hasRoute = unit.PageRoute != null;
                
                if (hasRoute && unit.PageMetadata != null)
                {
                    // Add route registration for all routes (canonical + aliases)
                    writer.WriteLine();
                    writer.WriteLine("// Route registration - guaranteed execution");
                    writer.WriteLine("declare const window: any;");
                    writer.WriteLine("const registerRoutes = () => {");
                    writer.WriteLine("    if (typeof window !== 'undefined' && window.SoftRouter) {");
                    
                    foreach (var route in unit.PageMetadata.Routes)
                    {
                        var urlPattern = RouteResolver.ConvertToUrlPattern(route);
                        var isCanonical = route == unit.PageMetadata.Routes.First();
                        
                        writer.WriteLine($"        window.SoftRouter.register('{urlPattern}', {className}, {{ canonical: {isCanonical.ToString().ToLower()} }});");
                    }
                    
                    writer.WriteLine("        return true;");
                    writer.WriteLine("    }");
                    writer.WriteLine("    return false;");
                    writer.WriteLine("};");
                    writer.WriteLine();
                    writer.WriteLine("// Try immediate registration, fallback to retry");
                    writer.WriteLine("if (!registerRoutes()) {");
                    writer.WriteLine("    // Router not ready, wait for it");
                    writer.WriteLine("    const checkRouter = () => {");
                    writer.WriteLine("        if (registerRoutes()) {");
                    writer.WriteLine("            return;");
                    writer.WriteLine("        }");
                    writer.WriteLine("        setTimeout(checkRouter, 1);");
                    writer.WriteLine("    };");
                    writer.WriteLine("    checkRouter();");
                    writer.WriteLine("}");
                    writer.WriteLine();
                    writer.WriteLine("// Auto-start router on first page load");
                    writer.WriteLine("if (typeof document !== 'undefined') {");
                    writer.WriteLine("    document.addEventListener('DOMContentLoaded', () => {");
                    writer.WriteLine("        if (window.SoftRouter && !window.SoftRouter.currentRoute) {");
                    writer.WriteLine("            window.SoftRouter.start('#app');");
                    writer.WriteLine("        }");
                    writer.WriteLine("    });");
                    writer.WriteLine("}");
                }
                else if (hasPageDecorator && !unit.ServiceDependencies.Any())
                {
                    // @Page without route and no DI - instantiate directly
                    writer.WriteLine();
                    writer.WriteLine("// Auto-mount component");
                    writer.WriteLine("if (typeof document !== 'undefined') {");
                    writer.WriteLine("    document.addEventListener('DOMContentLoaded', () => {");
                    writer.WriteLine($"        const app = new {className}();");
                    writer.WriteLine("        const container = document.querySelector('#app') as HTMLElement;");
                    writer.WriteLine("        if (container) {");
                    writer.WriteLine("            app.__render(container);");
                    writer.WriteLine("        }");
                    writer.WriteLine("    });");
                    writer.WriteLine("}");
                }
                
            }
            else
            {
                // No template, but still emit the processed code (components, services, etc.)
                writer.WriteLine(processedCode);
            }
        }
        else if (!string.IsNullOrEmpty(unit.TemplateContent))
        {
            // Template exists but no @Code block - generate minimal class
            var className = unit.ClassName ?? Path.GetFileNameWithoutExtension(unit.FilePath);
            writer.WriteLine($"export class {className} extends SoftComponent {{");
            
            var templateCode = GenerateTemplateCode(unit.TemplateContent, className, unit.FilePath, unit, _currentSymbolTable);
            
            // Runtime methods now inherited from SoftComponent base class
            var injectedCode = "\n    // Router properties (injected at runtime)\n" +
                              "    $route?: any;\n" +
                              "    $navigate?: any;\n" +
                              "\n    // Auto-generated template rendering code\n" +
                              IndentCode(templateCode, 1);
            
            writer.WriteLine(injectedCode);
            writer.WriteLine("}");
        }
        
        // Emit styles
        if (!string.IsNullOrEmpty(unit.StyleContent))
        {
            var scopedStyleGen = new ScopedStyleGenerator();
            // Use filename as fallback if no class name (e.g., components with just methods)
            var className = unit.ClassName ?? Path.GetFileNameWithoutExtension(unit.FilePath);
            var styles = scopedStyleGen.GenerateScopedStyles(unit.StyleContent, className, unit.ScopedStyles);
            
            // Use unique variable name per file to avoid TS2451 redeclaration errors during bundling
            var styleVarName = $"styles_{className}";
            
            writer.WriteLine();
            writer.WriteLine("// Styles");
            writer.WriteLine($"const {styleVarName} = `");
            writer.WriteLine(styles);
            writer.WriteLine("`;");
            writer.WriteLine();
            writer.WriteLine("// Inject styles");
            writer.WriteLine("if (typeof document !== 'undefined') {");
            writer.WriteLine("    const styleEl = document.createElement('style');");
            writer.WriteLine($"    styleEl.textContent = {styleVarName};");
            writer.WriteLine("    document.head.appendChild(styleEl);");
            writer.WriteLine("}");
        }
        
        return writer.GetCode();
    }
    
    private string IndentCode(string code, int levels)
    {
        var indent = new string(' ', levels * 4);
        var lines = code.Split('\n');
        return string.Join("\n", lines.Select(line => string.IsNullOrWhiteSpace(line) ? line : indent + line));
    }
    
    private string ProcessCacheDecorators(string code)
    {
        // Simple implementation: replace @Cache with comment and add basic caching
        // For now, just comment out @Cache decorators
        return code.Replace("@Cache", "// @Cache - TODO: implement caching");
    }
    
    private string GenerateTemplateCode(string templateContent, string className, string filePath, SoftFileUnit unit, Semantics.PageSymbolTable? symbolTable)
    {
        try
        {
            var diagnosticReporter = new DiagnosticReporter();
            var parser = new TemplateParser(diagnosticReporter);
            var templateRoot = parser.Parse(templateContent, filePath);
            
            // Use shared component registry
            var generator = new TemplateCodeGenerator(_componentRegistry);
            
            // Register imported components (in addition to auto-registered ones)
            if (unit.ComponentImports.Any())
            {
                generator.RegisterComponents(unit.ComponentImports);
            }
            
            // Pass symbol table for navigation resolution
            if (symbolTable != null)
            {
                generator.SetSymbolTable(symbolTable);
            }
            
            return generator.Generate(templateRoot, className);
        }
        catch
        {
            // If template parsing fails, return empty
            return "// Template parsing failed";
        }
    }
    
    private string EnsureClassExists(string code, string className)
    {
        if (string.IsNullOrEmpty(code)) return code;
        
        // Check if code already contains a class declaration
        if (System.Text.RegularExpressions.Regex.IsMatch(code, @"(?:export\s+)?class\s+\w+"))
        {
            return code;
        }
        
        // Wrap code in a class declaration with proper indentation
        var indentedCode = IndentCode(code, 1);
        return $"export class {className} extends SoftComponent {{\n{indentedCode}\n}}";
    }
    
    private string EnsureClassIsExported(string code)
    {
        if (string.IsNullOrEmpty(code)) return code;
        
        // Check if class is already exported
        if (System.Text.RegularExpressions.Regex.IsMatch(code, @"export\s+class\s+\w+"))
        {
            return code;
        }
        
        // Add export keyword before class declaration
        return System.Text.RegularExpressions.Regex.Replace(
            code,
            @"^(\s*)class\s+(\w+)",
            "$1export class $2 extends SoftComponent",
            System.Text.RegularExpressions.RegexOptions.Multiline
        );
    }
    
    private string ProcessNavDirectives(string code, SoftFileUnit unit)
    {
        // Early return if no @nav decorators
        if (!code.Contains("@nav:route") && !code.Contains("@nav:query"))
            return code;
        
        // Only process if this is a page with route metadata
        if (unit.PageMetadata == null || !unit.PageMetadata.Routes.Any())
            return code;
        
        var result = code;
        
        // Process @nav:route - inject constructor initialization
        if (System.Text.RegularExpressions.Regex.IsMatch(code, @"@nav:route"))
        {
            // Remove @nav:route decorator
            result = System.Text.RegularExpressions.Regex.Replace(result, @"\s*@nav:route\s*\n", "\n");
            
            // Inject constructor initialization for params
            result = InjectConstructorInitialization(result, "params", "__router.currentParams");
        }
        
        // Process @nav:query
        if (System.Text.RegularExpressions.Regex.IsMatch(code, @"@nav:query"))
        {
            result = System.Text.RegularExpressions.Regex.Replace(result, @"\s*@nav:query\s*\n", "\n");
            result = InjectConstructorInitialization(result, "query", "__router.currentQuery");
        }
        
        // Process @nav:state
        if (System.Text.RegularExpressions.Regex.IsMatch(code, @"@nav:state"))
        {
            result = System.Text.RegularExpressions.Regex.Replace(result, @"\s*@nav:state\s*\n", "\n");
            result = InjectConstructorInitialization(result, "state", "__router.currentState");
        }
        
        return result;
    }
    
    private string InjectConstructorInitialization(string code, string propertyName, string runtimeValue)
    {
        // Initialize to empty object/default - router will populate on navigation
        var defaultValue = "{} as any";
        
        // Find constructor or create one
        var constructorMatch = System.Text.RegularExpressions.Regex.Match(code, @"constructor\s*\([^)]*\)\s*\{");
        
        if (constructorMatch.Success)
        {
            // Inject at beginning of constructor
            var insertPos = constructorMatch.Index + constructorMatch.Length;
            var injection = $"\n        this.{propertyName} = {defaultValue};";
            return code.Insert(insertPos, injection);
        }
        else
        {
            // Create constructor before first method
            var classMatch = System.Text.RegularExpressions.Regex.Match(code, @"class\s+\w+[^{]*\{");
            if (classMatch.Success)
            {
                var insertPos = classMatch.Index + classMatch.Length;
                var injection = $"\n    constructor() {{\n        this.{propertyName} = {defaultValue};\n    }}\n";
                return code.Insert(insertPos, injection);
            }
        }
        
        return code;
    }
    
    public string GenerateWithSymbolTable(SoftFileUnit unit, Semantics.PageSymbolTable symbolTable, out SourceMap sourceMap)
    {
        // Store symbol table for template generation
        _currentSymbolTable = symbolTable;
        
        sourceMap = new SourceMap();
        
        // Track line mappings
        int generatedLine = 1;
        int originalLine = unit.CodeStartLine;
        
        // Decorators add lines
        if (unit.Decorators.Any())
        {
            generatedLine += unit.Decorators.Count + 2; // +2 for header and blank line
        }
        
        // Map code content lines
        if (!string.IsNullOrEmpty(unit.CodeContent))
        {
            var codeLines = unit.CodeContent.Split('\n').Length;
            for (int i = 0; i < codeLines; i++)
            {
                sourceMap.AddMapping(generatedLine + i, unit.FilePath, originalLine + i);
            }
        }
        
        return Generate(unit);
    }
    
    public string GenerateWithSourceMap(SoftFileUnit unit, out SourceMap sourceMap)
    {
        return GenerateWithSymbolTable(unit, new Semantics.PageSymbolTable(), out sourceMap);
    }
    
    private string InjectServiceDependencies(string code, List<ServiceDependency> dependencies)
    {
        // Find constructor and inject service resolution
        var constructorPattern = @"constructor\s*\((.*?)\)\s*\{";
        var match = System.Text.RegularExpressions.Regex.Match(code, constructorPattern, System.Text.RegularExpressions.RegexOptions.Singleline);
        
        if (!match.Success)
            return code;
        
        var constructorStart = match.Index + match.Length;
        var injectionCode = new System.Text.StringBuilder();
        
        // Generate service resolution code
        injectionCode.AppendLine();
        injectionCode.AppendLine("        // Dependency injection (compiler-generated)");
        
        foreach (var dep in dependencies)
        {
            if (dep.IsOptional)
            {
                injectionCode.AppendLine($"        this.{dep.ParameterName} = (window as any).__softRuntime?.resolveService('{dep.ServiceType}') ?? null;");
            }
            else
            {
                injectionCode.AppendLine($"        this.{dep.ParameterName} = (window as any).__softRuntime.resolveService('{dep.ServiceType}');");
            }
        }
        
        // Insert after constructor opening brace
        return code.Insert(constructorStart, injectionCode.ToString());
    }
}

/// <summary>
/// Maps generated TypeScript lines back to original .s file locations.
/// Used for translating tsc diagnostics.
/// </summary>
public sealed class SourceMap
{
    private readonly List<LineMapping> _mappings = new();
    
    public void AddMapping(int generatedLine, string originalFile, int originalLine)
    {
        _mappings.Add(new LineMapping(generatedLine, originalFile, originalLine));
    }
    
    public (string File, int Line)? MapBack(int generatedLine)
    {
        var mapping = _mappings.FirstOrDefault(m => m.GeneratedLine == generatedLine);
        return mapping != null ? (mapping.OriginalFile, mapping.OriginalLine) : null;
    }
    
    public IReadOnlyList<LineMapping> Mappings => _mappings;
}

public sealed record LineMapping(int GeneratedLine, string OriginalFile, int OriginalLine);
