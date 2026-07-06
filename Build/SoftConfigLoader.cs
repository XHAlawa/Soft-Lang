using System.Text.Json;

namespace Soft.Compiler.Build;

public static class SoftConfigLoader
{
    public static BuildConfiguration LoadFromProject(string projectRoot, bool isProduction = false, bool enableSourceMaps = true)
    {
        var configPath = Path.Combine(projectRoot, "soft.json");
        
        string? mainFile = null;
        
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
            enableSourceMaps: enableSourceMaps);
    }
    
    private class SoftJsonConfig
    {
        public string? Main { get; set; }
    }
}
