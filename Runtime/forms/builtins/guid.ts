import { Validator, ValidationResult, ValidationContext } from '../types';

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const guid: Validator = (value: any, context: ValidationContext): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { valid: true, errors: [] };
  }
  if (!GUID_REGEX.test(value)) {
    return {
      valid: false,
      errors: [{ code: 'guid', message: 'Invalid GUID' }]
    };
  }
  return { valid: true, errors: [] };
};
