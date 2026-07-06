/**
 * Forms Binding API
 * Binds HTML elements to Forms fields with automatic synchronization.
 */

import { getMetadata } from './core/metadata';
import { markTouched, isTouched } from './state/touched';
import { markFocused, clearFocused } from './state/focused';
import { validate } from './core/metadata';
import { observer } from '../core/observer/index';

interface FieldBinding {
  element: HTMLElement;
  form: any;
  property: string;
  subscriptions: SimpleSubscription[];
}

interface SimpleSubscription {
  dispose(): void;
}

const bindings = new WeakMap<HTMLElement, FieldBinding>();

/**
 * Bind an HTML element to a Forms field.
 * 
 * Responsibilities:
 * 1. Initialize element value from field
 * 2. Listen to user typing (input → field)
 * 3. Listen to focus (markFocused)
 * 4. Listen to blur (markTouched + validate)
 * 5. Sync element when field changes programmatically
 * 6. Update internal Forms state on validation changes
 * 
 * @param element - HTML element (input, textarea, select)
 * @param form - Forms instance
 * @param property - Field name
 */
export function bind(element: HTMLElement, form: any, property: string): void {
  // Clean up existing binding
  unbind(element);

  const metadata = getMetadata(form);
  if (!metadata) {
    console.warn(`Forms binding: No metadata found for form object`);
    return;
  }

  const binding: FieldBinding = {
    element,
    form,
    property,
    subscriptions: []
  };

  // 1. Initialize element value from field
  initializeElement(element, form, property);

  // 2. Listen to user typing (input → field)
  const inputSubscription = bindInput(element, form, property);
  if (inputSubscription) binding.subscriptions.push(inputSubscription);

  // 3. Listen to focus (markFocused)
  const focusSubscription = bindFocus(element, form, property);
  if (focusSubscription) binding.subscriptions.push(focusSubscription);

  // 4. Listen to blur (markTouched + validate)
  const blurSubscription = bindBlur(element, form, property);
  if (blurSubscription) binding.subscriptions.push(blurSubscription);

  // 5. Sync element when field changes programmatically
  const changeSubscription = bindFieldChange(element, form, property);
  if (changeSubscription) binding.subscriptions.push(changeSubscription);

  bindings.set(element, binding);
}

/**
 * Unbind an element from its Forms field.
 */
export function unbind(element: HTMLElement): void {
  const binding = bindings.get(element);
  if (binding) {
    // Dispose all subscriptions
    for (const sub of binding.subscriptions) {
      sub.dispose();
    }
    bindings.delete(element);
  }
}

/**
 * Initialize element value from field.
 */
function initializeElement(element: HTMLElement, form: any, property: string): void {
  const value = (form as any)[property];
  
  if (element instanceof HTMLInputElement) {
    if (element.type === 'checkbox' || element.type === 'radio') {
      element.checked = Boolean(value);
    } else {
      element.value = String(value ?? '');
    }
  } else if (element instanceof HTMLTextAreaElement) {
    element.value = String(value ?? '');
  } else if (element instanceof HTMLSelectElement) {
    element.value = String(value ?? '');
  }
}

/**
 * Bind input event (user typing → field).
 */
function bindInput(element: HTMLElement, form: any, property: string): SimpleSubscription | null {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    const handler = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      (form as any)[property] = target.value;
    };
    element.addEventListener('input', handler);
    
    return {
      dispose: () => element.removeEventListener('input', handler)
    };
  } else if (element instanceof HTMLSelectElement) {
    const handler = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      (form as any)[property] = target.value;
    };
    element.addEventListener('change', handler);
    
    return {
      dispose: () => element.removeEventListener('change', handler)
    };
  }
  
  return null;
}

/**
 * Bind focus event (markFocused).
 */
function bindFocus(element: HTMLElement, form: any, property: string): SimpleSubscription | null {
  const handler = () => {
    markFocused(form, property);
  };
  element.addEventListener('focus', handler);
  
  return {
    dispose: () => element.removeEventListener('focus', handler)
  };
}

/**
 * Bind blur event (markTouched + validate).
 */
function bindBlur(element: HTMLElement, form: any, property: string): SimpleSubscription | null {
  const handler = () => {
    clearFocused(form);
    markTouched(form, property);
    validate(form, property, (form as any)[property], form, 'blur');
  };
  element.addEventListener('blur', handler);
  
  return {
    dispose: () => element.removeEventListener('blur', handler)
  };
}

/**
 * Bind field change (field → element synchronization).
 * Subscribes to Core Observer to detect programmatic changes.
 */
function bindFieldChange(element: HTMLElement, form: any, property: string): SimpleSubscription {
  const unsubscribe = observer.subscribe((target: any, prop: string, value: any) => {
    if (target === form && prop === property) {
      // Only update if not currently focused (to avoid cursor issues)
      if (document.activeElement !== element) {
        if (element instanceof HTMLInputElement) {
          element.value = String(value ?? '');
        } else if (element instanceof HTMLTextAreaElement) {
          element.value = String(value ?? '');
        } else if (element instanceof HTMLSelectElement) {
          element.value = String(value ?? '');
        }
      }
    }
  });

  return {
    dispose: unsubscribe
  };
}
