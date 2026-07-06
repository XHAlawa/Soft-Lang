import { ValidationError } from '../types';
import { getMetadata } from '../core/metadata';

export function addError(target: object, property: string, error: ValidationError): void {
  const metadata = getMetadata(target);
  if (!metadata) return;

  if (!metadata.errors.has(property)) {
    metadata.errors.set(property, []);
  }

  metadata.errors.get(property)!.push(error);
}

export function getErrors(target: object, property?: string): ValidationError[] {
  const metadata = getMetadata(target);
  if (!metadata) return [];

  if (property) {
    const errors = metadata.errors.get(property);
    return errors ? errors : [];
  }

  const allErrors: ValidationError[] = [];
  for (const errorArray of metadata.errors.values()) {
    allErrors.push(...errorArray);
  }
  return allErrors;
}

export function clearErrors(target: object, property?: string): void {
  const metadata = getMetadata(target);
  if (!metadata) return;

  if (property) {
    metadata.errors.delete(property);
  } else {
    metadata.errors.clear();
  }
}

export function hasErrors(target: object, property?: string): boolean {
  const metadata = getMetadata(target);
  if (!metadata) return false;

  if (property) {
    const errors = metadata.errors.get(property);
    return errors ? errors.length > 0 : false;
  }

  let totalErrors = 0;
  for (const errorArray of metadata.errors.values()) {
    totalErrors += errorArray.length;
  }
  return totalErrors > 0;
}
