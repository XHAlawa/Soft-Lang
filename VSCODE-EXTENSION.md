# 🎨 Soft Language VS Code Extension

**Version:** 1.0.0  
**File:** `soft-vscode-extension-1.0.0.vsix`

---

## ✨ Features

### Syntax Highlighting
- Full syntax highlighting for `.s` files
- Color-coded directives: `@Page`, `@Template`, `@Code`, `@Style`
- Template directives: `@if`, `@foreach`, `@switch`, `@form`, `@L`
- TypeScript highlighting in `@Code` blocks
- CSS highlighting in `@Style` blocks
- HTML highlighting in `@Template` blocks

### IntelliSense
- TypeScript IntelliSense in `@Code` blocks
- Auto-completion for Soft decorators
- Snippet support for common patterns

### Code Snippets
- `page` - Create new page component
- `component` - Create new component
- `state` - Add @State property
- `computed` - Add @Computed property
- `watch` - Add @Watch decorator
- `if` - @if directive
- `foreach` - @foreach directive
- `form` - @form directive

### Commands
- **Soft: Build Project** - Build current project
- **Soft: Start Dev Server** - Start development server

### Theme
- **Soft Dark** - Custom dark theme optimized for Soft syntax

---

## 📦 Installation

### Method 1: From VSIX File

1. Download `soft-vscode-extension-1.0.0.vsix`
2. Open VS Code
3. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
4. Type "Install from VSIX"
5. Select the downloaded `.vsix` file

### Method 2: Command Line

```bash
code --install-extension soft-vscode-extension-1.0.0.vsix
```

### Method 3: VS Code Extensions View

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Click `...` (More Actions)
4. Select "Install from VSIX..."
5. Choose the `.vsix` file

---

## ⚙️ Configuration

Add to your VS Code `settings.json`:

```json
{
  "soft.enableTypeScriptIntelliSense": true,
  "soft.autoClosingTags": true,
  "[soft]": {
    "editor.defaultFormatter": "soft-framework.soft-language",
    "editor.tabSize": 2,
    "editor.insertSpaces": true
  }
}
```

---

## 🎯 Usage Examples

### Page Component
```soft
@Page("/users/:id")
@Template
  <div class="user-profile">
    <h1>{user.name}</h1>
  </div>

@Code
export class UserPage {
  @State user = null;
}
```

### Component with Snippets
Type `component` + Tab:
```soft
@Template
  <div>
    <!-- Your template here -->
  </div>

@Code
export class MyComponent {
  @State data = null;
}
```

---

## 🎨 Syntax Highlighting Preview

**Directives:** Purple  
**Decorators:** Yellow  
**HTML Tags:** Blue  
**Attributes:** Cyan  
**Strings:** Green  
**Keywords:** Pink  
**Comments:** Gray  

---

## 🔧 Troubleshooting

### Extension Not Working?
1. Restart VS Code
2. Check file extension is `.s`
3. Verify extension is enabled in Extensions view

### No Syntax Highlighting?
1. Open a `.s` file
2. Click language mode (bottom right)
3. Select "Soft" from the list

### IntelliSense Not Working?
1. Check `soft.enableTypeScriptIntelliSense` is `true`
2. Ensure you're in a `@Code` block
3. Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

## 📝 File Associations

The extension automatically associates `.s` files with Soft language mode.

To manually set:
1. Open a `.s` file
2. Click language mode indicator (bottom right)
3. Select "Soft"

---

## 🚀 Features Roadmap

### v1.1.0
- [ ] Go to Definition support
- [ ] Find All References
- [ ] Rename symbol
- [ ] Code formatting

### v1.2.0
- [ ] Debugger support
- [ ] Error diagnostics
- [ ] Quick fixes

### v2.0.0
- [ ] Language server protocol (LSP)
- [ ] Advanced refactoring
- [ ] Code lens

---

## 📄 License

MIT License - Same as Soft Compiler

---

## 🙏 Support

- 🐛 Issues: [GitHub Issues](https://github.com/XHAlawa/Soft-Lang/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/XHAlawa/Soft-Lang/discussions)

---

**Enjoy coding with Soft! 🎉**
