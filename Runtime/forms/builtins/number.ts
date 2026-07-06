import { Validator, ValidationResult, ValidationContext } from '../types';

export function min(minimum: number): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    const num = Number(value);
    if (isNaN(num) || num < minimum) {
      return {
        valid: false,
        errors: [{ code: 'min', message: `Must be at least ${minimum}` }]
      };
    }
    return { valid: true, errors: [] };
  };
}

export function max(maximum: number): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    const num = Number(value);
    if (isNaN(num) || num > maximum) {
      return {
        valid: false,
        errors: [{ code: 'max', message: `Must be at most ${maximum}` }]
      };
    }
    return { valid: true, errors: [] };
  };
}

export function between(minimum: number, maximum: number): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    const num = Number(value);
    if (isNaN(num) || num < minimum || num > maximum) {
      return {
        valid: false,
        errors: [{ code: 'between', message: `Must be between ${minimum} and ${maximum}` }]
      };
    }
    return { valid: true, errors: [] };
  };
}
