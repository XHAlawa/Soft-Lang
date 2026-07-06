Soft is optimized for Human Developers and AI Agents equally.
# runtime-execution-model.md
# Soft Runtime Execution Model
Version: 1.0

> This document explains exactly how a Soft application executes from the moment the developer runs `soft dev` until a property change updates the DOM.

# 1. High Level Pipeline

Developer
    ↓
soft dev
    ↓
Soft Compiler
    ↓
Scan *.s files
    ↓
Lexer
    ↓
Parser
    ↓
Green Tree
    ↓
Red Tree
    ↓
Semantic Model
    ↓
Binder
    ↓
Dependency Analyzer
    ↓
Soft IR
    ↓
TypeScript Emitter
    ↓
generated/*.ts
    ↓
Official TypeScript Compiler
    ↓
JavaScript
    ↓
Browser
    ↓
Soft Runtime
    ↓
Application Starts

# 2. Compiler Output

The compiler MUST generate:

- ApplicationManifest
- Route Table
- Service Registry
- Component Metadata
- Dependency Graph
- Render Metadata
- Bootstrap File
- Generated TypeScript

The runtime MUST NEVER discover these dynamically.

# 3. Application Startup

Browser loads generated bootstrap.

Bootstrap creates Runtime.

Runtime loads ApplicationManifest.

Runtime registers:
- Routes
- Components
- Services

Runtime navigates to current URL.

Runtime instantiates the matching @Page.

Developer never creates pages manually.

# 4. Page Creation

Compiler generated code performs:

Resolve constructor services
↓
Create page instance
↓
Wrap page with generated Proxy
↓
Run OnInit
↓
Create DOM
↓
Register DOM Nodes
↓
Bind Dependency Graph
↓
Run OnAfterRender

# 5. Component Creation

Components follow exactly the same lifecycle.

Parent never manually creates child components.

Compiler generates creation metadata.

# 6. State Model

Business objects ARE state.

Example:

class Customer {
    name=""
    age=0
}

Compiler wraps every state object.

No manual APIs.

# 7. Proxy Model

Compiler generates:

SoftReactive.wrap(instance)

Developer never sees this.

Every property setter is intercepted.

Every collection mutation is intercepted.

# 8. Change Pipeline

customer.name = "Ahmed"

↓

Proxy

↓

Change Dispatcher

↓

Execute user onChange callbacks

↓

Dependency Graph lookup

↓

Render Queue

↓

DOM Patch

↓

Done

# 9. onChange

Generated API:

customer.onChange(...)
customer.name.onChange(...)

Callbacks are strongly typed.

stopHere() prevents remaining subscribers.

stopUIRender() skips DOM update.

# 10. Dependency Graph

Generated at compile time.

Example:

customer.name

↓

TextNode #12

Input.value #30

Title #44

Runtime never evaluates expressions.

# 11. Rendering

No Virtual DOM.

No diffing.

No reconciliation.

Runtime already knows every affected DOM node.

Update only those nodes.

# 12. DOM Registry

Runtime stores references for generated nodes.

Never query the DOM repeatedly.

# 13. Event Flow

DOM Event
↓

Generated Event Dispatcher
↓

Component Method
↓

Property Change
↓

Proxy
↓

Renderer

# 14. Routing

Compiler discovers @Page.

Runtime only navigates.

# 15. Services

Compiler generates registrations.

Runtime resolves constructors only.

# 16. Error Flow

try/catch
↓

Method Error
↓

Class Error
↓

Global Error

# 17. Runtime Restrictions

Forbidden:

- HTML parsing
- TypeScript parsing
- Reflection discovery
- Dependency discovery
- Manual render()
- Manual bootstrap()
- Manual route registration

# 18. Runtime Goals

- Tiny runtime
- Predictable execution
- Direct DOM updates
- Strong typing
- Zero business boilerplate

# 19. Golden Rule

The compiler thinks.

The runtime executes.

The developer writes business logic.

Nothing else.
