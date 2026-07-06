namespace Soft.Compiler.Utilities;

public static class PathUtilities
{
    public static string NormalizePath(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
            return path;

        return Path.GetFullPath(path)
            .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
    }

    public static string GetRelativePath(string basePath, string targetPath)
    {
        if (string.IsNullOrWhiteSpace(basePath))
            throw new ArgumentException("Base path cannot be null or empty.", nameof(basePath));

        if (string.IsNullOrWhiteSpace(targetPath))
            throw new ArgumentException("Target path cannot be null or empty.", nameof(targetPath));

        var baseUri = new Uri(NormalizePath(basePath) + Path.DirectorySeparatorChar);
        var targetUri = new Uri(NormalizePath(targetPath));

        var relativeUri = baseUri.MakeRelativeUri(targetUri);
        return Uri.UnescapeDataString(relativeUri.ToString())
            .Replace('/', Path.DirectorySeparatorChar);
    }

    public static void EnsureDirectoryExists(string directoryPath)
    {
        if (string.IsNullOrWhiteSpace(directoryPath))
            throw new ArgumentException("Directory path cannot be null or empty.", nameof(directoryPath));

        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }
    }

    public static void CleanDirectory(string directoryPath)
    {
        if (string.IsNullOrWhiteSpace(directoryPath))
            throw new ArgumentException("Directory path cannot be null or empty.", nameof(directoryPath));

        if (!Directory.Exists(directoryPath))
            return;

        var dirInfo = new DirectoryInfo(directoryPath);

        foreach (var file in dirInfo.GetFiles())
        {
            file.Delete();
        }

        foreach (var dir in dirInfo.GetDirectories())
        {
            dir.Delete(true);
        }
    }
}
