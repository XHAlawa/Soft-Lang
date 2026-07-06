using Soft.Compiler.Template;
using Soft.Compiler.Diagnostics;

namespace Soft.Compiler.Abstractions;

/// <summary>
/// Parses template content into an abstract syntax tree.
/// </summary>
public interface ITemplateParser
{
    /// <summary>
    /// Parses template source into a TemplateRoot AST.
    /// </summary>
    /// <param name="source">Template source code</param>
    /// <param name="filePath">Source file path for diagnostics</param>
    /// <returns>Parsed template AST</returns>
    TemplateRoot Parse(string source, string filePath);
}
