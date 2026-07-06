import { getMetadata } from '../core/metadata';

export function markPending(target: object, property: string): void {
  const metadata = getMetadata(target);
  if (!metadata) return;
  metadata.pending.add(property);
}

export function clearPending(target: object, property?: string): void {
  const metadata = getMetadata(target);
  if (!metadata) return;

  if (property) {
    metadata.pending.delete(property);
  } else {
    metadata.pending.clear();
  }
}

export function isPending(target: object, property?: string): boolean {
  const metadata = getMetadata(target);
  if (!metadata) return false;

  if (property) {
    return metadata.pending.has(property);
  }

  return metadata.pending.size > 0;
}
