import { Validator, ValidationResult, ValidationContext } from '../types';

export function length(exact: number): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    if (String(value).length !== exact) {
      return {
        valid: false,
        errors: [{ code: 'length', message: `Must be exactly ${exact} characters` }]
      };
    }
    return { valid: true, errors: [] };
  };
}

export function minLength(minimum: number): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    if (String(value).length < minimum) {
      return {
        valid: false,
        errors: [{ code: 'minLength', message: `Must be at least ${minimum} characters` }]
      };
    }
    return { valid: true, errors: [] };
  };
}

export function maxLength(maximum: number): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    if (String(value).length > maximum) {
      return {
        valid: false,
        errors: [{ code: 'maxLength', message: `Must be at most ${maximum} characters` }]
      };
    }
    return { valid: true, errors: [] };
  };
}

export function regex(pattern: RegExp): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    if (!pattern.test(String(value))) {
      return {
        valid: false,
        errors: [{ code: 'regex', message: 'Invalid format' }]
      };
    }
    return { valid: true, errors: [] };
  };
}
