/**
 * Field State API
 * Provides computed field state properties.
 */

import { getMetadata } from './core/metadata';
import { isDirty } from './state/dirty';
import { isTouched } from './state/touched';
import { isPending } from './state/pending';
import { hasErrors, getErrors } from './state/errors';
import { ValidationError } from './types';

export class FieldState {
  constructor(private form: any, private property: string) {}

  get $valid(): boolean {
    return !this.$invalid;
  }

  get $invalid(): boolean {
    return this.$hasErrors;
  }

  get $dirty(): boolean {
    return isDirty(this.form, this.property);
  }

  get $touched(): boolean {
    return isTouched(this.form, this.property);
  }

  get $pending(): boolean {
    return isPending(this.form, this.property);
  }

  get $errors(): ValidationError[] {
    return getErrors(this.form, this.property);
  }

  get $hasErrors(): boolean {
    return hasErrors(this.form, this.property);
  }

  get $focused(): boolean {
    const metadata = getMetadata(this.form);
    if (!metadata) return false;
    return metadata.focused === this.property;
  }

  reset(): void {
    const metadata = getMetadata(this.form);
    if (!metadata) return;

    // Restore value from snapshot
    const snapshotValue = metadata.snapshot.get(this.property);
    if (snapshotValue !== undefined) {
      (this.form as any)[this.property] = snapshotValue;
    }

    // Clear state
    metadata.dirty.delete(this.property);
    metadata.touched.delete(this.property);
    metadata.pending.delete(this.property);
    metadata.errors.delete(this.property);
    if (metadata.focused === this.property) {
      metadata.focused = '';
    }
  }
}

export function getFieldState(form: any, property: string): FieldState {
  return new FieldState(form, property);
}
