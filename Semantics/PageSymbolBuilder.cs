using Soft.Compiler.Parser;
using Soft.Compiler.Emit;

namespace Soft.Compiler.Semantics;

/// <summary>
/// Builds page symbol table from parsed SoftFileUnits
/// </summary>
public sealed class PageSymbolBuilder
{
    public PageSymbolTable Build(IEnumerable<SoftFileUnit> units)
    {
        var symbolTable = new PageSymbolTable();
        
        foreach (var unit in units)
        {
            if (unit.PageMetadata == null || !unit.PageMetadata.Routes.Any())
                continue;
            
            if (string.IsNullOrEmpty(unit.ClassName))
                continue;
            
            var canonicalRoute = unit.PageMetadata.Routes.First();
            var aliasRoutes = unit.PageMetadata.Routes.Skip(1).ToList();
            var parameters = RouteResolver.ParseRouteParameters(canonicalRoute);
            
            var symbol = new PageSymbol
            {
                ComponentName = unit.ClassName,
                CanonicalRoute = RouteResolver.ConvertToUrlPattern(canonicalRoute),
                AliasRoutes = aliasRoutes.Select(RouteResolver.ConvertToUrlPattern).ToList(),
                Parameters = parameters,
                Cache = unit.PageMetadata.Cache,
                Metadata = unit.PageMetadata.Metadata
            };
            
            symbolTable.AddPage(unit.ClassName, symbol);
        }
        
        return symbolTable;
    }
}
