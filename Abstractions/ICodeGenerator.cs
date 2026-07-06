using Soft.Compiler.Template;

namespace Soft.Compiler.Abstractions;

/// <summary>
/// Generates TypeScript code from template AST.
/// </summary>
public interface ICodeGenerator
{
    /// <summary>
    /// Generates TypeScript render method from template.
    /// </summary>
    /// <param name="template">Template AST root</param>
    /// <param name="className">Component class name</param>
    /// <returns>Generated TypeScript code</returns>
    string Generate(TemplateRoot template, string className);
}
