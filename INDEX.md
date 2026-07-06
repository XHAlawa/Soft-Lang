# 📖 Soft Compiler Documentation Index

**Welcome to the Soft Compiler!**

This index will guide you through all available documentation.

---

## 🚀 Getting Started

**New to Soft?** Start here:

1. **[FINAL_SUMMARY.md](FINAL_SUMMARY.md)** - Complete project overview
2. **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Syntax and features reference
3. **[Test Projects](tests/)** - Working examples

---

## 📚 Documentation

### **Project Reports**

- **[PHASE_1_COMPLETE.md](PHASE_1_COMPLETE.md)** - Component lifecycle implementation
- **[PHASE_2_COMPLETE.md](PHASE_2_COMPLETE.md)** - DI and validation implementation
- **[FINAL_SUMMARY.md](FINAL_SUMMARY.md)** - Complete project summary

### **Developer Guides**

- **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick syntax reference
- **[PHY Documentation](phy/)** - Architecture and design philosophy

### **Installation**

- **[INSTALL.md](INSTALL.md)** - Installation instructions

---

## 🧪 Examples & Tests

### **Test Projects**

Located in `tests/`:

1. **[lifecycle/](tests/lifecycle/)** - Component lifecycle tests
   - Conditional disposal (`@if`)
   - Loop disposal (`@foreach`)
   - Nested components
   - Stress tests

2. **[di/](tests/di/)** - Dependency injection tests
   - Service definition
   - Constructor injection
   - Type safety

3. **[validation/](tests/validation/)** - Form validation tests
   - Required fields
   - Email validation
   - Min/max constraints

4. **[demo/](tests/demo/)** - Comprehensive demo
   - All features combined
   - Interactive showcase

### **Example Projects**

Located in `examples/`:

- Component examples
- Routing examples
- Form examples
- Advanced patterns

---

## 🔧 Development

### **CLI Commands**

```bash
# Build
soft build
soft build --project ./app

# Development
soft dev
soft dev --port 3000

# Clean
soft clean
```

### **Project Structure**

```
soft.json           # Project configuration
src/                # Source files (.s)
generated/          # Generated TypeScript
dist/               # Compiled output
```

---

## 📖 Language Reference

### **File Structure**

```typescript
@Page
@Route("/path")

@importComponent Name from "./path.s"

@Template {
    <!-- HTML template -->
}

@Style {
    /* CSS styles */
}

@Code {
    export class Component {
        // TypeScript code
    }
}
```

### **Core Features**

- **[Decorators](#decorators)** - `@Page`, `@Service`, `@Route`
- **[Directives](#directives)** - `@if`, `@foreach`, `@switch`
- **[Attributes](#attributes)** - `@bind`, `@click`, `@validate`
- **[Lifecycle](#lifecycle)** - `onInit`, `onMounted`, `onDestroy`
- **[DI](#dependency-injection)** - Constructor injection
- **[Validation](#validation)** - Declarative rules

---

## 🎯 Key Concepts

### **PHY Philosophy**

**Compiler Resolves, Runtime Executes**

- Compiler generates all metadata
- Runtime only executes instructions
- No reflection or discovery
- Deterministic behavior

### **Component Lifecycle**

```
Create → onInit() → Render → onMounted()
  ↓
Update → onUpdated() → Re-render
  ↓
Destroy → onDestroy() → __dispose() → Cleanup
```

### **Dependency Injection**

```typescript
@Service
export class MyService { }

@Page
export class MyPage {
    constructor(private service: MyService) {
        // Service auto-injected by compiler
    }
}
```

### **Form Validation**

```html
<input 
    @bind:value="email"
    @validate:required
    @validate:email
/>
```

---

## 🛠️ Architecture

### **Compiler Pipeline**

```
.s file
  ↓
Scanner
  ↓
Soft Parser
  ↓
Template Parser
  ↓
Code Generator
  ↓
TypeScript
  ↓
tsc (TypeScript Compiler)
  ↓
JavaScript
```

### **Key Components**

- **Parser** - Extracts Soft syntax
- **Template Parser** - Parses HTML templates
- **Code Generator** - Generates TypeScript
- **Runtime** - Minimal execution layer
- **Dev Server** - Development tooling

---

## 📊 Project Status

### **Completed Features** ✅

- Component lifecycle management
- Dependency injection
- Form validation
- Event handling
- Conditional rendering
- Loop rendering
- Route management
- Development server

### **Production Ready** ✅

The compiler is production-ready for:
- Component-based applications
- Single-page applications
- Form-heavy applications
- Service-oriented architecture

---

## 🔗 Quick Links

### **Documentation**
- [Final Summary](FINAL_SUMMARY.md)
- [Quick Reference](docs/QUICK_REFERENCE.md)
- [Phase 1 Report](PHASE_1_COMPLETE.md)
- [Phase 2 Report](PHASE_2_COMPLETE.md)

### **Code**
- [Test Projects](tests/)
- [Examples](examples/)
- [Runtime](Runtime/)
- [Parser](Parser/)

### **Tools**
- [CLI](CLI/)
- [Dev Server](DevServer/)
- [VS Code Extension](vscode-extension/)

---

## 💡 Tips

### **For New Users**

1. Read [FINAL_SUMMARY.md](FINAL_SUMMARY.md)
2. Check [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)
3. Explore test projects in `tests/`
4. Run `soft dev` to start development

### **For Contributors**

1. Review PHY philosophy documentation
2. Check existing processors in `Emit/Processors/`
3. Follow code generation patterns
4. Add tests for new features

---

## 📞 Support

### **Documentation Issues**

If documentation is unclear:
1. Check [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)
2. Review test projects
3. Check generated code examples

### **Compiler Issues**

If compiler behavior is unexpected:
1. Check error messages
2. Review generated TypeScript
3. Verify syntax in [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)

---

## 🎉 Success Stories

The Soft compiler successfully implements:

✅ **Zero Memory Leaks** - Deterministic disposal  
✅ **Type Safety** - Full TypeScript integration  
✅ **Clean Code** - Readable generated output  
✅ **Fast Development** - Hot reload dev server  
✅ **Production Ready** - Battle-tested architecture  

---

**Ready to build with Soft?**

Start with [FINAL_SUMMARY.md](FINAL_SUMMARY.md) or jump into [tests/demo/](tests/demo/) for a hands-on experience!

---

**Version:** 2.0.0  
**Status:** Production Ready  
**Last Updated:** July 3, 2026
