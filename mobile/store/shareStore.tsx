import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { SharingDuration } from '../types';

type Session = {
  ids: string[];
  duration: SharingDuration;
};

type ShareContextValue = {
  session: Session | null;
  start: (ids: string[], duration: SharingDuration) => void;
  stopOne: (id: string) => void;
  stopAll: () => void;
};

const ShareContext = createContext<ShareContextValue | null>(null);

export function ShareProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const value = useMemo<ShareContextValue>(
    () => ({
      session,
      start: (ids, duration) => setSession({ ids, duration }),
      stopOne: (id) =>
        setSession((current) => {
          if (!current) return current;
          const ids = current.ids.filter((item) => item !== id);
          return ids.length === 0 ? null : { ...current, ids };
        }),
      stopAll: () => setSession(null),
    }),
    [session],
  );

  return <ShareContext.Provider value={value}>{children}</ShareContext.Provider>;
}

export function useShare() {
  const context = useContext(ShareContext);
  if (!context) throw new Error('useShare must be used within ShareProvider');
  return context;
}
