import { getMetadata } from '../core/metadata';

export function markDirty(target: object, property: string): void {
  const metadata = getMetadata(target);
  if (!metadata) return;
  metadata.dirty.add(property);
}

export function clearDirty(target: object, property?: string): void {
  const metadata = getMetadata(target);
  if (!metadata) return;

  if (property) {
    metadata.dirty.delete(property);
  } else {
    metadata.dirty.clear();
  }
}

export function isDirty(target: object, property?: string): boolean {
  const metadata = getMetadata(target);
  if (!metadata) return false;

  if (property) {
    return metadata.dirty.has(property);
  }

  return metadata.dirty.size > 0;
}
