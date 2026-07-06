# Installing Soft VS Code Extension

## Installation

The extension has been packaged as `soft-language-1.0.0.vsix`

### Method 1: Install from VSIX (Recommended)

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Extensions: Install from VSIX"
4. Navigate to `d:\soft\vscode-extension\soft-language-1.0.0.vsix`
5. Click Install
6. Reload VS Code

### Method 2: Command Line

```bash
code --install-extension d:\soft\vscode-extension\soft-language-1.0.0.vsix
```

## Testing the Extension

1. Open the test file: `d:\soft\tests\extension-test\TestExtension.s`

2. **Test Syntax Highlighting:**
   - Decorators (@Page, @Route, @Template, @Code) should be highlighted
   - Directives (@if, @foreach) should be highlighted
   - Attributes (@bind, @validate) should be highlighted

3. **Test IntelliSense:**
   - Type `@` and you should see decorator completions
   - Type `@` in template and see directive completions
   - Hover over `@Page` to see documentation

4. **Test Snippets:**
   - Type `scomp` and press Tab → Creates component
   - Type `sservice` and press Tab → Creates service
   - Type `spagedi` and press Tab → Creates page with DI
   - Type `soninit` and press Tab → Adds onInit hook
   - Type `svalreq` and press Tab → Adds validation
   - Type `sforminput` and press Tab → Creates validated input

5. **Test Commands:**
   - Press `Ctrl+Shift+P`
   - Type "Soft: Build Project" - should appear
   - Type "Soft: Start Dev Server" - should appear

## Features Included

✅ Syntax highlighting for .s files
✅ IntelliSense for decorators (@Page, @Service, @Route, etc.)
✅ IntelliSense for directives (@if, @foreach, etc.)
✅ IntelliSense for attributes (@bind, @validate, etc.)
✅ 15+ code snippets
✅ Hover documentation
✅ Build and dev server commands

## Verification Checklist

- [ ] Extension installs without errors
- [ ] .s files are recognized
- [ ] Syntax highlighting works
- [ ] @ triggers IntelliSense
- [ ] Snippets work (type 's' + Tab)
- [ ] Hover shows documentation
- [ ] Commands appear in palette
