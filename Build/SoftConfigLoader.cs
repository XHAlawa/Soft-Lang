using System.Text.Json;

namespace Soft.Compiler.Build;

public static class SoftConfigLoader
{
    public static BuildConfiguration LoadFromProject(string projectRoot, bool isProduction = false, bool enableSourceMaps = true)
    {
        var configPath = Path.Combine(projectRoot, "soft.json");
        
        string? mainFile = null;
        int autoCloseTimeout = 600; // 10 minutes default
        string[]? globalStyles = null;
        
        if (File.Exists(configPath))
        {
            try
            {
                var json = File.ReadAllText(configPath);
                var config = JsonSerializer.Deserialize<SoftJsonConfig>(json, new JsonSerializerOptions 
                { 
                    PropertyNameCaseInsensitive = true 
                });
                
                mainFile = config?.Main;
                autoCloseTimeout = config?.AutoCloseTimeout ?? 600;
                globalStyles = config?.GlobalStyles;
            }
            catch
            {
                // Ignore JSON errors, use defaults
            }
        }
        
        return new BuildConfiguration(
            projectRoot,
            mainFile: mainFile,
            isProduction: isProduction,
            enableSourceMaps: enableSourceMaps,
            autoCloseTimeout: autoCloseTimeout,
            globalStyles: globalStyles);
    }
    
    private class SoftJsonConfig
    {
        public string? Main { get; set; }
        public int? AutoCloseTimeout { get; set; }
        public string[]? GlobalStyles { get; set; }
    }
}
