using Microsoft.Extensions.DependencyInjection;

namespace Soft.Compiler.DependencyInjection;

public static class CompilerServiceProvider
{
    public static IServiceProvider Create()
    {
        var services = new ServiceCollection();
        services.AddSoftCompiler();
        return services.BuildServiceProvider();
    }
}
