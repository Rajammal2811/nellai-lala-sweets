import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // Supabase is configured: listen to real auth changes
      supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsLoading(false);
      }).catch(err => {
        console.error('Supabase session fetch error:', err);
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
      setUser(null);
      setSession(null);
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Supabase production credentials are missing. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable owner authentication.',
        };
      }

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
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = Boolean(user);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAdmin, 
      isLoading, 
      isSupabaseConnected: isSupabaseConfigured, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
