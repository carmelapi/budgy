import { en } from './en';
import { it } from './it';

const translations = {
  EN: en,
  IT: it,
};

export function getTranslations(language: string = 'EN') {
  return translations[language as keyof typeof translations] || translations.EN;
}

export { en, it };
export type { TranslationKeys } from './en';
