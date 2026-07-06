# 🌍 Localization (@L Directive)

## Overview

The `@L` directive provides internationalization (i18n) support in Soft Framework, allowing you to create multilingual applications.

## Syntax

```soft
@L('key')
```

## Usage in Templates

```soft
@Template
<div>
  <h1>@L('welcome')</h1>
  <p>@L('greeting')</p>
  <button>@L('submit')</button>
</div>
```

## Setup

### 1. Create Localization Files

Create a JSON file with translations for each language:

**locales.json**
```json
{
  "en": {
    "welcome": "Welcome!",
    "greeting": "Hello, how are you?",
    "submit": "Submit"
  },
  "es": {
    "welcome": "¡Bienvenido!",
    "greeting": "Hola, ¿cómo estás?",
    "submit": "Enviar"
  }
}
```

### 2. Initialize Localization

In your application entry point:

```typescript
import { loadTranslations, localize } from './Runtime/localization/localization';
import translations from './locales.json';

// Load translations
loadTranslations(translations, 'en'); // Default language

// Make localize globally available
(globalThis as any).__softLocalize = localize;
```

### 3. Change Language Dynamically

```typescript
import { setLanguage, loadTranslations } from './Runtime/localization/localization';

function changeLanguage(lang: string) {
  setLanguage(lang);
  loadTranslations(translations, lang);
  // Re-render your components
}
```

## Generated Code

The `@L('key')` directive generates:

```typescript
const el = document.createTextNode(this.__localize('key'));
```

The `__localize` method is automatically injected into every component:

```typescript
private __localize(key: string, fallback?: string): string {
  return (globalThis as any).__softLocalize?.(key, fallback) || fallback || key;
}
```

## Features

✅ **String Literal Keys**: `@L('welcome')`  
✅ **Fallback Support**: Returns key if translation not found  
✅ **Dynamic Language Switching**: Change language at runtime  
✅ **Multiple Language Support**: Unlimited languages  
✅ **Type-Safe**: Full TypeScript support  

## API Reference

### Runtime Functions

```typescript
// Load translations for a specific language
loadTranslations(translations: Record<string, Record<string, string>>, lang?: string): void

// Set current language
setLanguage(lang: string): void

// Get current language
getLanguage(): string

// Localize a key
localize(key: string, fallback?: string): string

// Set custom messages
setMessages(customMessages: Record<string, string>): void

// Get a specific message
getMessage(code: string): string | undefined
```

## Best Practices

1. **Organize by Feature**: Group related translations together
2. **Use Namespacing**: Prefix keys with feature names (e.g., `auth.login`, `auth.logout`)
3. **Provide Fallbacks**: Always have a default language
4. **Lazy Load**: Load translations on demand for large apps
5. **Cache Translations**: Store in localStorage for offline support

## Example: Complete Setup

```soft
@Component

@Template
<div>
  <h1>@L('app.title')</h1>
  <select @change="handleLanguageChange">
    <option value="en">English</option>
    <option value="es">Español</option>
    <option value="fr">Français</option>
  </select>
  <p>@L('app.description')</p>
</div>

@Code
import { setLanguage, loadTranslations } from './Runtime/localization/localization';
import translations from './locales.json';

handleLanguageChange(e: Event) {
  const lang = (e.target as HTMLSelectElement).value;
  setLanguage(lang);
  loadTranslations(translations, lang);
  // Trigger re-render
  if (this.__container) {
    this.__render(this.__container);
  }
}
```

## Advanced: Parameter Interpolation (Future)

Future versions will support parameter interpolation:

```soft
@L('greeting', { name: userName })
// Output: "Hello, John!"
```

## Troubleshooting

**Issue**: Translations not showing  
**Solution**: Ensure `(globalThis as any).__softLocalize = localize;` is called before mounting components

**Issue**: Language not changing  
**Solution**: Call `loadTranslations()` after `setLanguage()` and re-render components

**Issue**: Key displayed instead of translation  
**Solution**: Check that the key exists in your translations JSON
