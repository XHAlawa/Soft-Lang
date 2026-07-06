import { Validator, ValidationResult, ValidationContext } from '../types';

export function equals(getValue: (form: any) => any): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    const otherValue = getValue(context.form);
    if (value !== otherValue) {
      return {
        valid: false,
        errors: [{ code: 'equals', message: 'Values must match' }]
      };
    }
    return { valid: true, errors: [] };
  };
}

export function notEquals(getValue: (form: any) => any): Validator {
  return (value: any, context: ValidationContext): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: true, errors: [] };
    }
    const otherValue = getValue(context.form);
    if (value === otherValue) {
      return {
        valid: false,
        errors: [{ code: 'notEquals', message: 'Values must not match' }]
      };
    }
    return { valid: true, errors: [] };
  };
}
