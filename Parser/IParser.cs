namespace Soft.Compiler.Parser;

/// <summary>
/// Parser interface for Soft files.
/// New architecture: parsers work directly with source text, not token streams.
/// </summary>
public interface IParser
{
    SoftFileUnit Parse(string source, string filePath);
}
