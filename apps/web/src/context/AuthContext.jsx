
import React, { createContext, useState, useEffect } from 'react';
import pb from '@/utils/pocketbase';
import { toast } from 'sonner';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'admin_users') {
        setCurrentAdmin(pb.authStore.model);
        setIsAuthenticated(true);
      } else {
        setCurrentAdmin(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (token && model?.collectionName === 'admin_users') {
        setCurrentAdmin(model);
        setIsAuthenticated(true);
      } else {
        setCurrentAdmin(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('admin_users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentAdmin(authData.record);
      setIsAuthenticated(true);
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    } catch (error) {
      console.error("Login failed", error);
      toast.error('فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.');
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    toast.info('تم تسجيل الخروج');
  };

  const getAuthToken = () => pb.authStore.token;

  const value = {
    currentAdmin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
