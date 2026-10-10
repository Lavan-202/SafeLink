import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '../services/authService';
import { getToken } from '../utils/storage';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        const token = await getToken();
        if (!token) return;
        const profile = await authService.getMe();
        if (active) setUser(profile);
      } catch {
        await authService.logout();
        if (active) setUser(null);
      } finally {
        if (active) setReady(true);
      }
    }

    void restore();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      setUser,
      signOut: async () => {
        await authService.logout();
        setUser(null);
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
