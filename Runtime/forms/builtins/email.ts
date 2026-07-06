import { Validator, ValidationResult, ValidationContext } from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const email: Validator = (value: any, context: ValidationContext): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { valid: true, errors: [] };
  }
  if (!EMAIL_REGEX.test(value)) {
    return {
      valid: false,
      errors: [{ code: 'email', message: 'Invalid email address' }]
    };
  }
  return { valid: true, errors: [] };
};
