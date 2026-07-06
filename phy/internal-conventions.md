Soft is optimized for Human Developers and AI Agents equally.
# Internal Conventions

## Purpose
Defines non-negotiable implementation rules for the Soft compiler and runtime.

## Core Philosophy
Soft is a **source-to-source compiler** (transpiler):
- **Input**: `.s` files (Soft syntax)
- **Output**: Valid, readable, deterministic TypeScript files
- **No JavaScript generation**: TypeScript compiler handles TypeScript → JavaScript
- **No TypeScript parsing**: TypeScript compiler handles TypeScript syntax, type checking, inference
- **No TypeScript duplication**: Never duplicate work TypeScript already does

## Naming
- Generated classes: SoftGenerated*
- Internal metadata: Immutable
- Runtime services: Singleton unless specified
- Node ids: Compiler generated integer ids
- Metadata ids: Stable between incremental builds

## Folder Rules
Only the compiler writes into /generated.
Developers must never edit generated files.

## Compiler Rules
- Every stage has a single responsibility.
- Stages communicate through immutable models.
- No stage modifies previous stage output.
- Diagnostics are accumulated, never thrown.
- **No TypeScript parsing**: Only parse Soft syntax
- **No type inference**: TypeScript handles type checking
- **Generate valid TypeScript**: Output must be valid TypeScript

## Runtime Rules
- Runtime never parses templates.
- Runtime never parses expressions.
- Runtime never scans assemblies/files.
- Runtime executes generated metadata only.
- **Runtime is not a framework**: It's a lightweight execution engine

## Dependency Rules
Dependency Graph is immutable after compilation.
Runtime only traverses it.

## Error Rules
Compiler errors are recoverable whenever possible.
Runtime errors flow through ErrorPipeline.

## Threading
Compilation may be parallel.
Runtime UI updates are serialized.
