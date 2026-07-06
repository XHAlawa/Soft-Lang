# Soft Framework - Directives & Handlers Reference

## Template Directives

| Directive | Description | Handler File | Handler Class |
|-----------|-------------|--------------|---------------|
| `@if` | Conditional rendering | `Template\TemplateParser.cs` | `TemplateParser.ParseIfDirective()` |
| `@else` | Alternative branch for @if | `Template\TemplateParser.cs` | `TemplateParser.ParseIfDirective()` |
| `@else if` | Chained conditional | `Template\TemplateParser.cs` | `TemplateParser.ParseIfDirective()` |
| `@foreach` | List rendering / iteration | `Template\TemplateParser.cs` | `TemplateParser.ParseForEachDirective()` |
| `@switch` | Switch statement | `Template\TemplateParser.cs` | `TemplateParser.ParseSwitchDirective()` |
| `@case` | Switch case branch | `Template\TemplateParser.cs` | `TemplateParser.ParseSwitchDirective()` |
| `@default` | Default switch branch | `Template\TemplateParser.cs` | `TemplateParser.ParseSwitchDirective()` |

## Binding Directives

| Directive | Description | Handler File | Handler Class |
|-----------|-------------|--------------|---------------|
| `@bind:value` | Two-way data binding for input value | `Emit\Processors\BindingAttributeProcessor.cs` | `BindingAttributeProcessor` |
| `@bind:value.trim` | Two-way binding with trim modifier | `Emit\Processors\BindingAttributeProcessor.cs` | `BindingAttributeProcessor` |
| `@bind:value.number` | Two-way binding with number conversion | `Emit\Processors\BindingAttributeProcessor.cs` | `BindingAttributeProcessor` |
| `@bind:value.lazy` | Two-way binding on change event | `Emit\Processors\BindingAttributeProcessor.cs` | `BindingAttributeProcessor` |
| `@bind:value.debounce` | Two-way binding with debounce (300ms) | `Emit\Processors\BindingAttributeProcessor.cs` | `BindingAttributeProcessor` |
| `@bind:value.debounce:500` | Two-way binding with custom debounce | `Emit\Processors\BindingAttributeProcessor.cs` | `BindingAttributeProcessor` |
| `@bind:checked` | Two-way binding for checkbox | `Emit\Processors\BindingAttributeProcessor.cs` | `BindingAttributeProcessor` |
| `@model` | Shorthand for @bind:value | `Emit\Processors\ModelAttributeProcessor.cs` | `ModelAttributeProcessor` |

## Event Directives

| Directive | Description | Handler File | Handler Class |
|-----------|-------------|--------------|---------------|
| `@click` | Click event handler | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@click.stop` | Click with stop propagation | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@click.prevent` | Click with prevent default | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@click.once` | Click handler (once only) | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@submit` | Form submit event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@submit.prevent` | Submit with prevent default | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@change` | Change event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@input` | Input event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@focus` | Focus event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@blur` | Blur event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@keydown` | Keydown event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@keyup` | Keyup event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@mouseenter` | Mouse enter event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |
| `@mouseleave` | Mouse leave event | `Emit\Processors\EventAttributeProcessor.cs` | `EventAttributeProcessor` |

## Dynamic Styling Directives

| Directive | Description | Handler File | Handler Class |
|-----------|-------------|--------------|---------------|
| `@class:name` | Conditional CSS class | `Emit\Processors\ClassAttributeProcessor.cs` | `ClassAttributeProcessor` |
| `@style:property` | Dynamic inline style | `Emit\Processors\StyleAttributeProcessor.cs` | `StyleAttributeProcessor` |

## Visibility & State Directives

| Directive | Description | Handler File | Handler Class |
|-----------|-------------|--------------|---------------|
| `@visible` | Conditional visibility (display) | `Emit\Processors\VisibilityAttributeProcessor.cs` | `VisibilityAttributeProcessor` |
| `@show` | Alias for @visible | `Emit\Processors\VisibilityAttributeProcessor.cs` | `VisibilityAttributeProcessor` |
| `@disabled` | Dynamic disabled state | `Emit\Processors\VisibilityAttributeProcessor.cs` | `VisibilityAttributeProcessor` |
| `@enabled` | Dynamic enabled state | `Emit\Processors\VisibilityAttributeProcessor.cs` | `VisibilityAttributeProcessor` |

## Form Validation Directives

| Directive | Description | Handler File | Handler Class |
|-----------|-------------|--------------|---------------|
| `@validate:required` | Required field validation | `Emit\Processors\ValidateAttributeProcessor.cs` | `ValidateAttributeProcessor` |
| `@validate:email` | Email format validation | `Emit\Processors\ValidateAttributeProcessor.cs` | `ValidateAttributeProcessor` |
| `@validate:min:N` | Minimum length validation | `Emit\Processors\ValidateAttributeProcessor.cs` | `ValidateAttributeProcessor` |
| `@validate:max:N` | Maximum length validation | `Emit\Processors\ValidateAttributeProcessor.cs` | `ValidateAttributeProcessor` |
| `@validate:number` | Number validation | `Emit\Processors\ValidateAttributeProcessor.cs` | `ValidateAttributeProcessor` |
| `@validate:url` | URL format validation | `Emit\Processors\ValidateAttributeProcessor.cs` | `ValidateAttributeProcessor` |
| `@validate:pattern:REGEX` | Custom regex validation | `Emit\Processors\ValidateAttributeProcessor.cs` | `ValidateAttributeProcessor` |
| `@error-for` | Display validation errors | `Emit\Processors\ErrorAttributeProcessor.cs` | `ErrorAttributeProcessor` |

## Component & Reference Directives

| Directive | Description | Handler File | Handler Class |
|-----------|-------------|--------------|---------------|
| `@ref` | Element reference | `Emit\Processors\RefAttributeProcessor.cs` | `RefAttributeProcessor` |
| `@key` | List item key for optimization | `Emit\Processors\KeyAttributeProcessor.cs` | `KeyAttributeProcessor` |

## Special Directives

| Directive | Description | Handler File | Handler Class |
|-----------|-------------|--------------|---------------|
| `@soft:*` | Framework-specific directives | `Emit\Processors\SoftDirectiveProcessor.cs` | `SoftDirectiveProcessor` |
| `@namespace:name` | Custom namespace directives | `Emit\Processors\CustomDirectiveAttributeProcessor.cs` | `CustomDirectiveAttributeProcessor` |

## Code Generation Components

| Component | Description | File Location |
|-----------|-------------|---------------|
| Template Parser | Main template parsing orchestrator | `Template\TemplateParser.cs` |
| Expression Parser | Parses template expressions | `Template\Parser\ExpressionParser.cs` |
| Attribute Parser | Parses element attributes | `Template\Parser\AttributeParser.cs` |
| Element Parser | Parses HTML elements | `Template\Parser\ElementParser.cs` |
| Text Parser | Parses text nodes | `Template\Parser\TextParser.cs` |
| Code Generator | Main code generation orchestrator | `Template\TemplateCodeGenerator.cs` |
| Element Generator | Generates element creation code | `Emit\Generators\ElementGenerator.cs` |
| Interpolation Generator | Generates text interpolation code | `Emit\Generators\InterpolationGenerator.cs` |
| Component Generator | Generates component instantiation | `Emit\Generators\ComponentGenerator.cs` |
| Slot Generator | Generates slot rendering | `Emit\Generators\SlotGenerator.cs` |
| Form Generator | Generates form handling | `Emit\Generators\FormGenerator.cs` |
| Error Boundary Generator | Generates error boundaries | `Emit\Generators\ErrorBoundaryGenerator.cs` |

## State Management

| Feature | Description | File Location |
|---------|-------------|---------------|
| `@State` decorator | Reactive state properties | `Emit\StateCodeGenerator.cs` |
| `@Prop` decorator | Component props | `Emit\PropsCodeGenerator.cs` |
| State store | Reactive state management | `Emit\StateCodeGenerator.cs` |
| Watch system | State change observation | `Emit\StateCodeGenerator.cs` |

## Parser Context & State

| Component | Description | File Location |
|-----------|-------------|---------------|
| Parsing Context | Shared parsing state | `Template\Parser\ParsingContext.cs` |
| Code Generation Context | Code generation state | `Template\CodeGenerationContext.cs` |
| Attribute Processing Context | Attribute processing state | `Abstractions\AttributeProcessingContext.cs` |

## Core Abstractions

| Interface | Description | File Location |
|-----------|-------------|---------------|
| `INodeGenerator` | Node generation interface | `Abstractions\INodeGenerator.cs` |
| `IAttributeProcessor` | Attribute processing interface | `Abstractions\IAttributeProcessor.cs` |
| `ICodeGenerator` | Code generation interface | `Abstractions\ICodeGenerator.cs` |

## Expression Handling

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Property access | `obj.property` | `ExpressionParser.ParseExpressionBinding()` |
| Method calls | `method(args)` | `ExpressionParser.ParseExpressionBinding()` |
| Array indexing | `array[index]` | `ExpressionParser.ParseExpressionBinding()` |
| Ternary operators | `condition ? a : b` | `ExpressionParser.ParseBalancedExpression()` |
| Comparison operators | `a > b`, `a < b` | `ExpressionParser.ParseBalancedExpression()` |
| String interpolation | `@variable` | `InterpolationGenerator` |
| Complex expressions | `count * 10 + 5` | `AddThisPrefix()` helper |

## Modifiers

### Event Modifiers
- `.stop` - Stop event propagation
- `.prevent` - Prevent default action
- `.once` - Execute handler once only

### Binding Modifiers
- `.trim` - Trim whitespace from input
- `.number` - Convert to number
- `.lazy` - Update on change instead of input
- `.debounce` - Debounce input (default 300ms)
- `.debounce:N` - Custom debounce delay

## Special Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Focus preservation | Maintains input focus during re-renders | `TemplateCodeGenerator.__render()` |
| Loop variable scoping | Proper variable scoping in nested loops | `CodeGenerationContext.LoopVariables` |
| Kebab-case conversion | Converts CSS properties to camelCase | `StyleAttributeProcessor.ConvertToCamelCase()` |
| This prefix handling | Adds `this.` to class properties | `AddThisPrefix()` in multiple processors |
| String literal skipping | Preserves string literals in expressions | `AddThisPrefix()` quote detection |
| Arrow function params | Skips arrow function parameters | `AddThisPrefix()` parameter extraction |

## Build Pipeline

1. **Scanner** → Tokenizes source code
2. **Soft Parser** → Parses Soft-specific syntax
3. **Template Parser** → Parses template directives
4. **Metadata Builder** → Builds component metadata
5. **TypeScript Generator** → Generates TypeScript code
6. **Source Map Generator** → Generates source maps
7. **TypeScript Compiler** → Compiles to JavaScript

## File Structure

```
d:\soft\
├── Template\
│   ├── TemplateParser.cs           # Main parser
│   ├── TemplateCodeGenerator.cs    # Main code generator
│   └── Parser\
│       ├── ParsingContext.cs       # Parsing state
│       ├── ExpressionParser.cs     # Expression parsing
│       ├── AttributeParser.cs      # Attribute parsing
│       ├── ElementParser.cs        # Element parsing
│       └── TextParser.cs           # Text parsing
├── Emit\
│   ├── Processors\                 # Attribute processors
│   │   ├── BindingAttributeProcessor.cs
│   │   ├── EventAttributeProcessor.cs
│   │   ├── ClassAttributeProcessor.cs
│   │   ├── StyleAttributeProcessor.cs
│   │   ├── VisibilityAttributeProcessor.cs
│   │   ├── ValidateAttributeProcessor.cs
│   │   ├── ErrorAttributeProcessor.cs
│   │   ├── RefAttributeProcessor.cs
│   │   ├── KeyAttributeProcessor.cs
│   │   ├── ModelAttributeProcessor.cs
│   │   ├── SoftDirectiveProcessor.cs
│   │   └── CustomDirectiveAttributeProcessor.cs
│   ├── Generators\                 # Code generators
│   │   ├── ElementGenerator.cs
│   │   ├── InterpolationGenerator.cs
│   │   ├── ComponentGenerator.cs
│   │   ├── SlotGenerator.cs
│   │   ├── FormGenerator.cs
│   │   └── ErrorBoundaryGenerator.cs
│   ├── StateCodeGenerator.cs       # State management
│   └── PropsCodeGenerator.cs       # Props handling
└── Abstractions\
    ├── INodeGenerator.cs           # Generator interface
    ├── IAttributeProcessor.cs      # Processor interface
    └── ICodeGenerator.cs           # Code gen interface
```

## Examples

### Conditional Rendering
```html
@if (isActive) {
    <p>Active</p>
}
@else {
    <p>Inactive</p>
}
```

### List Rendering
```html
@foreach (item in items) {
    <li @key="item.id">@item.name</li>
}
```

### Two-Way Binding
```html
<input @bind:value.trim="username" />
<input @bind:value.number="age" />
<input @bind:checked="isActive" />
```

### Event Handling
```html
<button @click="handleClick()">Click</button>
<button @click.stop="innerClick()">Stop Propagation</button>
<form @submit.prevent="handleSubmit()">Submit</form>
```

### Dynamic Styling
```html
<div @class:active="isActive" @class:disabled="!isEnabled">
<div @style:color="textColor" @style:font-size="fontSize + 'px'">
```

### Form Validation
```html
<input @bind:value="email" @validate:required @validate:email />
<span @error-for="email"></span>
```

## Notes

- All directives starting with `@` are processed by the Soft compiler
- Template expressions are evaluated as TypeScript code
- The `this.` prefix is automatically added to class properties
- String literals and arrow function parameters are preserved
- Focus is automatically preserved during re-renders
- All style changes trigger immediate UI updates
