using System.Text;
using System.Text.RegularExpressions;

namespace Soft.Compiler.Emit;

/// <summary>
/// Generates code for @Watch decorated methods.
/// Transforms methods into property watchers.
/// </summary>
public class WatchCodeGenerator
{
    public string ProcessWatchDecorators(string code)
    {
        // Early return if no @Watch decorators
        if (!code.Contains("@Watch"))
            return code;
        
        var result = new StringBuilder();
        var lines = code.Split('\n');
        var watchers = new List<WatcherInfo>();
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            
            // Check for @Watch decorator
            if (line.Trim().StartsWith("@Watch"))
            {
                var watchInfo = ParseWatchDecorator(line);
                
                // Next line should be the method
                if (i + 1 < lines.Length)
                {
                    var methodLine = lines[i + 1];
                    var match = Regex.Match(methodLine, @"(\w+)\s*\(");
                    
                    if (match.Success)
                    {
                        watchInfo.MethodName = match.Groups[1].Value;
                        watchers.Add(watchInfo);
                        
                        // Skip @Watch line, keep method as-is
                        i++; // Skip to method line
                        result.AppendLine(lines[i]);
                        continue;
                    }
                }
            }
            
            result.AppendLine(line);
        }
        
        // Add watcher registration in constructor
        if (watchers.Any())
        {
            result = AddWatcherRegistration(result.ToString(), watchers);
        }
        
        return result.ToString();
    }
    
    private WatcherInfo ParseWatchDecorator(string line)
    {
        var info = new WatcherInfo();
        
        // Parse @Watch('propertyName', deep, immediate) or @Watch('propertyName', deep: true, immediate: true)
        var singleMatch = Regex.Match(line, @"@Watch\s*\(\s*['""]([^'""]+)['""]");
        if (singleMatch.Success)
        {
            info.Properties.Add(singleMatch.Groups[1].Value);
        }
        else
        {
            // Array of properties: @Watch(['prop1', 'prop2'], deep)
            var arrayMatch = Regex.Match(line, @"@Watch\s*\(\s*\[([^\]]+)\]");
            if (arrayMatch.Success)
            {
                var propsStr = arrayMatch.Groups[1].Value;
                var props = propsStr.Split(',')
                    .Select(p => p.Trim().Trim('\'', '"'))
                    .Where(p => !string.IsNullOrEmpty(p));
                info.Properties.AddRange(props);
            }
        }
        
        // Parse options as parameters (not object)
        // Supports: deep, immediate, deep: true, immediate: true
        if (line.Contains("deep"))
        {
            info.Deep = true;
        }
        if (line.Contains("immediate"))
        {
            info.Immediate = true;
        }
        
        return info;
    }
    
    private StringBuilder AddWatcherRegistration(string code, List<WatcherInfo> watchers)
    {
        var result = new StringBuilder();
        var lines = code.Split('\n');
        var constructorFound = false;
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            result.AppendLine(line);
            
            // Find constructor
            if (!constructorFound && line.Trim().StartsWith("constructor("))
            {
                constructorFound = true;
                
                // Find opening brace
                while (i < lines.Length && !lines[i].Contains("{"))
                {
                    i++;
                    result.AppendLine(lines[i]);
                }
                
                // Add watcher registration
                result.AppendLine("        // Register property watchers");
                foreach (var watcher in watchers)
                {
                    var propsArray = string.Join(", ", watcher.Properties.Select(p => $"'{p}'"));
                    var options = new List<string>();
                    
                    if (watcher.Deep) options.Add("deep: true");
                    if (watcher.Immediate) options.Add("immediate: true");
                    
                    // Generate options object only if needed
                    var optionsStr = options.Any() ? $", {{ {string.Join(", ", options)} }}" : "";
                    
                    if (watcher.Properties.Count == 1)
                    {
                        result.AppendLine($"        // Watch '{watcher.Properties[0]}' - Use Core Proxy for automatic notifications");
                        result.AppendLine($"        // TODO: Implement watch using Core Proxy dependency tracking");
                    }
                    else
                    {
                        result.AppendLine($"        // Watch [{propsArray}] - Use Core Proxy for automatic notifications");
                        result.AppendLine($"        // TODO: Implement watch using Core Proxy dependency tracking");
                    }
                }
                result.AppendLine();
            }
        }
        
        return result;
    }
    
    private class WatcherInfo
    {
        public List<string> Properties { get; set; } = new();
        public string MethodName { get; set; } = "";
        public bool Deep { get; set; }
        public bool Immediate { get; set; }
    }
}
