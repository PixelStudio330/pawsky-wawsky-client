'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Ensure cookies are passed dynamically across cross-origin requests
axios.defaults.withCredentials = true;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/auth`;

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
      const response = await axios.get(`${API_URL}/me`);
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
    // --- GOOGLE OAUTH AUTO-CHECK TRIGGER ---
    // If your backend redirects to '/' or '/login' with a status parameter (e.g., ?login=success)
    const params = new URLSearchParams(window.location.search);
    const loginSuccess = params.get('login') === 'success';

    if (loginSuccess) {
      // Clean up the URL parameters instantly to maintain a pristine aesthetic
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // Always check user session on mount (covers standard reloads + oauth returns)
    checkUserSession();
  }, []);

  const login = async (credentials: object) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.success && response.data.user) {
      setUser({ ...response.data.user }); 
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (err) {
      console.error("Logout encounter error:", err);
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