import { Validator, ValidationContext, ValidationResult } from '../types';
import * as validators from '../builtins';

export interface ValidationBuilder {
  readonly required: Validator;
  readonly email: Validator;
  readonly phone: Validator;
  readonly url: Validator;
  readonly guid: Validator;
  min(minimum: number): Validator;
  max(maximum: number): Validator;
  between(minimum: number, maximum: number): Validator;
  length(exact: number): Validator;
  minLength(minimum: number): Validator;
  maxLength(maximum: number): Validator;
  regex(pattern: RegExp): Validator;
  equals(getValue: (form: any) => any): Validator;
  notEquals(getValue: (form: any) => any): Validator;
  custom(validator: (value: any, context: ValidationContext) => ValidationResult): Validator;
  async(validator: (value: any) => Promise<string | null>): Validator;
}

const builder: ValidationBuilder = {
  required: validators.required,
  email: validators.email,
  phone: validators.phone,
  url: validators.url,
  guid: validators.guid,
  min(minimum: number): Validator {
    return validators.min(minimum);
  },
  max(maximum: number): Validator {
    return validators.max(maximum);
  },
  between(minimum: number, maximum: number): Validator {
    return validators.between(minimum, maximum);
  },
  length(exact: number): Validator {
    return validators.length(exact);
  },
  minLength(minimum: number): Validator {
    return validators.minLength(minimum);
  },
  maxLength(maximum: number): Validator {
    return validators.maxLength(maximum);
  },
  regex(pattern: RegExp): Validator {
    return validators.regex(pattern);
  },
  equals(getValue: (form: any) => any): Validator {
    return validators.equals(getValue);
  },
  notEquals(getValue: (form: any) => any): Validator {
    return validators.notEquals(getValue);
  },
  custom(validator: (value: any, context: ValidationContext) => ValidationResult): Validator {
    return validators.custom(validator);
  },
  async(validator: (value: any) => Promise<string | null>): Validator {
    return (value: any, context: ValidationContext): Promise<ValidationResult> => {
      return validator(value).then((error) => {
        if (error) {
          return { valid: false, errors: [{ code: 'async', message: error }] };
        }
        return { valid: true, errors: [] };
      });
    };
  }
};

export const validationBuilder: ValidationBuilder = builder;
