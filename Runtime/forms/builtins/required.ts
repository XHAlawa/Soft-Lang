import { Validator, ValidationResult, ValidationContext } from '../types';

export const required: Validator = (value: any, context: ValidationContext): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return {
      valid: false,
      errors: [{ code: 'required', message: 'This field is required' }]
    };
  }
  return { valid: true, errors: [] };
};
