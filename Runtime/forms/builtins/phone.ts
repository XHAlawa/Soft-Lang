import { Validator, ValidationResult, ValidationContext } from '../types';

const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;

export const phone: Validator = (value: any, context: ValidationContext): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { valid: true, errors: [] };
  }
  if (!PHONE_REGEX.test(value)) {
    return {
      valid: false,
      errors: [{ code: 'phone', message: 'Invalid phone number' }]
    };
  }
  return { valid: true, errors: [] };
};
