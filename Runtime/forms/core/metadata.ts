import { Validator, ValidationError, ValidationResult, SubmitResult, ValidationContext, ValidationBuilder, ValidationTrigger } from '../types';
import { validationBuilder } from '../validation/builder';

interface FormMetadata {
  validators: Map<string, Set<Validator>>;
  formValidators: Set<Validator>;
  validatorTriggers: Map<string, ValidationTrigger>;
  errors: Map<string, ValidationError[]>;
  dirty: Set<string>;
  touched: Set<string>;
  pending: Set<string>;
  focused: string;
  snapshot: Map<string, any>;
  pendingSubmit: boolean;
  submitted: boolean;
  asyncValidationIds: Map<string, number>;
}

const store = new WeakMap<object, FormMetadata>();

export function getMetadata(target: object): FormMetadata | undefined {
  return store.get(target);
}

function getValue(data: object, property: string): any {
  return (data as any)[property];
}

export function create(target: object, data: object): void {
  if (!store.has(target)) {
    const snapshot = new Map<string, any>();
    for (const key in data) {
      snapshot.set(key, getValue(data, key));
    }

    const metadata: FormMetadata = {
      validators: new Map(),
      formValidators: new Set(),
      validatorTriggers: new Map(),
      errors: new Map(),
      dirty: new Set(),
      touched: new Set(),
      pending: new Set(),
      focused: '',
      snapshot: snapshot,
      pendingSubmit: false,
      submitted: false,
      asyncValidationIds: new Map()
    };
    store.set(target, metadata);
  }
}

export function destroy(target: object): void {
  store.delete(target);
}

export function addValidation(target: object, property: string, builder: (v: ValidationBuilder) => Validator[], trigger: ValidationTrigger = 'blur'): void {
  const metadata = store.get(target);
  if (!metadata) return;

  if (!metadata.validators.has(property)) {
    metadata.validators.set(property, new Set());
  }

  metadata.validatorTriggers.set(property, trigger);

  const validators = builder(validationBuilder);

  for (const validator of validators) {
    metadata.validators.get(property)!.add(validator);
  }
}

export function removeValidation(target: object, property: string, validator: Validator): void {
  const metadata = store.get(target);
  if (!metadata) return;

  const validators = metadata.validators.get(property);
  if (!validators) return;

  validators.delete(validator);

  if (validators.size === 0) {
    metadata.validators.delete(property);
    metadata.validatorTriggers.delete(property);
  }
}

export async function validate(target: object, property: string, value: any, form: any, trigger?: ValidationTrigger): Promise<ValidationResult> {
  const metadata = store.get(target);
  if (!metadata) {
    return { valid: true, errors: [] };
  }

  // Check trigger
  const fieldTrigger = metadata.validatorTriggers.get(property) || 'blur';
  if (trigger && trigger !== fieldTrigger && trigger !== 'manual') {
    return { valid: true, errors: [] };
  }

  const validators = metadata.validators.get(property);
  if (!validators || validators.size === 0) {
    return { valid: true, errors: [] };
  }

  const context: ValidationContext = {
    target,
    property,
    form
  };

  // Cancel previous async validation for this property
  const previousId = metadata.asyncValidationIds.get(property);
  if (previousId) {
    metadata.asyncValidationIds.delete(property);
  }

  const validationId = Date.now() + Math.random();
  metadata.asyncValidationIds.set(property, validationId);

  const errors: ValidationError[] = [];
  for (const validator of validators) {
    const result = validator(value, context);
    const validationResult = result instanceof Promise ? await result : result;
    
    // Check if this validation is still current
    const currentId = metadata.asyncValidationIds.get(property);
    if (currentId !== validationId) {
      return { valid: true, errors: [] }; // Superseded by newer validation
    }
    
    if (!validationResult.valid) {
      errors.push(...validationResult.errors);
    }
  }

  metadata.asyncValidationIds.delete(property);
  return { valid: errors.length === 0, errors };
}

export async function validateForm(target: object, data: object): Promise<ValidationResult> {
  const metadata = store.get(target);
  if (!metadata) {
    return { valid: true, errors: [] };
  }

  const allErrors: ValidationError[] = [];
  const properties = Array.from(metadata.validators.keys());
  for (const property of properties) {
    const value = getValue(data, property);
    const result = await validate(target, property, value, data);
    allErrors.push(...result.errors);
  }

  if (metadata.formValidators.size > 0) {
    const context: ValidationContext = {
      target,
      property: '',
      form: data
    };
    for (const validator of metadata.formValidators) {
      const result = validator(data, context);
      const validationResult = result instanceof Promise ? await result : result;
      if (!validationResult.valid) {
        allErrors.push(...validationResult.errors);
      }
    }
  }

  return { valid: allErrors.length === 0, errors: allErrors };
}


export function addFormValidation(target: object, validator: Validator): void {
  const metadata = store.get(target);
  if (!metadata) return;

  metadata.formValidators.add(validator);
}

export function removeFormValidation(target: object, validator: Validator): void {
  const metadata = store.get(target);
  if (!metadata) return;

  metadata.formValidators.delete(validator);
}
