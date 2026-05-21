'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/axios'; // 👈 Import your custom Axios instance file here!

export interface User {
  name: string;
  email: string;
  photoUrl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  checkUserSession: () => Promise<void>;
  login: (credentials: object) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      // 🌸 Uses your 'api' instance that includes withCredentials and the correct baseURL automatically
      const response = await api.get('/api/auth/me');
      if (response.data.success && response.data.user) {
        setUser({ ...response.data.user }); 
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const login = async (credentials: object) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.success && response.data.user) {
      setUser({ ...response.data.user }); 
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, checkUserSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be nested within an AuthProvider");
  return context;
}