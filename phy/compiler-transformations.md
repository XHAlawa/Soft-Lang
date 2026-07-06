Soft is optimized for Human Developers and AI Agents equally.
# Compiler Transformations

## Goal

Describe every source-to-generated transformation.

## Core Philosophy

Soft is a **source-to-source compiler** (transpiler):
- **Input**: `.s` files (Soft syntax)
- **Output**: Valid, readable, deterministic TypeScript files
- **No JavaScript generation**: TypeScript compiler handles TypeScript → JavaScript
- **No TypeScript parsing**: TypeScript compiler handles TypeScript syntax, type checking, inference
- **No TypeScript duplication**: Never duplicate work TypeScript already does
- **Soft-specific only**: Soft only understands Soft syntax and performs Soft-specific semantic analysis
- **Enrichment, not replacement**: Think like a transpiler that enriches TypeScript
- **Prefer TypeScript**: When a feature can be valid TypeScript, generate TypeScript instead of custom features

---

# Pipeline

.s

↓

Lexer

↓

Parser

↓

Template Parser

↓

Semantic Model

↓

TypeScript Generator

↓

Generated TypeScript

↓

TypeScript Compiler (tsc)

↓

JavaScript

---

# @Page

Transforms into

Route Registration

Manifest Entry

Bootstrap Entry

---

# @Template

Transforms into

DOM Instructions

Binding Metadata

Dependency Metadata

---

# @Style

Transforms into

Scoped CSS Metadata

Generated CSS Output

---

# @Code

Copied into generated class.

Compiler injects metadata around it.

---

# Property Assignment

Source

customer.name = "Ali"

Generated

Proxy setter interception

Dependency dispatch

Renderer execution

---

# Event

Source

@click:save(customer)

Generated

DOM event registration

Typed callback

---

# Form

Source

@form:customerForm

Generated

Form object

Validation metadata

Binding metadata

State synchronization

---

# Component

Compiler generates

Factory

Metadata

Lifecycle wiring

Service resolution

Proxy wrapping

---

# Build Output

The final output of Soft is always TypeScript.

The official TypeScript compiler produces JavaScript.

Soft never emits JavaScript directly.
