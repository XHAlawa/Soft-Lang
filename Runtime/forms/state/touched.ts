import { getMetadata } from '../core/metadata';

export function markTouched(target: object, property: string): void {
  const metadata = getMetadata(target);
  if (!metadata) return;
  metadata.touched.add(property);
}

export function clearTouched(target: object, property?: string): void {
  const metadata = getMetadata(target);
  if (!metadata) return;

  if (property) {
    metadata.touched.delete(property);
  } else {
    metadata.touched.clear();
  }
}

export function isTouched(target: object, property?: string): boolean {
  const metadata = getMetadata(target);
  if (!metadata) return false;

  if (property) {
    return metadata.touched.has(property);
  }

  return metadata.touched.size > 0;
}
