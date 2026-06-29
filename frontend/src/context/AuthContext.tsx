import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import * as authService from '../services/authService';
import type { AuthResponse } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  email: string | null;
  nombre: string | null;
  roles: string[];
  userId: number | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string, telefono: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isSeller: () => boolean;
  userId: number | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseRoles(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles ?? [];
  } catch {
    return [];
  }
}

function parseUserId(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const id = Number(payload.sub);
    return isNaN(id) ? null : id;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const stored = localStorage.getItem('access_token');
    if (stored) {
      return {
        isAuthenticated: true,
        accessToken: stored,
        email: null,
        nombre: null,
        roles: parseRoles(stored),
        userId: parseUserId(stored),
      };
    }
    return {
      isAuthenticated: false,
      accessToken: null,
      email: null,
      nombre: null,
      roles: [],
      userId: null,
    };
  });

  const handleLogin = useCallback(async (email: string, password: string) => {
    const data: AuthResponse = await authService.login({ email, password });
    localStorage.setItem('access_token', data.accessToken);
    setAuth({
      isAuthenticated: true,
      accessToken: data.accessToken,
      email: data.email,
      nombre: data.nombre,
      roles: parseRoles(data.accessToken),
      userId: parseUserId(data.accessToken),
    });
  }, []);

  const handleRegister = useCallback(async (nombre: string, email: string, password: string, telefono: string) => {
    await authService.register({ nombre, email, password, telefono });
  }, []);

  const handleLogout = useCallback(async () => {
    await authService.logout();
    setAuth({
      isAuthenticated: false,
      accessToken: null,
      email: null,
      nombre: null,
      roles: [],
      userId: null,
    });
  }, []);

  const isAdmin = useCallback(() => auth.roles.includes('ADMIN'), [auth.roles]);
  const isSeller = useCallback(() => auth.roles.includes('SELLER'), [auth.roles]);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAdmin,
        isSeller,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
