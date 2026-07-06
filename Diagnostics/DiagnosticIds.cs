namespace Soft.Compiler.Diagnostics;

public static class DiagnosticIds
{
    public const string ConfigurationNotFound = "SOFT001";
    public const string InvalidConfiguration = "SOFT002";
    public const string ProjectLoadFailed = "SOFT003";
    public const string FileSystemError = "SOFT004";
    public const string InvalidProjectPath = "SOFT005";
    public const string OutputDirectoryError = "SOFT006";
    public const string FileWatcherError = "SOFT007";
    public const string BuildPipelineError = "SOFT008";
    
    // Event diagnostics
    public const string UnknownEvent = "SOFT009";
    public const string InvalidEventModifier = "SOFT010";
    public const string DuplicateEventModifier = "SOFT011";
    public const string IncompatibleModifierCombination = "SOFT012";
    public const string KeyModifierOnNonKeyboardEvent = "SOFT013";
}
