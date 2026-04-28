import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import supabase from '@/services/supabase';
import { getCurrentAdminProfile } from '@/services/settings';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const syncFromSession = async (session) => {
    if (!session?.user?.id) {
      setCurrentAdmin(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const profile = await getCurrentAdminProfile(session.user.id);
      if (!profile || profile.role !== 'admin') {
        setCurrentAdmin(null);
        setIsAuthenticated(false);
        return;
      }

      setCurrentAdmin({
        ...profile,
        email: profile.email || session.user.email || '',
      });
      setIsAuthenticated(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Auth profile sync failed:', err);
      setCurrentAdmin(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) await syncFromSession(data?.session || null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Auth init failed:', err);
        if (mounted) {
          setCurrentAdmin(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncFromSession(session).finally(() => setIsLoading(false));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const profile = await getCurrentAdminProfile(data?.user?.id);
      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('هذا الحساب لا يملك صلاحية المدير');
      }

      setCurrentAdmin({
        ...profile,
        email: profile.email || data.user?.email || email,
      });
      setIsAuthenticated(true);
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login failed', error);
      toast.error(error?.message || 'فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.');
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    toast.info('تم تسجيل الخروج');
  };

  const getAuthToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || '';
  };

  const value = {
    currentAdmin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
