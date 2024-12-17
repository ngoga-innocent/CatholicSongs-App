import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import kiny from './locales/kiny.json';

const resources = {
  en: { translation: en },
  kiny: { translation: kiny },
};

// Function to get the language from AsyncStorage or fallback to 'kiny'
const getLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem('language');
    if (storedLanguage) {
      return storedLanguage;
    } else {
      // If no language is stored in AsyncStorage, fall back to 'kiny'
      return 'kiny';
    }
  } catch (error) {
    console.error('Failed to load language from AsyncStorage', error);
    // If AsyncStorage fails, fall back to 'kiny'
    return 'kiny';
  }
};

// Initialize i18n
const initializeI18n = async () => {
  const language = await getLanguage(); // Get language from AsyncStorage

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources,
      lng: language, // Set the language
      fallbackLng: 'kiny', // Fallback to 'kiny' if no language found
      interpolation: { escapeValue: false },
    });
};

initializeI18n(); // Initialize i18n

export default i18n;
