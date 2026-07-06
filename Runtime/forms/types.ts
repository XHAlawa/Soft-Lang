// Core Types for Soft Forms Runtime

export interface ValidationError {
  code: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationContext {
  target: any;
  property: string;
  form: any;
}

export type ValidationTrigger = 'input' | 'change' | 'blur' | 'submit' | 'manual';

export interface SubmitResult {
  success: boolean;
  data?: any;
  error?: any;
}

export type Validator = (value: any, context: ValidationContext) => ValidationResult | Promise<ValidationResult>;

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
