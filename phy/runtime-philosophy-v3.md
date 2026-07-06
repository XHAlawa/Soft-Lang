Soft is optimized for Human Developers and AI Agents equally.
# Soft Runtime Philosophy v3
Version: 3.0
Status: Architecture Contract


# Mission

- Soft is a language that targets TypeScript.
- Soft minimizes framework concepts and maximizes business code.
- The compiler owns infrastructure.
- The runtime executes metadata only.
- The developer should feel like writing plain TypeScript.


# Architecture Principles

- Business First
- Compiler First
- TypeScript First
- HTML is HTML
- CSS is CSS
- Convention over Configuration
- Compile-time over Runtime
- Deterministic Output
- Zero Manual Bootstrap
- Automatic Dependency Discovery
- Strong Typing Everywhere
- Minimal Runtime
- Direct DOM Updates
- No Hidden APIs
- Generated Code is Disposable


# Ownership


| Responsibility | Owner |
|---|---|
| Parsing | Compiler |
| Semantic Analysis | Compiler |
| Binder | Compiler |
| Dependency Graph | Compiler |
| Route Discovery | Compiler |
| Bootstrap Generation | Compiler |
| TypeScript Emission | Compiler |
| Type Checking | Official TypeScript Compiler |
| JavaScript Generation | Official TypeScript Compiler |
| Runtime Execution | Runtime |
| DOM Updates | Runtime |
| Lifecycle | Runtime |
| Event Dispatch | Runtime |

# Bootstrap Philosophy

- The developer never instantiates pages.
- The developer never registers routes.
- The developer never calls render().
- soft dev is the only entry point.
- The compiler generates ApplicationManifest automatically.
- The runtime starts from generated metadata.


# Reactive Model

- Every business object is state.
- Every state object becomes a compiler-generated Proxy.
- Developers never call signal(), ref(), reactive(), observable() or makeObservable().
- Setter interception is the only origin of UI updates.
- Arrays and collections are intercepted.
- onChange is compiler-generated.


Example

```ts
customer.name = "Ahmed";
```

Pipeline

Setter
↓
Proxy
↓
Change Dispatcher
↓
onChange callbacks
↓
Dependency Graph
↓
Rendering Engine
↓
DOM Patch

# Dependency Graph

- Generated entirely at compile time.
- Maps symbols directly to DOM operations.
- No runtime expression parsing.
- No runtime dependency discovery.
- No tree diff.


# Rendering Rules

- No Virtual DOM.
- No Fiber.
- No Dirty Checking.
- No Full Component Re-render.
- Only affected DOM nodes are updated.
- DOM references are cached.


# Component Lifecycle

- OnInit
- OnBeforeRender
- OnAfterRender
- OnDestroy
- Lifecycle wiring is compiler generated.


# Routing

- Every executable page must have @Page.
- Missing @Page means the file is not routable.
- Compiler builds routing table.
- Runtime navigates only.


# Generated Project


src/
    App.s
    Todo.s
generated/
    App.ts
    Todo.ts
dist/

# Mandatory Rules

1. If a concern can move from runtime to compile-time, move it. The developer should never write infrastructure code.
100. If a concern can move from runtime to compile-time, move it. The developer should never write infrastructure code.

# Anti Patterns

- Manual render().
- Manual bootstrap.
- Manual route registration.
- Manual state notification.
- Framework stores.
- Runtime template parsing.
- Runtime expression parsing.
- Global mutable singletons.


# Success Criteria

- A Todo application is written only in .s files.
- No handwritten TypeScript application logic.
- The generated TypeScript compiles with the official TypeScript compiler.
- The runtime updates only affected DOM nodes.
- The developer thinks about business, not framework internals.

