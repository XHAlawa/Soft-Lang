/**
 * Forms Observer Integration
 * Subscribes to Core Observer for property changes.
 * Triggers validation, dirty tracking, and state updates.
 */

import { observer } from '../../core/observer/index';
import { getMetadata } from './metadata';
import { markDirty } from '../state/dirty';
import { markTouched } from '../state/touched';
import { validate } from './metadata';
import { addError, clearErrors } from '../state/errors';

export function initializeObserver(): void {
  observer.subscribe((target: any, prop: string, value: any) => {
    const metadata = getMetadata(target);
    if (!metadata) return;

    // Check if this property is tracked by Forms
    if (!metadata.validators.has(prop)) return;

    // Mark dirty
    const oldValue = metadata.snapshot.get(prop);
    if (oldValue !== value) {
      markDirty(target, prop);
    }

    // Validate based on trigger
    const trigger = metadata.validatorTriggers.get(prop) || 'blur';
    if (trigger === 'input') {
      validate(target, prop, value, target, trigger);
    }
  });
}
