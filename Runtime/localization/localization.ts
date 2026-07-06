import { ValidationError } from '../forms/types';

const messages: Map<string, string> = new Map();
let currentLanguage = 'en';
let fallbackLanguage = 'en';

/**
 * Set custom messages for localization
 */
export function setMessages(customMessages: Record<string, string>): void {
  for (const [code, message] of Object.entries(customMessages)) {
    messages.set(code, message);
  }
}

/**
 * Get a localized message by key
 */
export function getMessage(code: string): string | undefined {
  return messages.get(code);
}

/**
 * Load localization messages from a JSON object
 * @param translations - Object with language codes as keys and message dictionaries as values
 * @param lang - Language code to set as current (optional)
 */
export function loadTranslations(translations: Record<string, Record<string, string>>, lang?: string): void {
  if (lang) {
    currentLanguage = lang;
  }
  
  const langMessages = translations[currentLanguage] || translations[fallbackLanguage] || {};
  setMessages(langMessages);
}

/**
 * Set the current language
 */
export function setLanguage(lang: string): void {
  currentLanguage = lang;
}

/**
 * Get the current language
 */
export function getLanguage(): string {
  return currentLanguage;
}

/**
 * Localize a key with optional fallback
 */
export function localize(key: string, fallback?: string): string {
  return messages.get(key) || fallback || key;
}

/**
 * Format validation errors with localized messages
 */
export function formatValidationError(error: ValidationError): string {
  const customMessage = getMessage(error.code);
  return customMessage || error.message;
}
