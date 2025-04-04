'use client';

import { checkUserLoggedIn } from '@/Auth';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextT = {
  user: any | null;
  login: (LoginResponse: any) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextT | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    checkUserLoggedIn()
      .then((LoginResponse) => {
        setUser(LoginResponse || null);
      })
      .catch((error) => {
        console.error('Error checking user login status:', error.message);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false); // ✅ Ensure loading completes
      });
  }, []);

  const login = async (LoginResponse: any) => {
    setUser(LoginResponse);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!isLoading && children} {/* ✅ Prevents rendering while loading */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
