import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Gavel, LayoutDashboard, Award, PlusCircle, Bell, Shield, LogOut, Package, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotificaciones } from '../context/NotificacionesContext';
import { useSse } from '../hooks/useSse';
import { obtenerTicketNotificaciones } from '../services/sseService';
import ThemeToggle from './ThemeToggle';
import { useState, useRef, useEffect } from 'react';

export default function AppLayout() {
  const { nombre, isAdmin, logout } = useAuth();
  const { unreadCount, notifications, cargar } = useNotificaciones();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useSse(obtenerTicketNotificaciones, '/api/notificaciones/stream', {
    'notificacion-nueva': () => {
      cargar();
      setToast('Nueva notificación');
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    },
  });

  const tabs = [
    { id: '/catalogo', label: 'Catálogo', icon: LayoutDashboard },
    { id: '/mis-pujas', label: 'Mis Ofertas', icon: Award },
    { id: '/mis-subastas', label: 'Publicaciones', icon: Package },
    { id: '/crear', label: 'Publicar', icon: PlusCircle },
    ...(isAdmin() ? [{ id: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <div className="min-h-screen bg-main">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div onClick={() => navigate('/catalogo')} className="flex cursor-pointer items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-main shadow-md shadow-amber-500/10">
              <Gavel className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">Uni<span className="text-amber-500">Subastas</span></span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => navigate(t.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  location.pathname.startsWith(t.id)
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-text-secondary hover:bg-input hover:text-text-primary border border-transparent'
                }`}>
                <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />

            <button onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary transition-colors">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-surface">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-amber-500/30 transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-[10px] select-none">
                  {(nombre ?? 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block text-xs font-medium text-text-primary max-w-[100px] truncate">{nombre}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-11 z-50 w-44 rounded-xl border border-border bg-surface shadow-xl py-1">
                  <button
                    onClick={() => { setShowUserMenu(false); navigate('/perfil'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-input transition-colors"
                  >
                    <User className="h-3.5 w-3.5" /> Mi Perfil
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-input transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:hidden border-t border-border bg-surface px-2 py-1 justify-around">
          {tabs.map(t => (
            <button key={t.id} onClick={() => navigate(t.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] transition-all ${
                location.pathname.startsWith(t.id) ? 'text-amber-500 font-medium' : 'text-text-muted'
              }`}>
              <t.icon className="h-4 w-4 mb-0.5" /><span>{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      {toast && (
        <div className="fixed top-16 right-4 z-50 animate-fade-in rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-xs text-amber-400 shadow-lg">
          🔔 {toast}
        </div>
      )}

      {showNotifications && (
        <div className="absolute top-14 right-4 z-50 w-72 rounded-xl border border-border bg-surface shadow-xl">
          <div className="p-3 border-b border-border text-xs font-bold text-text-primary">Notificaciones</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-text-muted p-4 text-center">Sin notificaciones</p>
            ) : (
              notifications.slice(0, 10).map(n => (
                <div key={n.id} className={`px-3 py-2 border-b border-border/50 text-xs ${n.read ? 'text-text-muted' : 'text-text-primary'}`}>
                  <span className="font-semibold">{n.title}</span>
                  <p className="text-text-muted mt-0.5">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
