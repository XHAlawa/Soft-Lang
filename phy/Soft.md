# STOP.

We have reached an important conclusion.

The problem is NOT the Forms Runtime.

The problem is NOT the API.

The problem is the abstraction level.

We are trying to design a Language feature while thinking like a TypeScript library.

That is incorrect.

---

# New Direction

Stop thinking about Forms.

Stop thinking about Validation.

Stop thinking about Runtime APIs.

The next task is much more fundamental.

Design the **Soft Reactive Runtime**.

Forms will simply become one runtime library built on top of it.

Exactly the same as:

- Store
- Grid
- Workflow
- Animation
- DevTools
- State Machine
- Future Runtime Libraries

The runtime must never know anything about Forms.

---

# Mission

Design the runtime as if Forms does not exist.

Forget validation.

Forget dirty.

Forget touched.

Forget errors.

Forget submit.

Forget reset.

Those are Forms responsibilities.

The runtime should expose only generic reactive primitives.

Nothing Forms-specific.

---

# Think Like a Language Architect

Do NOT copy:

- Angular Signals
- Vue Reactivity
- MobX
- Knockout
- React
- Solid
- Svelte

Use them only as inspiration.

We are designing a completely new runtime.

---

# Start From Zero

Imagine Soft has only this:

```soft
@State
user: User
```

Nothing else exists.

Design the runtime that makes every future runtime library possible.

---

# Deliverables

Produce a complete architecture document for the Soft Reactive Runtime.

Cover at minimum:

## 1. Runtime Philosophy

What is the responsibility of the runtime?

What is NOT its responsibility?

---

## 2. Object Model

How are objects represented?

How are nested objects represented?

How are arrays represented?

How are primitive values represented?

---

## 3. Reactivity

How are changes detected?

How are observers registered?

How are observers removed?

How are notifications propagated?

How are infinite loops prevented?

---

## 4. Observer System

Design a generic observer API.

It must work for:

- Renderer
- Forms
- Store
- Workflow
- DevTools
- Animation
- Future runtime libraries

No Forms-specific logic.

---

## 5. Lifetime

How are runtime objects created?

How are they disposed?

How is memory reclaimed?

How are subscriptions cleaned?

---

## 6. Performance

Allocation strategy.

Lookup complexity.

Memory model.

Garbage collection considerations.

Large object graphs.

Large arrays.

Deep nesting.

---

## 7. Public Runtime API

List ONLY the public runtime APIs.

Challenge every API.

Keep the runtime as small as possible.

---

## 8. Internal Architecture

Describe internal components.

Describe their responsibilities.

Describe how they communicate.

No implementation.

Architecture only.

---

## 9. Responsibility Matrix

Clearly separate responsibilities between:

- Compiler
- Core Runtime
- Binding Layer
- Forms
- Store
- Router
- Renderer
- Future Runtime Libraries

No duplicated responsibilities.

---

## 10. Stress Test

Validate the architecture against:

- 1 million properties
- Large arrays
- Deep object graphs
- Long-running SPA
- Frequent updates
- Dynamic object creation
- Dynamic property deletion
- Massive observer counts

---

## 11. Extensibility

Can a completely new runtime library be built without modifying the Core Runtime?

If the answer is NO,

the architecture is wrong.

---

# Final Goal

The Core Runtime must become a tiny, generic, high-performance reactive engine.

Forms must become only a consumer.

The Store must become only a consumer.

The Renderer must become only a consumer.

The Core Runtime must not know that Forms exists.

The Core Runtime must not know that validation exists.

The Core Runtime must not know that HTML exists.

The Core Runtime must not know that routing exists.

The Core Runtime must expose only generic reactive capabilities.

Nothing more.

Do NOT write implementation.

Do NOT write TypeScript.

Do NOT propose APIs immediately.

Think first.

Return a complete architecture specification only.