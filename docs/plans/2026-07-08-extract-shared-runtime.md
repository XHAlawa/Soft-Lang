# Extract Shared Runtime Code Plan

> **Goal:** Extract ~300 lines of duplicated runtime code from all components into a shared base class, achieving additional 15-20% size reduction.

**Current State:** Every component duplicates 33 lines of runtime helpers (__scheduleRender, __localize, __dispose, lifecycle properties)

**Target:** Single shared base class, components only contain component-specific code

---

## Task 1: Create Shared Runtime Base Class

**Files:**
- Create: `d:\soft\Runtime\SoftComponent.ts`

**Steps:**

- [ ] **Step 1: Create SoftComponent base class**

```typescript
// Runtime base class for all Soft components
export abstract class SoftComponent {
    // Lifecycle state
    protected __mounted = false;
    protected __container?: HTMLElement;
    protected __cacheStore = new Map<string, any>();
    protected __cleanup: (() => void)[] = [];
    protected __validationErrors?: Record<string, string | null>;
    protected __touchedFields?: Record<string, boolean>;
    protected __renderScheduled = false;

    // Schedule render with debouncing to prevent multiple queued renders
    protected __scheduleRender(): void {
        if (this.__renderScheduled) return;
        this.__renderScheduled = true;
        queueMicrotask(() => {
            if (this.__mounted && this.__container) {
                this.__render(this.__container);
            }
        });
    }

    // Localization helper
    protected __localize(key: string, fallback?: string): string {
        return (globalThis as any).__softLocalize?.(key, fallback) || fallback || key;
    }

    // Component disposal (compiler-generated)
    __dispose(): void {
        // Dispose children first
        (this as any).__disposeChildren?.();
        
        // Then own cleanup
        (this as any).onDestroy?.();
        this.__cleanup.forEach(fn => fn());
        this.__cleanup = [];
        this.__mounted = false;
    }

    // Abstract render method - implemented by generated code
    abstract __render(container: HTMLElement): void;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc Runtime/SoftComponent.ts --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add Runtime/SoftComponent.ts
git commit -m "feat: add shared runtime base class for components"
```

---

## Task 2: Modify Code Generator to Use Base Class

**Files:**
- Modify: `d:\soft\Emit\TypeScriptGenerator.cs:1-50`

**Steps:**

- [ ] **Step 1: Add import for SoftComponent**

In `TypeScriptGenerator.cs`, modify class generation to add import:

```csharp
private string GenerateClassDeclaration(string className, bool isPage)
{
    var code = new StringBuilder();
    
    // Add import for base class
    code.AppendLine("import { SoftComponent } from './SoftComponent.js';");
    code.AppendLine();
    
    // Add decorators if page
    if (isPage)
    {
        code.AppendLine($"// Soft decorators:");
        code.AppendLine($"// @Page(\"{GetPageRoute(className)}\")");
        code.AppendLine();
    }
    
    // Extend SoftComponent instead of standalone class
    code.AppendLine($"export class {className} extends SoftComponent {{");
    
    return code.ToString();
}
```

- [ ] **Step 2: Remove duplicated runtime methods from generated code**

In `TypeScriptGenerator.cs`, find where lifecycle properties and methods are generated and remove:
- `__mounted`, `__container`, `__cleanup`, `__cacheStore` properties
- `__scheduleRender()` method
- `__localize()` method  
- `__dispose()` method

Keep only:
- Component-specific properties (@State, @Prop)
- Component methods (@Code section)
- `__render()` method (component-specific)

- [ ] **Step 3: Build and test**

Run: `dotnet build` in `d:\soft`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add Emit/TypeScriptGenerator.cs
git commit -m "refactor: use SoftComponent base class, remove duplicated runtime code"
```

---

## Task 3: Copy Runtime to Generated Output

**Files:**
- Modify: `d:\soft\Emit\TypeScriptGenerator.cs:200-250`

**Steps:**

- [ ] **Step 1: Add method to copy runtime files**

```csharp
private void CopyRuntimeFiles(string outputDir)
{
    var runtimeSource = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Runtime", "SoftComponent.ts");
    var runtimeDest = Path.Combine(outputDir, "SoftComponent.ts");
    
    if (File.Exists(runtimeSource))
    {
        File.Copy(runtimeSource, runtimeDest, overwrite: true);
        Console.WriteLine($"Copied runtime: SoftComponent.ts");
    }
    else
    {
        Console.WriteLine($"Warning: Runtime file not found at {runtimeSource}");
    }
}
```

- [ ] **Step 2: Call CopyRuntimeFiles during build**

In the main build/generation method, add:

```csharp
public void GenerateProject(string projectPath)
{
    // ... existing generation code ...
    
    // Copy runtime files to output
    CopyRuntimeFiles(outputDirectory);
    
    // ... rest of generation ...
}
```

- [ ] **Step 3: Build and test**

Run: `dotnet build -c Release` in `d:\soft`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add Emit/TypeScriptGenerator.cs
git commit -m "feat: auto-copy runtime files to generated output"
```

---

## Task 4: Regenerate and Verify

**Files:**
- Test: All generated components

**Steps:**

- [ ] **Step 1: Clean and rebuild compiler**

Run: `dotnet clean && dotnet build -c Release` in `d:\soft`
Expected: Build succeeds

- [ ] **Step 2: Regenerate project**

Run: `D:\soft\bin\Release\net8.0\soft.exe build` in `D:\systemx3`
Expected: Build succeeds

- [ ] **Step 3: Verify SoftComponent.ts copied**

Check: `D:\systemx3\generated\SoftComponent.ts` exists
Expected: File exists with base class code

- [ ] **Step 4: Check file sizes**

Run PowerShell:
```powershell
$before = 1242  # Current Users.generated.ts lines
$after = (Get-Content 'D:\systemx3\generated\Users.generated.ts').Count
$reduction = [math]::Round((1-($after/$before))*100,1)
Write-Output "Before: $before lines"
Write-Output "After: $after lines"  
Write-Output "Reduction: $reduction%"
```

Expected: ~15-20% additional reduction (~200-250 lines)

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --diagnostics` in `D:\systemx3`
Expected: Compiles successfully (ignore existing decorator errors)

- [ ] **Step 6: Check all components extend SoftComponent**

Run PowerShell:
```powershell
Get-ChildItem 'D:\systemx3\generated\*.generated.ts' | ForEach-Object {
    $hasExtends = Select-String -Path $_.FullName -Pattern "extends SoftComponent"
    if ($hasExtends) { Write-Host "✓ $($_.Name)" } else { Write-Host "✗ $($_.Name)" }
}
```

Expected: All components show ✓

---

## Task 5: Document Results

**Files:**
- Create: `d:\soft\docs\shared-runtime-results.md`

**Steps:**

- [ ] **Step 1: Measure total savings**

Calculate:
- Lines saved per component: ~33 lines
- Number of components: 9
- Total lines eliminated: ~300 lines
- Additional reduction: ~15-20%

- [ ] **Step 2: Create results document**

```markdown
# Shared Runtime Extraction Results

## Before
- Users.generated.ts: 1242 lines
- Each component: ~33 lines of duplicated runtime code
- Total duplication: ~300 lines across 9 components

## After  
- Users.generated.ts: ~1000 lines
- SoftComponent.ts: 50 lines (shared once)
- Total duplication: 0 lines

## Savings
- Lines eliminated: ~250 lines (net, accounting for shared base)
- Reduction: ~20% additional
- Combined with static optimization: ~50% total reduction from original 2037 lines

## Components Using Base Class
- ✓ App.generated.ts
- ✓ Users.generated.ts
- ✓ Dashboard.generated.ts
- ✓ Sidebar.generated.ts
- ✓ TopNav.generated.ts
- ✓ AdminLayout.generated.ts
- ✓ Container.generated.ts
- ✓ AuthService.generated.ts
- ✓ MockApiService.generated.ts
```

- [ ] **Step 3: Commit**

```bash
git add docs/shared-runtime-results.md
git commit -m "docs: shared runtime extraction results"
```

---

## Task 6: Push Changes

**Files:**
- All modified files

**Steps:**

- [ ] **Step 1: Final build verification**

Run: `dotnet build -c Release` in `d:\soft`
Expected: Build succeeds with no errors

- [ ] **Step 2: Push to repository**

```bash
git push origin master
```

Expected: Push succeeds

---

## Success Criteria

✅ SoftComponent.ts created with all shared runtime code  
✅ All components extend SoftComponent  
✅ No duplicated runtime methods in generated components  
✅ ~300 lines eliminated across all components  
✅ TypeScript compiles successfully  
✅ Combined optimization: 2037 → ~1000 lines (51% reduction, 2x improvement)

---

## Estimated Impact

**Current state:**
- Static optimization: 2037 → 1242 lines (39% reduction)

**After shared runtime extraction:**
- Combined: 2037 → ~1000 lines (51% reduction, 2x improvement)
- Approaching 5x target with remaining tasks (attribute batching, event delegation)
