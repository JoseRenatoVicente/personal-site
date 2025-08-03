import { defaultLocale, Locale, locales } from '@appConfig';

// Define um tipo mais específico para os arquivos de tradução
type TranslationContent = Record<string, string | Record<string, string | Record<string, string>>>;

// Cria o objeto de traduções dinamicamente com base no array de locales
const translations: Record<Locale, () => Promise<TranslationContent>> = Object.fromEntries(
  locales.map(locale => [
    locale,
    () => import(`@translations/${locale}.json`).then((module) => module.default)
  ])
) as Record<Locale, () => Promise<TranslationContent>>;

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