import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | { email: string; id: string } | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isMockAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_AUTH_KEY = 'nellai_admin_mock_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; id: string } | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMockAuth, setIsMockAuth] = useState<boolean>(!isSupabaseConfigured);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // Supabase is configured: listen to real auth changes
      supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local / Offline fallback auth
      setIsMockAuth(true);
      const savedUser = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        setUser(data.user);
        setSession(data.session);
        setIsLoading(false);
        return { success: true };
      } else {
        // Fallback owner demo credentials when Supabase variables aren't provided yet
        // Owner default credentials: admin@nellailala.com or owner / password
        if (
          (email.trim().toLowerCase() === 'admin@nellailala.com' || email.trim().toLowerCase() === 'owner@nellailala.com' || email.trim().toLowerCase() === 'owner') &&
          (password === 'nellailala123' || password === 'admin123' || password === 'admin')
        ) {
          const mockUser = {
            id: 'mock-owner-001',
            email: email.trim(),
          };
          setUser(mockUser);
          localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(mockUser));
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          return {
            success: false,
            error: 'Invalid email or password. For demo mode use: admin@nellailala.com / nellailala123 (or connect your Supabase project in .env)',
          };
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Authentication error' };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, isMockAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
