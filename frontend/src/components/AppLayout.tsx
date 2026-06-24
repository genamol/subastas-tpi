import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Gavel, LayoutDashboard, Award, PlusCircle, Bell, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { useNotificaciones } from '../context/NotificacionesContext';
import { useState } from 'react';

export default function AppLayout() {
  const { nombre, isAdmin, logout } = useAuth();
  const { unreadCount, notifications } = useNotificaciones();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    { id: '/catalogo', label: 'Catálogo', icon: LayoutDashboard },
    { id: '/mis-pujas', label: 'Mis Ofertas', icon: Award },
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

            <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-rose-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
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
