import { Gavel, Coins, Plus, Bell, User, LayoutDashboard, PlusCircle, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: 'catalog' | 'my-bids' | 'create';
  onTabChange: (tab: 'catalog' | 'my-bids' | 'create') => void;
  user: UserProfile;
  onAddFunds: () => void;
  unreadNotificationsCount: number;
  onToggleNotifications: () => void;
}

export default function Navbar({
  currentTab,
  onTabChange,
  user,
  onAddFunds,
  unreadNotificationsCount,
  onToggleNotifications
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div 
          onClick={() => onTabChange('catalog')}
          className="flex cursor-pointer items-center space-x-2.5 transition-transform active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Gavel className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              Uni<span className="text-indigo-600">Subastas</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Proyecto Grupal
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onTabChange('catalog')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'catalog'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-catalog"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Catálogo</span>
          </button>

          <button
            onClick={() => onTabChange('my-bids')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'my-bids'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-my-bids"
          >
            <Award className="h-4 w-4" />
            <span>Mis Ofertas</span>
          </button>

          <button
            onClick={() => onTabChange('create')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'create'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-create"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Publicar Artículo</span>
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-3 pr-2.5">
            <Coins className="h-4 w-4 text-amber-500 animate-pulse-slow" />
            <div className="text-right">
              <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Saldo
              </span>
              <span className="font-mono text-sm font-bold text-slate-700">
                ${user.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={onAddFunds}
              className="ml-1 flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={onToggleNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-100"
            />
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-semibold text-slate-800">
                {user.name}
              </span>
              <span className="block text-[10px] text-slate-500">
                Calificación: {user.rating} ★
              </span>
            </div>
          </div>
        </div>

      </div>

      <div className="flex md:hidden border-t border-slate-100 bg-white px-2 py-1 justify-around">
        <button
          onClick={() => onTabChange('catalog')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
            currentTab === 'catalog' ? 'text-indigo-600 font-medium' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mb-0.5" />
          <span className="text-[10px]">Catálogo</span>
        </button>
        <button
          onClick={() => onTabChange('my-bids')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
            currentTab === 'my-bids' ? 'text-indigo-600 font-medium' : 'text-slate-500'
          }`}
        >
          <Award className="h-5 w-5 mb-0.5" />
          <span className="text-[10px]">Mis Ofertas</span>
        </button>
        <button
          onClick={() => onTabChange('create')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
            currentTab === 'create' ? 'text-indigo-600 font-medium' : 'text-slate-500'
          }`}
        >
          <PlusCircle className="h-5 w-5 mb-0.5" />
          <span className="text-[10px]">Publicar</span>
        </button>
      </div>
    </header>
  );
}
