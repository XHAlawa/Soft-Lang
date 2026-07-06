import { ValidationError, ErrorFormatter } from '../forms/types';

let currentFormatter: ErrorFormatter = {
  format(error: ValidationError): string {
    return error.message;
  }
};

export function setFormatter(formatter: ErrorFormatter): void {
  currentFormatter = formatter;
}

export function getFormatter(): ErrorFormatter {
  return currentFormatter;
}

export function formatError(error: ValidationError): string {
  return currentFormatter.format(error);
}
