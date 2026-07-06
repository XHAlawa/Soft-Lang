Soft is optimized for Human Developers and AI Agents equally.
# Metadata Format Specification

## ApplicationManifest

Contains

- Pages
- Components
- Services
- Routes
- Dependency Graph Id
- Runtime Version

---

## Component Metadata

Id

Type

TemplateId

Lifecycle

Service Dependencies

DOM Root

---

## Dependency Metadata

Source Symbol

↓

Target DOM Node

↓

Operation

↓

Priority

---

## Render Operations

UpdateText

UpdateValue

UpdateAttribute

UpdateStyle

UpdateClass

InsertNode

RemoveNode

ReplaceNode

ToggleVisibility

---

## DOM Metadata

NodeId

ParentId

Children

Kind

Flags

---

## Route Metadata

Path

ComponentId

Guards

Parameters

---

## Extension Metadata

Extension Type

Arguments

Stage

Target Node

---

## Serialization

Metadata should support

JSON (Debug)

Binary (Production)

The runtime consumes both through the same abstraction.
