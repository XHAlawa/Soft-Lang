namespace Soft.Compiler.Build;

public sealed class HtmlGenerator
{
    public string Generate(HtmlGeneratorOptions options)
    {
        var styleLinks = options.StyleSheets
            .Select(s => $"    <link rel=\"stylesheet\" href=\"{s}\">")
            .DefaultIfEmpty("");
        
        var scriptTags = options.Scripts
            .Select(s => $"    <script type=\"module\" src=\"{s}\"></script>")
            .DefaultIfEmpty("");

        return $@"<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{options.Title}</title>
{string.Join("\n", styleLinks)}
</head>
<body>
    <div id=""{options.ContainerId}""></div>
    <script type=""module"" src=""/router.js""></script>
    <script type=""module"" src=""/{options.BundleFileName}""></script>
{string.Join("\n", scriptTags)}
</body>
</html>
";
    }
}

public sealed class HtmlGeneratorOptions
{
    public string Title { get; init; } = "Soft Application";
    public string ContainerId { get; init; } = "app";
    public string BundleFileName { get; init; } = "bundle.js";
    public List<string> StyleSheets { get; init; } = new();
    public List<string> Scripts { get; init; } = new();
}
