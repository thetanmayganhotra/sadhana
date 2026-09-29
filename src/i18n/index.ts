import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';

export const resources = {
  en: { translation: en },
} as const;

export const SUPPORTED_LANGUAGES = Object.keys(resources) as (keyof typeof resources)[];
export const FALLBACK_LANGUAGE = 'en';

function detectLanguage(): string {
  const code = getLocales()[0]?.languageCode ?? FALLBACK_LANGUAGE;
  return (SUPPORTED_LANGUAGES as string[]).includes(code) ? code : FALLBACK_LANGUAGE;
}

// eslint-disable-next-line import/no-named-as-default-member -- i18next's documented init API
void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
});

export default i18n;
