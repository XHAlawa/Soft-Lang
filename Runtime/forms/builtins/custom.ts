import { Validator, ValidationResult, ValidationContext } from '../types';

export function custom(validator: (value: any, context: ValidationContext) => ValidationResult | Promise<ValidationResult>): Validator {
  return validator;
}
