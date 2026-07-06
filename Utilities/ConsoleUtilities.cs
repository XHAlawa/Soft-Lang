using Soft.Compiler.Models;

namespace Soft.Compiler.Utilities;

public static class ConsoleUtilities
{
    public static void WriteDiagnostic(Diagnostic diagnostic)
    {
        var originalColor = Console.ForegroundColor;

        try
        {
            Console.ForegroundColor = diagnostic.Severity switch
            {
                DiagnosticSeverity.Error => ConsoleColor.Red,
                DiagnosticSeverity.Warning => ConsoleColor.Yellow,
                DiagnosticSeverity.Info => ConsoleColor.Cyan,
                _ => ConsoleColor.Gray
            };

            Console.WriteLine(diagnostic.ToString());
        }
        finally
        {
            Console.ForegroundColor = originalColor;
        }
    }

    public static void WriteDiagnostics(IEnumerable<Diagnostic> diagnostics)
    {
        foreach (var diagnostic in diagnostics)
        {
            WriteDiagnostic(diagnostic);
        }
    }

    public static void WriteSuccess(string message)
    {
        var originalColor = Console.ForegroundColor;
        try
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(message);
        }
        finally
        {
            Console.ForegroundColor = originalColor;
        }
    }

    public static void WriteError(string message)
    {
        var originalColor = Console.ForegroundColor;
        try
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(message);
        }
        finally
        {
            Console.ForegroundColor = originalColor;
        }
    }

    public static void WriteInfo(string message)
    {
        var originalColor = Console.ForegroundColor;
        try
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine(message);
        }
        finally
        {
            Console.ForegroundColor = originalColor;
        }
    }

    public static void WriteWarning(string message)
    {
        var originalColor = Console.ForegroundColor;
        try
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(message);
        }
        finally
        {
            Console.ForegroundColor = originalColor;
        }
    }
}
