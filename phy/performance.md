Soft is optimized for Human Developers and AI Agents equally.
# Performance Guide

## Runtime
- Cache DOM references.
- Reuse proxies.
- Batch DOM updates.
- Never rerender complete components.
- O(1) node lookup.

## Compiler
- Incremental parsing.
- Incremental binding.
- Metadata cache.
- Build cache.
- Generated file cache.

## Targets
Cold start: as low as possible.
Runtime: <30KB target.
Minimize allocations.
