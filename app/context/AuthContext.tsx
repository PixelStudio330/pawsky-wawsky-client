'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Updated to lowercase 'photoUrl' to align exactly with your Express schema!
interface User {
  name: string;
  email: string;
  photoUrl?: string; 
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>; // Turned into a Promise to handle server-side cookie deletion
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Added so the profile page can update live!
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check user session from server on initial load or reload
    const checkUserSession = async () => {
      try {
        // 2. Hits your profile checkpoint endpoint and passes the cookie automatically
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      // 3. Optional but highly recommended: let the backend know it needs to clear its cookies
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error("Failed to clear secure session on server:", err);
    } finally {
      // Always wipe local frontend memory state clean no matter what
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};