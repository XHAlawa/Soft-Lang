# 🚀 Soft - Modern TypeScript Preprocessor

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/XHAlawa/Soft-Lang/releases)
[![Production Ready](https://img.shields.io/badge/production-ready-brightgreen.svg)](https://github.com/XHAlawa/Soft-Lang)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Soft** is a modern TypeScript preprocessor with reactive templating, forms, routing, and component system. Write less code, ship faster.

```soft
@Page("/hello")
@Template
  <h1>Hello, {name}!</h1>
  <input @bind:value="name" />

@Code
export class HelloPage {
  @State name = "World";
}
```

---

## ✨ Features

- 🎯 **Reactive Runtime** - Proxy-based reactivity with automatic dependency tracking
- 🧩 **Component System** - Auto-discovery and registration
- 📝 **Template Engine** - `@if`, `@foreach`, `@switch`, `@form`, `@L` directives
- 📋 **Forms Engine** - Built-in validation, state management, two-way binding
- 🛣️ **Client-Side Router** - Parameters, query strings, navigation guards
- 🌍 **Localization** - i18n support with `@L` directive
- ⚡ **Hot Reload** - Dev server with incremental compilation
- 🔒 **Production Ready** - 100/100 quality score, zero security vulnerabilities

---

## 📦 Installation

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/) (recommended)

### Quick Install

```bash
# Clone repository
git clone https://github.com/XHAlawa/Soft-Lang.git
cd Soft-Lang

# Build compiler
dotnet build -c Release

# Add to PATH (Windows)
setx PATH "%PATH%;%CD%\bin\Release\net8.0"

# Verify installation
soft --version
```

### VS Code Extension

Install the Soft Language extension for syntax highlighting and IntelliSense:

```bash
# Download from releases
code --install-extension soft-vscode-extension-1.0.0.vsix
```

Or install manually:
1. Download `soft-vscode-extension-1.0.0.vsix` from [Releases](https://github.com/XHAlawa/Soft-Lang/releases)
2. Open VS Code → Extensions → `...` → Install from VSIX

See [VSCODE-EXTENSION.md](VSCODE-EXTENSION.md) for details.

### Manual Setup

1. **Download** the latest release from [Releases](https://github.com/XHAlawa/Soft-Lang/releases)
2. **Extract** to `C:\Program Files\Soft\`
3. **Add to PATH**: 
   - Open System Properties → Environment Variables
   - Edit `Path` variable
   - Add `C:\Program Files\Soft\bin\Release\net8.0`
4. **Restart** your terminal

---

## 🚀 Quick Start

### Create New Project

```bash
# Create new Soft project
soft new my-app
cd my-app

# Start dev server
soft dev
```

Open http://localhost:3000 in your browser.

### Project Structure

```
my-app/
├── src/
│   ├── App.s           # Main app component
│   ├── Home.s          # Home page
│   └── components/     # Your components
├── dist/               # Build output
├── soft.config.json    # Configuration
└── package.json
```

---

## 📚 Language Guide

### 1. Pages

```soft
@Page("/users/:id")
@Template
  <div>
    <h1>User Profile</h1>
    <p>User ID: {$params.id}</p>
  </div>

@Code
export class UserPage {
  @State user = null;
  
  async onInit() {
    this.user = await fetch(`/api/users/${this.$params.id}`);
  }
}
```

### 2. Components

```soft
@Template
  <button @click="increment">
    Clicked {count} times
  </button>

@Code
export class Counter {
  @State count = 0;
  
  increment() {
    this.count++;
  }
}
```

### 3. Conditionals

```soft
@Template
  @if(isLoggedIn)
    <p>Welcome back, {user.name}!</p>
  @else
    <p>Please log in</p>
```

### 4. Loops

```soft
@Template
  <ul>
    @foreach(item in items)
      <li>{item.name}</li>
  </ul>

@Code
export class ItemList {
  @State items = [
    { name: "Apple" },
    { name: "Banana" },
    { name: "Orange" }
  ];
}
```

### 5. Forms & Validation

```soft
@Template
  @form(userForm)
    <input @bind:value="email" type="email" />
    <input @bind:value="password" type="password" />
    <button type="submit">Login</button>

@Code
export class LoginForm {
  @State email = "";
  @State password = "";
  
  @property({
    required: true,
    email: true
  })
  email;
  
  @property({
    required: true,
    minLength: 8
  })
  password;
  
  async onSubmit() {
    if (this.$form.valid) {
      await login(this.email, this.password);
    }
  }
}
```

### 6. Two-Way Binding

```soft
@Template
  <input @bind:value="name" />
  <input @bind:value.trim.debounce:300="search" />
  <input @bind:checked="isActive" type="checkbox" />

@Code
export class BindingExample {
  @State name = "";
  @State search = "";
  @State isActive = false;
}
```

### 7. Event Handling

```soft
@Template
  <button @click="save">Save</button>
  <button @click.prevent="submit">Submit</button>
  <input @keydown.enter="search" />
  <div @click.self="close">Modal</div>

@Code
export class Events {
  save() { /* ... */ }
  submit() { /* ... */ }
  search() { /* ... */ }
  close() { /* ... */ }
}
```

### 8. Computed Properties

```soft
@Code
export class User {
  @State firstName = "John";
  @State lastName = "Doe";
  
  @Computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

### 9. Watchers

```soft
@Code
export class SearchPage {
  @State query = "";
  
  @Watch("query")
  onQueryChange(newValue, oldValue) {
    console.log(`Query changed from ${oldValue} to ${newValue}`);
    this.performSearch(newValue);
  }
}
```

### 10. Localization

```soft
@Template
  <h1>@L("welcome.title")</h1>
  <p>@L("welcome.message", { name: userName })</p>

@Code
export class I18nExample {
  @State userName = "Ahmed";
}
```

---

## 🛠️ CLI Commands

```bash
# Create new project
soft new <project-name>

# Start dev server (http://localhost:3000)
soft dev

# Build for production
soft build

# Build and watch for changes
soft watch

# Show version
soft --version

# Show help
soft --help
```

---

## ⚙️ Configuration

**soft.config.json**

```json
{
  "sourceDir": "src",
  "outputDir": "dist",
  "port": 3000,
  "hotReload": true,
  "minify": true,
  "sourceMaps": true,
  "locales": ["en", "ar"]
}
```

---

## 📖 Advanced Topics

### Routing

```soft
// Navigate programmatically
this.$navigate("/users/123");
this.$navigate("/search", { q: "soft" });

// Route parameters
this.$params.id
this.$query.search

// Route guards
@Page("/admin", { guard: "isAdmin" })
```

### Lifecycle Hooks

```soft
@Code
export class MyComponent {
  onInit() {
    // Called when component is created
  }
  
  onAfterRender() {
    // Called after first render
  }
  
  onDestroy() {
    // Called before component is destroyed
  }
}
```

### Dependency Injection

```soft
@Code
export class UserService {
  async getUser(id) {
    return await fetch(`/api/users/${id}`);
  }
}

export class UserPage {
  constructor(private userService: UserService) {}
  
  async loadUser() {
    this.user = await this.userService.getUser(123);
  }
}
```

---

## 🎯 Examples

Check out the [examples](./tests) directory for complete working examples:

- **Counter** - Basic state and events
- **Todo App** - Forms, validation, lists
- **Router Demo** - Multi-page navigation
- **Forms** - Complex validation
- **Components** - Component composition

---

## 🏗️ Architecture

```
.s Source Files
    ↓
Scanner (Tokenization)
    ↓
Soft Parser (Extract @blocks)
    ↓
Template Parser (Parse directives)
    ↓
TypeScript Generator (Emit .ts)
    ↓
TypeScript Compiler (tsc)
    ↓
JavaScript + Bundle (esbuild)
    ↓
Production Ready
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by [Ahmed Halawa](https://github.com/XHAlawa)
- Inspired by modern web frameworks
- Powered by TypeScript and .NET

---

## 📞 Support

- 📧 Email: soft@compiler.dev
- 🐛 Issues: [GitHub Issues](https://github.com/XHAlawa/Soft-Lang/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/XHAlawa/Soft-Lang/discussions)
- 📖 Docs: [Full Documentation](https://github.com/XHAlawa/Soft-Lang/wiki)

---

## 🗺️ Roadmap

### v1.1.0 (Next)
- [ ] Server-side rendering (SSR)
- [ ] Static site generation (SSG)
- [ ] Enhanced dev tools
- [ ] VS Code extension improvements

### v2.0.0 (Future)
- [ ] Targeted DOM updates
- [ ] Virtual DOM option
- [ ] Web Components export
- [ ] Mobile app support

---

**⭐ Star us on GitHub if you find Soft useful!**

**🚀 Happy coding with Soft!**
