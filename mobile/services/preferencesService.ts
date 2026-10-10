import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolveLanguage, type AppLanguage } from '../types/language';

const LANGUAGE_KEY = 'safelink.language';

export async function getPreferredLanguage(): Promise<AppLanguage | null> {
  const value = await AsyncStorage.getItem(LANGUAGE_KEY);
  return value === 'en' || value === 'ta' || value === 'si' ? value : null;
}

export function savePreferredLanguage(language: AppLanguage) {
  return AsyncStorage.setItem(LANGUAGE_KEY, resolveLanguage(language));
}
