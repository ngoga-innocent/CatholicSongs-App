import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import kiny from './locales/kiny.json';

const resources = {
  en: { translation: en },
  kiny: { translation: kiny },
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', 
    resources,
    lng: Localization.locale.split('-')[0], // Automatically sets language based on device settings
    fallbackLng: 'kiny',
    interpolation: { escapeValue: false },
  });

export default i18n;
