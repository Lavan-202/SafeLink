import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import i18n from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../services/authService';
import { getPreferredLanguage, savePreferredLanguage } from '../services/preferencesService';
import { resolveLanguage, type AppLanguage } from '../types/language';
import { deviceLanguage } from '../i18n';

type LanguageContextValue = {
  language: AppLanguage;
  ready: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuth();
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function restore() {
      const saved = await getPreferredLanguage();
      const next = saved ?? (user ? resolveLanguage(user.preferredLanguage) : deviceLanguage());
      if (!active) return;
      setLanguageState(next);
      await i18n.changeLanguage(next);
      if (active) setReady(true);
    }

    void restore();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      ready,
      setLanguage: async (next) => {
        const resolved = resolveLanguage(next);
        await savePreferredLanguage(resolved);
        await i18n.changeLanguage(resolved);
        setLanguageState(resolved);
        if (user) {
          const updated = await updateProfile({ preferredLanguage: resolved });
          setUser(updated);
        }
      },
    }),
    [language, ready, setUser, user],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
