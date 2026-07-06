# Installation Guide

## Quick Start

```bash
# Install CLI globally
npm install -g @soft/compiler

# Create new project
soft new my-app

# Start development
cd my-app
npm install
npm run dev
```

## Manual Installation

### 1. Install Compiler

```bash
npm install --save-dev @soft/compiler
```

### 2. Install VS Code Extension

1. Open VS Code
2. Press `Ctrl+P`
3. Type: `ext install soft-framework.soft-language`

### 3. Create Project Structure

```
my-app/
├── src/
│   └── App.s
├── public/
│   └── index.html
├── soft.json
├── package.json
└── tsconfig.json
```

### 4. Configure soft.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "outputDir": "generated",
  "entry": "src/App.s"
}
```

### 5. Add Scripts to package.json

```json
{
  "scripts": {
    "dev": "soft dev",
    "build": "soft build"
  }
}
```

## CLI Commands

```bash
soft new <name>           # Create new project
soft dev                  # Start dev server
soft build                # Build for production
soft add component <name> # Add new component
soft clean                # Clean generated files
```

## VS Code Features

- Syntax highlighting for `.s` files
- Code snippets (type `scomp`, `sstate`, etc.)
- Auto-completion
- Error checking
- Code folding

## Next Steps

1. Edit `src/App.s`
2. Run `npm run dev`
3. Open http://localhost:3000
4. Start building!

## Documentation

- Framework: https://soft-framework.dev/docs
- Examples: https://github.com/soft-framework/examples
- API Reference: https://soft-framework.dev/api
