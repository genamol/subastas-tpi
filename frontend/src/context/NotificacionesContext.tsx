import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Notification } from '../types';
import * as notificacionService from '../services/notificacionService';
import { useAuth } from './AuthContext';

interface NotificacionesState {
  notifications: Notification[];
  unreadCount: number;
  cargar: () => Promise<void>;
  marcarLeida: (id: number) => Promise<void>;
  marcarTodasLeidas: () => Promise<void>;
}

const NotificacionesContext = createContext<NotificacionesState | null>(null);

export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const cargar = useCallback(async () => {
    try {
      const result = await notificacionService.listarNotificaciones();
      setNotifications(result.items);
    } catch {
      // backend no disponible
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      cargar();
    }
  }, [isAuthenticated, cargar]);

  const marcarLeida = useCallback(async (id: number) => {
    await notificacionService.marcarLeida(id);
    setNotifications(prev => prev.map(n => n.id === String(id) ? { ...n, read: true } : n));
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    await notificacionService.marcarTodasLeidas();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificacionesContext.Provider value={{ notifications, unreadCount, cargar, marcarLeida, marcarTodasLeidas }}>
      {children}
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  const ctx = useContext(NotificacionesContext);
  if (!ctx) throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider');
  return ctx;
}
