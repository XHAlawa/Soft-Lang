# Runtime Architecture

## Folder Responsibilities

### core/
**Infrastructure only.** Core provides the foundational building blocks for all Runtime modules.

- **proxy/** - Reactive proxy wrapping for object state changes
- **observer/** - Change notification and dependency tracking
- **events/** - Event dispatch and subscription system
- **scheduler/** - Task scheduling and microtask management
- **object/** - Generic object and array utilities (nested traversal, array helpers)

**Core depends on nothing.** Every Runtime module depends on Core.

### forms/
**Forms business logic only.** No generic utilities or infrastructure.

- **core/** - Form metadata and lifecycle
- **validation/** - Validation rules, builders, and triggers
- **state/** - Dirty, touched, pending, error state management
- **builtins/** - Pre-built validators

### binding/
**DOM adapters only.** Translates DOM events to Runtime events.

- No validation
- No renderer logic
- No business logic

### renderer/
**Rendering logic only.** DOM manipulation and patching.

- No validation
- No forms
- No business rules

### localization/
**Runtime Service.** Every Runtime module consumes it.

- No module owns localization
- Localization is a shared service

### store/
**State management only.** Consumes Core infrastructure.

- Consumes Core Proxy
- Consumes Core Observer
- Consumes Core Events
- Implements no infrastructure

### router/
**Runtime Service.** Navigation and routing.

- Follows Runtime Service philosophy
- Consumes Core infrastructure

### dialog/
**Runtime Service.** Dialog management.

- Follows Runtime Service philosophy
- Consumes Core infrastructure

### http/
**Runtime Service.** HTTP client.

- Follows Runtime Service philosophy
- Consumes Core infrastructure

### types/
**Shared type definitions.**

## Dependency Rules

1. **Core depends on nothing.**
2. **Everything depends on Core.**
3. **Runtime Services (Forms, Store, Router, Dialog, Http) depend on Core only.**
4. **No circular dependencies.**
5. **Infrastructure never depends on business logic.**

## Naming Rules

- **Infrastructure** uses lowercase: `proxy.ts`, `observer.ts`
- **Services** use lowercase: `store.ts`, `router.ts`
- **Business logic** uses lowercase: `validation.ts`, `metadata.ts`
- **Types** use PascalCase: `ValidationError`, `FormMetadata`

## Ownership Rules

1. **Core owns infrastructure.** No other module may implement infrastructure.
2. **Forms owns Forms business logic.** No generic utilities.
3. **Binding owns DOM adapters.** No validation or renderer logic.
4. **Renderer owns rendering logic.** No forms or business rules.
5. **Localization is a Runtime Service.** Every module consumes it.
6. **Store owns state management.** Consumes Core infrastructure only.
7. **Router, Dialog, Http follow Runtime Service philosophy.**

## Runtime Service Philosophy

A Runtime Service:

1. **Consumes Core infrastructure only.**
2. **Implements business logic for its domain.**
3. **Never implements generic infrastructure.**
4. **Never depends on other Runtime Services.**
5. **Exposes a clean public API.**

## Core Philosophy

Core is the foundation:

1. **Core depends on nothing.**
2. **Core provides infrastructure only.**
3. **Core never implements business logic.**
4. **Core is reusable across all Runtime modules.**
5. **Core is stable and minimal.**

## Runtime Constitution

This document is the Runtime Constitution. Every future Runtime module must follow it.

- **Infrastructure belongs in Core.**
- **Business logic belongs in Services.**
- **No duplication of infrastructure.**
- **No duplication of utilities.**
- **Clear ownership of every capability.**
- **Respect dependency rules.**
