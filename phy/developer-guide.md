Soft is optimized for Human Developers and AI Agents equally.
# Developer Guide

## Core Philosophy

Soft is a **source-to-source compiler** (transpiler):
- Transforms `.s` files to valid TypeScript
- TypeScript compiler handles type checking and JavaScript generation
- Soft never generates JavaScript directly
- Never edit generated TypeScript files

## Commands

soft new
soft dev
soft watch
soft build
soft clean

## Structure

src/
generated/
public/

## Workflow

Edit .s
↓
soft dev
↓
Generated TS
↓
TypeScript Compiler (tsc)
↓
JavaScript
↓
Browser
