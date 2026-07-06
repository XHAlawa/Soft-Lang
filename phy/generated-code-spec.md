Soft is optimized for Human Developers and AI Agents equally.
# Generated Code Specification
Version: 1.0

## Core Philosophy

Soft is a **source-to-source compiler** (transpiler):
- **Input**: `.s` files (Soft syntax)
- **Output**: Valid, readable, deterministic TypeScript files
- **No JavaScript generation**: TypeScript compiler handles TypeScript → JavaScript
- **No TypeScript parsing**: TypeScript compiler handles TypeScript syntax, type checking, inference
- **Generated TypeScript is an implementation artifact**: Developers never edit generated files

## Goal

This document defines exactly what the Soft compiler generates.

---

# File Mapping

App.s            -> generated/App.ts
Todo.s           -> generated/Todo.ts
Customer.s       -> generated/Customer.ts

---

# Page

Input

@Page("/")

export class Todo { }

Generated

- Route metadata
- Component metadata
- Bootstrap registration
- Constructor metadata
- Lifecycle registration

---

# Template

Input

@Template{
<div>
    <input @value:todo.text />
    <button @onClick:addTodo() />
</div>
}

Generated

- DOM creation instructions
- Dependency registrations
- DOM ids
- Event registrations
- Binding metadata

No HTML parser exists at runtime.

---

# @value

Input

@value:customer.name

Generated

1. Read binding
2. DOM Node Id
3. Dependency Graph Edge
4. Property metadata

Runtime operation

Proxy
↓
DependencyExecutor
↓
UpdateProperty(NodeId)

---

# @text

Generated as text binding.

Compiler allocates TextNode ids.

Runtime updates text only.

---

# @if

Compiler emits:

Conditional Block Id

Mount Instruction

Unmount Instruction

Dependencies

Runtime never evaluates template structure.

---

# @foreach

Compiler emits

Loop Descriptor

Identity Strategy

Insert Operation

Remove Operation

Move Operation

Dependency Metadata

Runtime executes operations only.

---

# @property

Compiler generates

Extension Metadata

Extension Factory

Execution Context

Element Binding

Lifecycle Hooks

---

# onChange

Compiler generates typed wrappers.

Object.onChange(...)

Property.onChange(...)

No reflection.

---

# Generated Folder

generated/

App.ts
Todo.ts
Customer.ts
Manifest.ts
Routes.ts
Metadata.ts

Generated files are deleted and recreated every build.
