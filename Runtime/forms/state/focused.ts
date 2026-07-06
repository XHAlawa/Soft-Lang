/**
 * Focused State
 * Tracks which field is currently focused.
 */

import { getMetadata } from '../core/metadata';

export function markFocused(target: object, property: string): void {
  const metadata = getMetadata(target);
  if (!metadata) return;
  metadata.focused = property;
}

export function clearFocused(target: object): void {
  const metadata = getMetadata(target);
  if (!metadata) return;
  metadata.focused = '';
}

export function isFocused(target: object, property: string): boolean {
  const metadata = getMetadata(target);
  if (!metadata) return false;
  return metadata.focused === property;
}
