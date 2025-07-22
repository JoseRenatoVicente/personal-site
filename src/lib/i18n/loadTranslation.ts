import { defaultLocale, Locale } from '@appConfig';

// Define um tipo mais específico para os arquivos de tradução
type TranslationContent = Record<string, string | Record<string, string | Record<string, string>>>;

// Import translation files manually from @/translations path as modules
const translations: Record<Locale, () => Promise<TranslationContent>> = {
  'es': () => import('@translations/es.json').then((module) => module.default),
  'pt-br': () => import('@translations/pt-br.json').then((module) => module.default),
  'en': () => import('@translations/en.json').then((module) => module.default)
};

// Create a simpler type for translation objects to avoid deep type recursion
export type TranslationObject = TranslationContent;

/**
 * Loads a translation file as a module based on a given locale.
 *
 * @param {Locale} locale -  A locale that specifies which translation is loaded.
 * @returns {TranslationObject} Translation object.
 */
export const loadTranslation = async (
  locale: Locale
): Promise<TranslationObject> => {
  // Verifica se a tradução para o locale existe
  if (!translations[locale]) {
    console.warn(`Translation for locale "${locale}" not found. Using default locale "${defaultLocale}" instead.`);
    return translations[defaultLocale]();
  }
  // Importa e retorna a tradução
  return translations[locale]();
};