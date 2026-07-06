# Soft Language Support for VS Code

Official VS Code extension for the Soft Framework.

## Features

### ✨ Syntax Highlighting
- Full syntax highlighting for `.s` files
- Support for `@Template`, `@Code`, `@Style` blocks
- Directive highlighting (`@if`, `@foreach`, `@slot`, etc.)
- Attribute highlighting (`@bind`, `@model`, `@click`, etc.)
- Interpolation highlighting `@(expression)`

### 📝 Code Snippets
- `scomp` - Create new component
- `sstate` - Add @State property
- `scomputed` - Add @Computed property
- `swatch` - Add @Watch handler
- `sprop` - Add @Prop
- `sif` - Add @if directive
- `sforeach` - Add @foreach directive
- `sslot` - Add @slot directive
- `sbind` - Add @bind attribute
- `smodel` - Add @model attribute
- `sclick` - Add @click attribute
- `svalidate` - Add validation
- `scustom` - Create custom directive

### 🎨 Auto-Closing
- Auto-close tags, brackets, quotes
- Smart indentation
- Code folding for blocks

### 🔧 Language Configuration
- Comment toggling (Ctrl+/)
- Bracket matching
- Auto-indentation

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install soft-framework.soft-language`
4. Press Enter

### From VSIX
1. Download `.vsix` file
2. Open VS Code
3. Go to Extensions
4. Click "..." → "Install from VSIX"
5. Select downloaded file

## Usage

### Create New Component
1. Create file with `.s` extension
2. Type `scomp` and press Tab
3. Fill in component name

### Use Snippets
- Type snippet prefix (e.g., `sstate`)
- Press Tab to expand
- Navigate with Tab

### Syntax Highlighting
- Automatic for `.s` files
- Supports all Soft directives
- TypeScript/CSS highlighting in blocks

## Examples

### Component Snippet
```soft
@Template
<div class="my-component">
    
</div>

@Code
export class MyComponent {
    
}

@Style(scoped)
.my-component {
    
}
```

### State Snippet
```soft
@State
count = 0;
```

### Foreach Snippet
```soft
@foreach(item in items)
<div @key="item.id">
    @(item.name)
</div>
```

## Settings

No additional settings required. Works out of the box!

## Known Issues

None currently. Report issues at: https://github.com/soft-framework/vscode-extension/issues

## Release Notes

### 1.0.0
- Initial release
- Syntax highlighting
- Code snippets
- Language configuration

## Contributing

Contributions welcome! See [CONTRIBUTING.md](https://github.com/soft-framework/vscode-extension/blob/main/CONTRIBUTING.md)

## License

MIT

## Links

- [Soft Framework](https://soft-framework.dev)
- [Documentation](https://soft-framework.dev/docs)
- [GitHub](https://github.com/soft-framework)
