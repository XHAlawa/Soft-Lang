# Soft Forms Runtime

## Philosophy

Soft Forms is a production-ready form validation and state management library built on top of the Soft Reactive Runtime. It provides form-specific capabilities without owning reactivity, object proxies, or property observation.

Forms is NOT:
- A reactive system
- A state manager
- A proxy engine
- A transport layer
- A rendering system
- A DOM patching system

Forms IS:
- A validation runtime
- A form state manager (dirty, touched, pending, errors, focused)
- A submission pipeline
- A reset pipeline
- A metadata consumer of Core Runtime

---

## Core Principle

**Single Source of Truth**

The business object is the single source of truth. Forms never modifies the business object. Forms never wraps the business object. Forms never duplicates business values. Forms only attaches metadata via WeakMap.

---

## Folder Structure

```
Runtime/forms/
├── binding.ts           # HTML element binding API
├── field.ts             # Field state API ($field.xxx)
├── form.ts              # Form state API ($form.xxx)
├── index.ts             # Public API exports
├── types.ts             # Core types
├── builtins/            # Built-in validators
│   ├── required.ts
│   ├── email.ts
│   ├── phone.ts
│   ├── url.ts
│   ├── guid.ts
│   ├── number.ts
│   ├── string.ts
│   ├── compare.ts
│   └── custom.ts
├── core/                # Core metadata management
│   ├── metadata.ts      # WeakMap storage, validation pipeline
│   └── observer.ts      # Core Runtime observer integration
├── state/               # State management helpers
│   ├── dirty.ts
│   ├── touched.ts
│   ├── pending.ts
│   ├── errors.ts
│   └── focused.ts
└── validation/          # Validation builder
    └── builder.ts
```

---

## Runtime Responsibilities

Forms owns ONLY:
- Validation execution
- Validation registration
- Validation removal
- Error storage
- Dirty state tracking
- Touched state tracking
- Pending state tracking
- Focused state tracking
- Submit pipeline
- Reset pipeline
- WeakMap metadata storage
- Observer subscription (to Core Runtime)

Forms does NOT own:
- Rendering
- DOM patching
- Observer infrastructure
- Proxy
- Scheduler
- Compiler logic
- HTTP
- Routing

---

## Public API

### Core Functions

```typescript
// Lifecycle
forms.create(target, data)
forms.destroy(target)

// Validation
forms.validate(target, property, value, form, trigger?)
forms.validateForm(target, data)
forms.addValidation(target, property, builder, trigger?)
forms.removeValidation(target, property, validator)
forms.addFormValidation(target, validator)
forms.removeFormValidation(target, validator)
```

### State Functions

```typescript
// Dirty
forms.markDirty(target, property)
forms.clearDirty(target, property)
forms.isDirty(target, property?)

// Touched
forms.markTouched(target, property)
forms.clearTouched(target, property)
forms.isTouched(target, property?)

// Pending
forms.markPending(target, property)
forms.clearPending(target, property)
forms.isPending(target, property?)

// Errors
forms.addError(target, property, error)
forms.getErrors(target, property?)
forms.clearErrors(target, property?)
forms.hasErrors(target, property?)

// Focused
forms.markFocused(target, property)
forms.clearFocused(target)
forms.isFocused(target, property)
```

### Field State API

```typescript
const field = forms.getFieldState(form, 'name');

field.$valid      // boolean
field.$invalid    // boolean
field.$dirty      // boolean
field.$touched    // boolean
field.$pending    // boolean
field.$errors     // ValidationError[]
field.$hasErrors  // boolean
field.$focused    // boolean

field.reset()
```

### Form State API

```typescript
const formState = forms.getFormState(form);

formState.$valid       // boolean
formState.$invalid     // boolean
formState.$dirty       // boolean
formState.$pending     // boolean
formState.$hasErrors   // boolean
formState.$errors      // ValidationError[]
formState.$submitting  // boolean
formState.$submitted   // boolean

formState.submit(handler)
formState.reset()
```

### Binding API

```typescript
forms.bind(element, form, property)
forms.unbind(element)
```

### Observer Integration

```typescript
forms.initializeObserver()
```

### Types

```typescript
type Validator = (value: any, context: ValidationContext) => ValidationResult | Promise<ValidationResult>
type ValidationTrigger = 'input' | 'change' | 'blur' | 'submit' | 'manual'
type ValidationError = { code: string, message: string }
type ValidationResult = { valid: boolean, errors: ValidationError[] }
type ValidationContext = { target: any, property: string, form: any }
type SubmitResult = { success: boolean, data?: any, error?: any }
interface ValidationBuilder { ... }
```

---

## Validation Flow

### Field Validation

1. User triggers validation (input, blur, submit, manual)
2. `validate(target, property, value, form, trigger)` is called
3. Trigger check: if trigger doesn't match field's trigger, skip
4. Async validation ID generated (for cancellation)
5. Validators execute sequentially
6. After each validator, check if validation ID is still current
7. If superseded by newer validation, abort
8. Collect errors
9. Update metadata with errors
10. Clear pending state

### Form Validation

1. `validateForm(target, data)` is called
2. Iterate over all properties with validators
3. Call `validate()` for each property
4. Execute form-level validators
5. Collect all errors
6. Return combined result

### Async Validation

- Latest request wins: each validation gets a unique ID
- If a new validation starts, previous validation's ID is invalidated
- Superseded validations return early without updating state
- No UI blocking: async validators run in background
- Pending state tracks which fields are validating

---

## Binding Flow

### Initialization

1. `bind(element, form, property)` called
2. Clean up existing binding
3. Get form metadata
4. Initialize element value from field
5. Bind input event (user typing → field)
6. Bind focus event (markFocused)
7. Bind blur event (markTouched + validate)
8. Bind Core Observer (programmatic changes → element)

### User Typing

1. User types in input
2. Input event fires
3. Field value updated via Proxy
4. Core Observer notified
5. Forms Observer handler triggered
6. Mark dirty
7. If trigger is 'input', validate

### Programmatic Change

1. Field value changed programmatically
2. Core Observer notified
3. Forms Observer handler triggered
4. Mark dirty
5. If trigger is 'input', validate
6. Element updated (if not focused)

---

## Async Validation Flow

1. Validation starts
2. Generate unique validation ID
3. Store ID in metadata
4. Mark field as pending
5. Execute async validator
6. After completion, check if ID is still current
7. If current: update errors, clear pending
8. If superseded: discard result, do nothing

---

## Ownership

### Forms Runtime
- Validation logic
- Error storage
- State tracking (dirty, touched, pending, focused)
- Submit/Reset logic
- WeakMap metadata

### Core Runtime
- Proxy creation
- Observer infrastructure
- Change notifications
- Dependency tracking

### Binding Layer
- DOM event listeners
- Element synchronization
- Focus/blur reporting

### Compiler
- Metadata generation
- Validation registration
- Trigger configuration

---

## Design Principles

1. **Single Source of Truth**: Business object is the truth. Forms only attaches metadata.
2. **No Wrapping**: Forms never wraps or modifies the business object.
3. **WeakMap Storage**: Automatic garbage collection, no memory leaks.
4. **Explicit Validation**: Validation runs only when triggered.
5. **Trigger-Based**: Validation triggers control when validators run.
6. **Async-Safe**: Latest request wins, no UI blocking.
7. **O(1) Lookup**: WeakMap provides constant-time metadata access.
8. **No Allocations During Typing**: Reuse existing structures.
9. **Singleton Validators**: Built-in validators are singletons.
10. **Consumer of Core**: Forms consumes Core Runtime, doesn't own it.

---

## Performance

- **O(1) metadata lookup**: WeakMap provides constant-time access
- **No allocations during typing**: Reuse existing Sets/Maps
- **Singleton validators**: Built-in validators are reused
- **No duplicated subscriptions**: Single Core Observer subscription
- **No duplicated metadata**: Single WeakMap per form
- **No memory leaks**: WeakMap + explicit cleanup
- **WeakMap cleanup**: Automatic on garbage collection

---

## Final Status

✅ FORMS RUNTIME CLOSED

All features implemented, dead code removed, API frozen, architecture verified.
