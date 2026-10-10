export const APP_LANGUAGES = ['en', 'ta', 'si'] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'en' || value === 'ta' || value === 'si';
}

export function resolveLanguage(value: unknown): AppLanguage {
  return isAppLanguage(value) ? value : 'en';
}
