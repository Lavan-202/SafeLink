import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import si from '../locales/si.json';
import ta from '../locales/ta.json';
import { isAppLanguage, type AppLanguage } from '../types/language';

export const resources = {
  en: { translation: en },
  ta: { translation: ta },
  si: { translation: si },
};

export function deviceLanguage(): AppLanguage {
  const locales = Localization.getLocales();
  const code = locales[0]?.languageCode;
  return isAppLanguage(code) ? code : 'en';
}

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
