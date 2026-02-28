import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '@/api/client';

export type UserRole = 'admin' | 'operator' | 'auditor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo accounts
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@deepaudit.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@deepaudit.com',
      name: 'Alex Morgan',
      role: 'admin',
    },
  },
  'operator@deepaudit.com': {
    password: 'operator123',
    user: {
      id: '2',
      email: 'operator@deepaudit.com',
      name: 'Jordan Chen',
      role: 'operator',
    },
  },
  'auditor@deepaudit.com': {
    password: 'auditor123',
    user: {
      id: '3',
      email: 'auditor@deepaudit.com',
      name: 'Sam Rivera',
      role: 'auditor',
    },
  },
};

// Role-based permissions
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['dashboard', 'enrollment', 'recognition', 'audit', 'reports', 'settings'],
  operator: ['dashboard', 'enrollment', 'recognition'],
  auditor: ['dashboard', 'audit', 'reports'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/admin/login', {
        username: email.split('@')[0] || 'admin',  // Using username or extract from email, matching the python request model
        password: password
      });

      if (response.data.success) {
        setUser({
          id: 'admin_1',
          email: email,
          name: 'Administrator',
          role: 'admin'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      return ROLE_PERMISSIONS[user.role].includes(permission);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { DEMO_USERS, ROLE_PERMISSIONS };
