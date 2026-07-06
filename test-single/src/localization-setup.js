/**
 * Localization Setup for Soft Framework
 *
 * This file demonstrates how to set up localization in your Soft application.
 */
import { loadTranslations, setLanguage, localize } from '../Runtime/localization/localization';
// Load translations from JSON file
// In a real app, you would fetch this from your server or bundle it
const translations = {
    "en": {
        "welcome": "Welcome to Soft Framework!",
        "greeting": "Hello, how are you today?",
        "submit": "Submit",
        "cancel": "Cancel"
    },
    "es": {
        "welcome": "¡Bienvenido al Framework Soft!",
        "greeting": "Hola, ¿cómo estás hoy?",
        "submit": "Enviar",
        "cancel": "Cancelar"
    },
    "fr": {
        "welcome": "Bienvenue dans le Framework Soft!",
        "greeting": "Bonjour, comment allez-vous aujourd'hui?",
        "submit": "Soumettre",
        "cancel": "Annuler"
    }
};
// Initialize localization
export function initializeLocalization(language = 'en') {
    loadTranslations(translations, language);
    // Make localize function globally available for components
    globalThis.__softLocalize = localize;
}
// Example: Change language dynamically
export function changeLanguage(lang) {
    setLanguage(lang);
    loadTranslations(translations, lang);
}
// Initialize with default language on module load
initializeLocalization();
