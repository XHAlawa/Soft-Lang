import { Validator, ValidationResult, ValidationContext } from '../types';

const URL_REGEX = /^https?:\/\/.+/;

export const url: Validator = (value: any, context: ValidationContext): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { valid: true, errors: [] };
  }
  if (!URL_REGEX.test(value)) {
    return {
      valid: false,
      errors: [{ code: 'url', message: 'Invalid URL' }]
    };
  }
  return { valid: true, errors: [] };
};
