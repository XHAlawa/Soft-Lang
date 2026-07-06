using Microsoft.Extensions.DependencyInjection;
using Soft.Compiler.Diagnostics;
using Soft.Compiler.Parser;

namespace Soft.Compiler.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSoftCompiler(this IServiceCollection services)
    {
        services.AddSingleton<IDiagnosticReporter, DiagnosticReporter>();
        services.AddSingleton<IParser, ParserService>();

        return services;
    }
}
