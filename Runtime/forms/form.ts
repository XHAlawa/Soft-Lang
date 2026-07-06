/**
 * Form State API
 * Provides computed form state properties.
 */

import { getMetadata } from './core/metadata';
import { isDirty } from './state/dirty';
import { isTouched } from './state/touched';
import { isPending } from './state/pending';
import { hasErrors, getErrors, clearErrors } from './state/errors';
import { validateForm } from './core/metadata';
import { ValidationError } from './types';

export class FormState {
  constructor(private form: any) {}

  get $valid(): boolean {
    return !this.$invalid;
  }

  get $invalid(): boolean {
    return this.$hasErrors;
  }

  get $dirty(): boolean {
    return isDirty(this.form);
  }

  get $pending(): boolean {
    return isPending(this.form);
  }

  get $hasErrors(): boolean {
    return hasErrors(this.form);
  }

  get $errors(): ValidationError[] {
    return getErrors(this.form);
  }

  get $submitting(): boolean {
    const metadata = getMetadata(this.form);
    if (!metadata) return false;
    return metadata.pendingSubmit;
  }

  get $submitted(): boolean {
    const metadata = getMetadata(this.form);
    if (!metadata) return false;
    return metadata.submitted;
  }

  async submit(handler: (data: any) => Promise<any>): Promise<any> {
    const metadata = getMetadata(this.form);
    if (!metadata) {
      throw new Error('Form not initialized');
    }

    if (metadata.pendingSubmit) {
      throw new Error('Form is already submitting');
    }

    // Set flag IMMEDIATELY before any await to prevent double-submit
    metadata.pendingSubmit = true;

    // Validate AFTER setting flag
    const validationResult = await validateForm(this.form, this.form);
    if (!validationResult.valid) {
      metadata.pendingSubmit = false;  // Reset on validation failure
      return { success: false, errors: validationResult.errors };
    }

    try {
      const result = await handler(this.form);
      metadata.submitted = true;
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      metadata.pendingSubmit = false;
    }
  }

  reset(): void {
    const metadata = getMetadata(this.form);
    if (!metadata) return;

    // Restore all values from snapshot
    for (const [property, value] of metadata.snapshot) {
      (this.form as any)[property] = value;
    }

    // Clear all state
    metadata.dirty.clear();
    metadata.touched.clear();
    metadata.pending.clear();
    metadata.errors.clear();
    metadata.focused = '';
    metadata.submitted = false;
    
    // Re-validate after reset
    queueMicrotask(() => {
      validateForm(this.form, this.form);
    });
  }
}

export function getFormState(form: any): FormState {
  return new FormState(form);
}
