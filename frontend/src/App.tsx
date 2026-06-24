import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Coins, 
  Plus, 
  Bell, 
  LayoutDashboard, 
  PlusCircle, 
  Award, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  History,
  CheckCircle,
  XCircle,
  ExternalLink,
  Info,
  ChevronRight,
  Filter,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { Auction, UserProfile, Dispute, UserAccount, Notification, Bid } from './types';
import { 
  INITIAL_USER, 
  INITIAL_AUCTIONS, 
  CATEGORIES, 
  INITIAL_DISPUTES, 
  INITIAL_USERS 
} from './initialData';
import AdminPanel from './components/AdminPanel';

function formatCountdown(endTime: string): { text: string; urgent: boolean; ended: boolean } {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { text: 'Finalizada', urgent: false, ended: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const urgent = diff < 3600000;
  if (days > 0) return { text: `${days}d ${hours}hs`, urgent: false, ended: false };
  if (hours > 0) return { text: `${hours}hs ${mins}min`, urgent: diff < 86400000, ended: false };
  return { text: `${mins}min`, urgent: true, ended: false };
}

function CardCountdown({ endTime }: { endTime: string }) {
  const [info, setInfo] = useState(() => formatCountdown(endTime));
  useEffect(() => {
    const interval = setInterval(() => setInfo(formatCountdown(endTime)), 1000);
    return () => clearInterval(interval);
  }, [endTime]);
  if (info.ended) {
    return (
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-input/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-text-muted border border-border/50">
        <Clock className="h-3.5 w-3.5" />Finalizada
      </div>
    );
  }
  return (
    <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg backdrop-blur px-2.5 py-1 text-[11px] font-semibold border ${
      info.urgent ? 'bg-rose-950/90 text-rose-300 border-rose-500/30 animate-pulse' : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/20'
    }`}>
      <Clock className={`h-3.5 w-3.5 ${info.urgent ? 'text-rose-400' : 'text-emerald-400'}`} />{info.text}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [auctions, setAuctions] = useState<Auction[]>(() => {
    return INITIAL_AUCTIONS.map(a => {
      if (a.id === "1") return { ...a, endTime: new Date(Date.now() + 1000 * 60 * 15).toISOString() };
      if (a.id === "5") return { ...a, endTime: new Date(Date.now() + 1000 * 60 * 6).toISOString() };
      return a;
    });
  });
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentTab, setCurrentTab] = useState<'catalog' | 'my-bids' | 'create' | 'admin'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [sseLogs, setSseLogs] = useState<string[]>([
    "🧩 [Iniciado] Canal SSE de notificaciones inicializado.",
    "📡 [Suscrito] Suscripción en segundo plano del catálogo activa."
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n-1",
      type: "info",
      title: "Bienvenido a UniSubastas",
      message: "Estás navegando en el entorno del Trabajo Práctico Integrador. Puedes alternar al Panel de Administración.",
      time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidError, setBidError] = useState<string>('');
  const [disputeMotive, setDisputeMotive] = useState<'FRAUDE' | 'FALTA_DE_PAGO' | 'PRODUCTO_NO_RECIBIDO' | 'OTRO'>('PRODUCTO_NO_RECIBIDO');
  const [disputeText, setDisputeMotiveText] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Tecnología');
  const [newImage, setNewImage] = useState('');
  const [newBasePrice, setNewBasePrice] = useState('');
  const [newMinIncrement, setNewMinIncrement] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState('10');

  useEffect(() => {
    const interval = setInterval(() => {
      const activeAuctions = auctions.filter(a => new Date(a.endTime).getTime() > Date.now());
      if (activeAuctions.length === 0) return;

      const randomAuction = activeAuctions[Math.floor(Math.random() * activeAuctions.length)];
      
      const otherBidders = [
        { name: "Sofía Medina", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" },
        { name: "Carlos Gómez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
        { name: "Alan Walker", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200" }
      ];
      const bidder = otherBidders[Math.floor(Math.random() * otherBidders.length)];
      
      const bidIncrement = randomAuction.minIncrement + (Math.floor(Math.random() * 3) * 10);
      const newPrice = randomAuction.currentPrice + bidIncrement;

      setAuctions(prev => prev.map(a => {
        if (a.id === randomAuction.id) {
          const newBid: Bid = {
            id: `b-sim-${Date.now()}`,
            auctionId: a.id,
            bidderName: bidder.name,
            bidderAvatar: bidder.avatar,
            amount: newPrice,
            time: new Date().toISOString()
          };
          return {
            ...a,
            currentPrice: newPrice,
            bidsCount: a.bidsCount + 1,
            bids: [newBid, ...a.bids]
          };
        }
        return a;
      }));

      setSseLogs(prev => [
        `🔥 [SSE Event: nueva-puja] ${bidder.name} ofertó $${newPrice} en "${randomAuction.title}"`,
        ...prev
      ]);

      const userWasWinning = randomAuction.bids.length > 0 && randomAuction.bids[0].bidderName === user.name;
      if (userWasWinning) {
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          type: "warning",
          title: "¡Has sido superado!",
          message: `Te han superado en "${randomAuction.title}". Nueva oferta actual: $${newPrice}. Incrementa tu puja para recuperar el liderazgo.`,
          time: new Date().toISOString(),
          read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
        setSseLogs(prev => [
          `🔔 [Notificación Push: outbid] Enviada a Usuario`,
          ...prev
        ]);
      }

      if (selectedAuction && selectedAuction.id === randomAuction.id) {
        setSelectedAuction(prev => {
          if (!prev) return null;
          const newBid: Bid = {
            id: `b-sim-${Date.now()}`,
            auctionId: prev.id,
            bidderName: bidder.name,
            bidderAvatar: bidder.avatar,
            amount: newPrice,
            time: new Date().toISOString()
          };
          return {
            ...prev,
            currentPrice: newPrice,
            bidsCount: prev.bidsCount + 1,
            bids: [newBid, ...prev.bids]
          };
        });
      }

    }, 35000);

    return () => clearInterval(interval);
  }, [auctions, user.name, selectedAuction]);

  const handleAddFunds = () => {
    setUser(prev => ({ ...prev, balance: prev.balance + 1000 }));
    setSseLogs(prev => ["💵 [Wallet] Añadidos \$1.000 ARS de prueba.", ...prev]);
    triggerBanner("Se agregaron \$1.000 ARS de prueba a tu saldo de prueba.");
  };

  const triggerBanner = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setBidError('');

    if (!selectedAuction) return;

    const me = users.find(u => u.email === INITIAL_USER.name || u.name === INITIAL_USER.name);
    if (me && me.status === 'BLOCKED') {
      setBidError('Tu usuario ha sido BLOQUEADO por un administrador. No puedes realizar ofertas.');
      return;
    }

    const numericAmount = parseFloat(bidAmount);
    if (isNaN(numericAmount)) {
      setBidError('Por favor ingresa un monto numérico válido.');
      return;
    }

    const minRequired = selectedAuction.currentPrice + selectedAuction.minIncrement;
    if (numericAmount < minRequired) {
      setBidError(`La oferta mínima requerida es de $${minRequired.toLocaleString('es-ES')}`);
      return;
    }

    if (user.balance < numericAmount) {
      setBidError('Saldo insuficiente en tu billetera de prueba para realizar esta puja.');
      return;
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      auctionId: selectedAuction.id,
      bidderName: user.name,
      bidderAvatar: user.avatar,
      amount: numericAmount,
      time: new Date().toISOString(),
      isCurrentUser: true
    };

    setUser(prev => ({ ...prev, balance: prev.balance - numericAmount }));
    setAuctions(prev => prev.map(a => {
      if (a.id === selectedAuction.id) {
        return {
          ...a,
          currentPrice: numericAmount,
          bidsCount: a.bidsCount + 1,
          bids: [newBid, ...a.bids]
        };
      }
      return a;
    }));

    setSelectedAuction(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentPrice: numericAmount,
        bidsCount: prev.bidsCount + 1,
        bids: [newBid, ...prev.bids]
      };
    });

    setBidAmount('');
    setSseLogs(prev => [
      `🚀 [SSE Event: nueva-puja] Realizaste una oferta por $${numericAmount} en "${selectedAuction.title}"`,
      ...prev
    ]);

    triggerBanner(`¡Tu oferta de $${numericAmount} fue registrada exitosamente! Eres el líder de la subasta.`);
  };

  const handleQuickBid = (auctionId: string) => {
    const targetAuction = auctions.find(a => a.id === auctionId);
    if (!targetAuction) return;

    const me = users.find(u => u.name === INITIAL_USER.name);
    if (me && me.status === 'BLOCKED') {
      triggerBanner("Error: Tu usuario está bloqueado por el administrador.");
      return;
    }

    const bidVal = targetAuction.currentPrice + targetAuction.minIncrement;
    if (user.balance < bidVal) {
      triggerBanner("Error: Saldo insuficiente para realizar puja rápida.");
      return;
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      auctionId: targetAuction.id,
      bidderName: user.name,
      bidderAvatar: user.avatar,
      amount: bidVal,
      time: new Date().toISOString(),
      isCurrentUser: true
    };

    setUser(prev => ({ ...prev, balance: prev.balance - bidVal }));
    setAuctions(prev => prev.map(a => {
      if (a.id === targetAuction.id) {
        return {
          ...a,
          currentPrice: bidVal,
          bidsCount: a.bidsCount + 1,
          bids: [newBid, ...a.bids]
        };
      }
      return a;
    }));

    if (selectedAuction && selectedAuction.id === targetAuction.id) {
      setSelectedAuction(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentPrice: bidVal,
          bidsCount: prev.bidsCount + 1,
          bids: [newBid, ...prev.bids]
        };
      });
    }

    setSseLogs(prev => [
      `🚀 [SSE Event: nueva-puja] Puja rápida realizada por $${bidVal} en "${targetAuction.title}"`,
      ...prev
    ]);

    triggerBanner(`¡Puja rápida de $${bidVal} registrada con éxito!`);
  };

  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBasePrice || !newMinIncrement || !newDescription.trim()) {
      triggerBanner("Error: Por favor completa todos los campos requeridos.");
      return;
    }

    const newAuction: Auction = {
      id: `${auctions.length + 1}`,
      title: newTitle,
      category: newCategory,
      image: newImage || "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800",
      startingPrice: parseFloat(newBasePrice),
      currentPrice: parseFloat(newBasePrice),
      minIncrement: parseFloat(newMinIncrement),
      bidsCount: 0,
      endTime: new Date(Date.now() + 1000 * 60 * parseFloat(newDuration)).toISOString(),
      createdAt: new Date().toISOString(),
      seller: {
        name: user.name,
        rating: user.rating,
        avatar: user.avatar
      },
      description: newDescription,
      bids: [],
      status: "active"
    };

    setAuctions(prev => [newAuction, ...prev]);
    setSseLogs(prev => [
      `📝 [Subasta Creada] Se publicó la subasta en estado PUBLICADA: "${newTitle}"`,
      `📢 [SSE Event: cambio-estado] Nueva subasta registrada.`,
      ...prev
    ]);

    triggerBanner(`¡Felicidades! Tu artículo "${newTitle}" ya está publicado.`);
    
    setNewTitle('');
    setNewBasePrice('');
    setNewMinIncrement('');
    setNewDescription('');
    setNewImage('');
    setCurrentTab('catalog');
  };

  const handleOpenDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    const newDispute: Dispute = {
      id: `disp-${disputes.length + 1}`,
      subastaId: selectedAuction.id,
      subastaTitle: selectedAuction.title,
      iniciador: `${user.name} (Involucrado)`,
      motivo: disputeMotive,
      descripcion: disputeText,
      fechaCreacion: new Date().toISOString(),
      estado: 'ABIERTA'
    };

    setDisputes(prev => [newDispute, ...prev]);
    setSseLogs(prev => [
      `⚠️ [Disputa Registrada] Se abrió un reclamo en la subasta #${selectedAuction.id} por ${disputeMotive}`,
      `📢 [SSE Event] Administradores notificados de un conflicto activo.`,
      ...prev
    ]);

    setAuctions(prev => prev.map(a => {
      if (a.id === selectedAuction.id) {
        return { ...a, status: 'finished' };
      }
      return a;
    }));

    triggerBanner("Se ha abierto la disputa de forma oficial. El Administrador revisará los descargos y dictará resolución.");
    setShowDisputeForm(false);
    setDisputeMotiveText('');
  };

  const handleResolveDispute = (
    id: string, 
    finalState: 'ADJUDICADA' | 'CANCELADA' | 'FINALIZADA', 
    resolution: string
  ) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          estado: 'RESUELTA',
          resolucionAdmin: resolution,
          estadoFinalSubasta: finalState,
          fechaResolucion: new Date().toISOString()
        };
      }
      return d;
    }));

    const targetDispute = disputes.find(d => d.id === id);
    if (targetDispute) {
      setSseLogs(prev => [
        `⚖️ [Dictamen Admin] Disputa #${id} resuelta. Estado final: ${finalState}`,
        `📢 [SSE Event: cambio-estado] Subasta #${targetDispute.subastaId} transicionada a ${finalState}`,
        ...prev
      ]);

      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        type: "success",
        title: "Resolución de Disputa",
        message: `El Administrador resolvió el conflicto de "${targetDispute.subastaTitle}". Dictamen: "${resolution}"`,
        time: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    triggerBanner(`Disputa resuelta exitosamente. Se aplicó el estado: ${finalState}`);
  };

  const handleToggleUserStatus = (id: string) => {
    let affectedUser: UserAccount | undefined;
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        affectedUser = u;
        return {
          ...u,
          status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
        };
      }
      return u;
    }));

    if (affectedUser) {
      const willBlock = affectedUser.status === 'ACTIVE';
      setSseLogs(prev => [
        `🔒 [ADMIN] Usuario ${affectedUser?.name} cambiado a ${willBlock ? 'BLOQUEADO' : 'ACTIVO'}.`,
        willBlock ? `❌ [Post Logout] Refresh Token del usuario revocado en tabla token_blacklist de PostgreSQL.` : `✓ [Post Status] Cuenta habilitada para operar.`,
        willBlock ? `🔌 [SSE Connection] Conexiones EventSource cerradas mediante completeWithError().` : `📡 [SSE Connection] Permitido suscribirse a canales.`,
        ...prev
      ]);

      triggerBanner(`El usuario ${affectedUser.name} ahora se encuentra ${willBlock ? 'BLOQUEADO' : 'ACTIVO'}.`);
    }
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredAuctions = auctions.filter(a => {
    const matchesCategory = selectedCategory === 'Todos' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const myBidsAuctions = auctions.filter(a => 
    a.bids.some(b => b.bidderName === user.name)
  );

  return (
    <div className="min-h-screen bg-main text-text-primary font-sans antialiased selection:bg-amber-500 selection:text-black">
      
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-fade-in">
          <div className="flex items-center space-x-3 rounded-2xl border border-emerald-500/20 bg-surface/90 backdrop-blur-md p-4 text-xs font-medium text-emerald-400 shadow-2xl shadow-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full border-b border-border bg-main/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div 
            onClick={() => { setCurrentTab('catalog'); setSelectedAuction(null); }}
            className="flex cursor-pointer items-center space-x-2.5 transition-all active:scale-95 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/25 transition-all">
              <Gavel className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-lg font-extrabold tracking-tight text-white block">
                Uni<span className="text-amber-500">Subastas</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-text-muted">
                TPI • Programación IV
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => { setCurrentTab('catalog'); setSelectedAuction(null); }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                currentTab === 'catalog'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-text-secondary hover:bg-input/40 hover:text-text-primary border border-transparent'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Catálogo</span>
            </button>

            <button
              onClick={() => { setCurrentTab('my-bids'); setSelectedAuction(null); }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                currentTab === 'my-bids'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-text-secondary hover:bg-input/40 hover:text-text-primary border border-transparent'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Mis Ofertas ({myBidsAuctions.length})</span>
            </button>

            <button
              onClick={() => { setCurrentTab('create'); setSelectedAuction(null); }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                currentTab === 'create'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-text-secondary hover:bg-input/40 hover:text-text-primary border border-transparent'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Vender</span>
            </button>

            <button
              onClick={() => { setCurrentTab('admin'); setSelectedAuction(null); }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-extrabold'
                  : 'text-text-secondary hover:bg-input/40 hover:text-text-primary border border-transparent'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Panel Admin</span>
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            
            <div className="flex items-center space-x-2.5 rounded-xl border border-border bg-surface py-1 pl-3 pr-2">
              <Coins className="h-4 w-4 text-amber-400 animate-pulse-slow" />
              <div className="text-right">
                <span className="block text-[8px] font-bold uppercase tracking-wider text-text-muted">
                  Saldo Universitario
                </span>
                <span className="font-mono text-xs font-bold text-text-primary">
                  ${user.balance.toLocaleString('es-ES')}
                </span>
              </div>
              <button
                onClick={handleAddFunds}
                title="Añadir fondos de prueba"
                className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                  showNotifications 
                    ? 'border-amber-500/30 bg-amber-500/5 text-amber-400' 
                    : 'border-border bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-surface p-2 shadow-2xl z-50 animate-fade-in max-h-80 overflow-y-auto">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Avisos del Sistema</span>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300"
                    >
                      Leídos todos
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <span className="block py-6 text-center text-xs text-text-muted">No tienes notificaciones</span>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl text-xs transition-colors mb-1 ${
                          n.read ? 'opacity-55' : 'bg-input/40 border-l-2 border-amber-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-text-primary">{n.title}</span>
                          <span className="text-[9px] font-mono text-text-muted">{new Date(n.time).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-text-secondary text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 pl-3 border-l border-border">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-500/20"
              />
              <div className="hidden lg:block text-left">
                <span className="block text-xs font-semibold text-text-primary">{user.name}</span>
                <span className="block text-[9px] text-amber-500 font-bold uppercase">Rol: USER, SELLER</span>
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 gap-6">

          {currentTab === 'catalog' && !selectedAuction && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border">
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar artículos (ej. MacBook, Fender)..."
                    className="w-full rounded-xl border border-border bg-input py-2 px-4 text-xs text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto overflow-x-auto max-w-full">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                          : 'bg-input border border-border text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAuctions.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-dashed border-border">
                  <span className="block text-text-muted text-sm">No se encontraron subastas que coincidan con los filtros</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAuctions.map(auc => (
                    <div 
                      key={auc.id} 
                      className="cursor-pointer"
                      onClick={() => setSelectedAuction(auc)}
                    >
                      <div className="relative group rounded-2xl border border-border bg-surface overflow-hidden hover:border-border/80 transition-all duration-300">
                        <div className="absolute top-3 left-3 z-10 rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-text-primary backdrop-blur">
                          <span className="text-amber-500 font-bold uppercase mr-1">
                            {new Date(auc.endTime).getTime() > Date.now() ? 'ACTIVA' : 'FINALIZADA'}
                          </span>
                          {auc.category}
                        </div>

                        <div className="aspect-video w-full overflow-hidden bg-input/60 relative">
                          <img 
                            src={auc.image} 
                            alt={auc.title} 
                            className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                          <CardCountdown endTime={auc.endTime} />
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between text-[11px] text-text-muted mb-2">
                            <span>Vendedor: {auc.seller.name}</span>
                            <span className="text-amber-500">{auc.seller.rating} ★</span>
                          </div>

                          <h3 className="font-display font-bold text-base text-text-primary mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
                            {auc.title}
                          </h3>

                          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4">
                            {auc.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-semibold mb-0.5">Oferta Actual</span>
                              <span className="font-mono text-base font-extrabold text-amber-500">
                                ${auc.currentPrice.toLocaleString('es-ES')}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[9px] uppercase tracking-wider text-text-muted font-semibold mb-0.5">Pujas Realizadas</span>
                              <span className="font-mono font-bold text-text-primary block mt-0.5">{auc.bidsCount}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button className="flex-1 rounded-xl bg-input hover:bg-input border border-border py-2.5 text-center text-xs font-bold text-text-primary hover:text-white transition-colors cursor-pointer">
                              Ver Detalle
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleQuickBid(auc.id); }}
                              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center space-x-1 cursor-pointer transition-colors shadow-lg shadow-amber-500/5 active:scale-95"
                            >
                              <Gavel className="h-3.5 w-3.5" />
                              <span>+${auc.minIncrement}</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentTab === 'my-bids' && !selectedAuction && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-4">
                <h3 className="font-display text-lg font-bold text-text-primary uppercase tracking-wide">Tus Ofertas Activas</h3>
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg">
                  {myBidsAuctions.length} Subastas
                </span>
              </div>

              {myBidsAuctions.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-dashed border-border">
                  <Award className="h-10 w-10 text-text-secondary/60 mx-auto mb-3" />
                  <span className="block text-text-muted text-sm">Aún no has ofertado en ninguna subasta</span>
                  <button 
                    onClick={() => setCurrentTab('catalog')}
                    className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors"
                  >
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myBidsAuctions.map(auc => {
                    const latestBid = auc.bids.length > 0 ? auc.bids[0] : null;
                    const amWinning = latestBid ? latestBid.bidderName === user.name : false;
                    return (
                      <div 
                        key={auc.id}
                        className={`rounded-2xl border p-4 bg-surface relative overflow-hidden transition-all hover:scale-101 cursor-pointer ${
                          amWinning ? 'border-emerald-500/20' : 'border-rose-500/20'
                        }`}
                        onClick={() => setSelectedAuction(auc)}
                      >
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            amWinning ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {amWinning ? 'VAS GANANDO' : 'SUPERADO'}
                          </span>
                        </div>

                        <span className="text-[10px] text-text-muted block uppercase font-mono tracking-wider">{auc.category}</span>
                        <h4 className="font-bold text-sm text-text-primary mt-1 line-clamp-1">{auc.title}</h4>
                        
                        <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-4 text-xs">
                          <div>
                            <span className="block text-[9px] text-text-muted uppercase">Oferta Actual</span>
                            <span className="font-mono font-extrabold text-amber-400">${auc.currentPrice.toLocaleString('es-ES')}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-text-muted uppercase text-right">Tu Última Puja</span>
                            <span className="font-mono font-bold text-text-primary block text-right">
                              ${auc.bids.find(b => b.bidderName === user.name)?.amount.toLocaleString('es-ES')}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button className="flex-1 bg-input border border-border hover:bg-input py-2 rounded-xl text-xs text-text-primary font-bold transition-all">
                            Ver Panel de Puja
                          </button>
                          {!amWinning && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleQuickBid(auc.id); }}
                              className="px-3 bg-amber-500 hover:bg-amber-400 text-black py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
                            >
                              <Gavel className="h-3.5 w-3.5" />
                              <span>Superar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentTab === 'create' && !selectedAuction && (
            <div className="max-w-xl mx-auto bg-surface border border-border p-6 rounded-2xl animate-fade-in">
              <div className="border-b border-border pb-3 mb-5">
                <h3 className="font-display text-base font-bold text-text-primary uppercase tracking-wider">Publicar Nuevo Artículo</h3>
                <p className="text-[11px] text-text-muted">Crea el producto y regístralo como BORRADOR (luego cambia a PUBLICADA)</p>
              </div>

              <form onSubmit={handleCreateAuction} className="space-y-4 text-xs">
                <div>
                  <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Título del Artículo:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                    placeholder="ej. iPhone 15 Pro Max impecable caja original"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Categoría:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full rounded-xl border border-border bg-input p-3 text-text-primary focus:border-amber-500 focus:outline-none"
                    >
                      {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Duración de la Subasta (Minutos):</label>
                    <input
                      type="number"
                      required
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full rounded-xl border border-border bg-input p-3 text-text-primary focus:border-amber-500 focus:outline-none font-mono"
                      placeholder="ej. 10"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Precio Base (ARS):</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-text-muted">$</span>
                      </div>
                      <input
                        type="number"
                        required
                        value={newBasePrice}
                        onChange={(e) => setNewBasePrice(e.target.value)}
                        className="w-full rounded-xl border border-border bg-input py-3 pl-8 pr-3 text-text-primary focus:border-amber-500 focus:outline-none font-mono"
                        placeholder="ej. 250"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Incremento Mínimo (ARS):</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-text-muted">$</span>
                      </div>
                      <input
                        type="number"
                        required
                        value={newMinIncrement}
                        onChange={(e) => setNewMinIncrement(e.target.value)}
                        className="w-full rounded-xl border border-border bg-input py-3 pl-8 pr-3 text-text-primary focus:border-amber-500 focus:outline-none font-mono"
                        placeholder="ej. 10"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">URL de la Imagen (Opcional):</label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                    placeholder="https://images.unsplash.com/... (o deja en blanco para genérico)"
                  />
                </div>

                <div>
                  <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Descripción Detallada:</label>
                  <textarea
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full h-24 rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none leading-relaxed"
                    placeholder="Describe las condiciones, detalles técnicos y procedencia del producto..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-amber-500/5 active:scale-98"
                  >
                    Publicar Artículo en Vivo
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentTab === 'admin' && !selectedAuction && (
            <div className="animate-fade-in">
              <AdminPanel
                disputes={disputes}
                users={users}
                auctions={auctions}
                onResolveDispute={handleResolveDispute}
                onToggleUserStatus={handleToggleUserStatus}
                sseLogs={sseLogs}
              />
            </div>
          )}

          {selectedAuction && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center space-x-2 text-xs">
                <button 
                  onClick={() => setSelectedAuction(null)}
                  className="text-text-secondary hover:text-text-primary font-bold"
                >
                  Catálogo
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-text-muted font-medium truncate max-w-[200px]">{selectedAuction.title}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-surface border border-border rounded-2xl overflow-hidden relative">
                    <img 
                      src={selectedAuction.image} 
                      alt={selectedAuction.title} 
                      className="w-full aspect-video object-cover opacity-90"
                    />
                    
                    <div className="absolute top-4 left-4 flex items-center space-x-1.5 rounded-full bg-main/85 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                      <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                      <span>Fin de Subasta: {formatDate(selectedAuction.endTime)}</span>
                    </div>
                  </div>

                  <div className="bg-surface border border-border p-5 rounded-2xl">
                    <h4 className="font-display font-bold text-sm tracking-wide uppercase text-text-primary border-b border-border pb-2 mb-3">
                      Descripción del Producto
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      {selectedAuction.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-border/60 pt-4 text-xs">
                      <div>
                        <span className="block text-[9px] text-text-muted uppercase">Categoría</span>
                        <strong className="text-text-primary mt-0.5 block">{selectedAuction.category}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-text-muted uppercase">Vendedor</span>
                        <strong className="text-text-primary mt-0.5 block">{selectedAuction.seller.name}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-text-muted uppercase">Reputación Vendedor</span>
                        <strong className="text-amber-500 mt-0.5 block">{selectedAuction.seller.rating} ★</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-text-muted uppercase">Fecha Lanzamiento</span>
                        <strong className="text-text-secondary mt-0.5 block font-mono">{formatDate(selectedAuction.createdAt)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-surface border border-border p-5 rounded-2xl">
                    <span className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Pizarra de Cotización</span>
                    <div className="flex items-baseline justify-between border-b border-border/80 pb-3 mb-4">
                      <span className="text-xs font-bold text-text-primary">Oferta Máxima Actual</span>
                      <span className="font-mono text-2xl font-black text-amber-400">${selectedAuction.currentPrice.toLocaleString('es-ES')}</span>
                    </div>

                    <div className="space-y-3 mb-5 text-xs text-text-secondary">
                      <div className="flex items-center justify-between">
                        <span>Pujas Confirmadas:</span>
                        <strong className="text-text-primary">{selectedAuction.bidsCount}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Incremento Mínimo:</span>
                        <strong className="text-text-primary font-mono">+${selectedAuction.minIncrement}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Oferta Mínima Requerida:</span>
                        <strong className="text-amber-500 font-mono">${(selectedAuction.currentPrice + selectedAuction.minIncrement).toLocaleString('es-ES')}</strong>
                      </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handlePlaceBid(e); }} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Tu Propuesta (ARS):</label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-text-muted font-mono">$</span>
                          </div>
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="w-full rounded-xl border border-border bg-input py-3 pl-8 pr-3 text-xs text-text-primary focus:border-amber-500 focus:outline-none font-mono"
                            placeholder={`${selectedAuction.currentPrice + selectedAuction.minIncrement}`}
                            min={selectedAuction.currentPrice + selectedAuction.minIncrement}
                          />
                        </div>
                        {bidError && <span className="block mt-1 text-[11px] font-semibold text-rose-400 leading-normal">{bidError}</span>}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/5"
                        >
                          Confirmar Oferta
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickBid(selectedAuction.id)}
                          className="px-4 bg-input border border-border text-text-primary font-bold hover:bg-input text-xs py-3 rounded-xl active:scale-95"
                          title="Puja rápida automática"
                        >
                          +${selectedAuction.minIncrement}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-surface border border-border p-5 rounded-2xl">
                    <span className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Mesa de Ayuda (TPI)</span>
                    <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                      ¿Hay algún inconveniente con el pago, envío o la calidad del artículo? Como vendedor o ganador, tienes derecho a iniciar una mediación con los Administradores de la universidad.
                    </p>
                    
                    {!showDisputeForm ? (
                      <button
                        onClick={() => setShowDisputeForm(true)}
                        className="w-full bg-rose-500/15 border border-rose-500/20 hover:bg-rose-500 hover:text-black transition-all py-2 rounded-xl text-xs font-bold text-rose-400"
                      >
                        Abrir Reclamo o Disputa
                      </button>
                    ) : (
                      <form onSubmit={handleOpenDispute} className="space-y-3 mt-3 border-t border-border/60 pt-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Motivo del Conflicto:</label>
                          <select
                            value={disputeMotive}
                            onChange={(e) => setDisputeMotive(e.target.value as any)}
                            className="w-full rounded-xl border border-border bg-input p-2.5 text-text-primary focus:border-amber-500 focus:outline-none"
                          >
                            <option value="PRODUCTO_NO_RECIBIDO">Producto No Recibido</option>
                            <option value="FALTA_DE_PAGO">Falta de Pago del Ganador</option>
                            <option value="FRAUDE">Posible Fraude / Engaño</option>
                            <option value="OTRO">Otro Motivo de Fuerza Mayor</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Fundamentos Detallados:</label>
                          <textarea
                            value={disputeText}
                            onChange={(e) => setDisputeMotiveText(e.target.value)}
                            required
                            rows={3}
                            className="w-full rounded-xl border border-border bg-input p-2.5 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                            placeholder="Describe qué ocurrió detalladamente para que el administrador pueda evaluarlo..."
                          />
                        </div>

                        <div className="flex gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowDisputeForm(false)}
                            className="px-3 py-1.5 rounded-lg bg-input border border-border hover:bg-input text-xs font-medium text-text-secondary"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-black text-xs font-bold"
                          >
                            Registrar Reclamo
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="bg-surface border border-border p-5 rounded-2xl">
                    <span className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                      <History className="h-3.5 w-3.5 text-amber-500" />
                      <span>Historial de Ofertas (Stream)</span>
                    </span>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {selectedAuction.bids.length === 0 ? (
                        <span className="block py-4 text-center text-xs text-text-muted italic">No hay ofertas registradas aún</span>
                      ) : (
                        selectedAuction.bids.map((b, i) => (
                          <div 
                            key={b.id} 
                            className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                              i === 0 
                                ? 'bg-amber-500/5 border border-amber-500/10 font-bold text-amber-400' 
                                : 'bg-input/50 border border-transparent text-text-secondary'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <img 
                                src={b.bidderAvatar} 
                                alt={b.bidderName} 
                                className="h-5.5 w-5.5 rounded-full object-cover"
                              />
                              <span className="truncate max-w-[100px]">{b.bidderName}</span>
                            </div>
                            <span className="font-mono">${b.amount.toLocaleString('es-ES')}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

      </main>

      <footer className="mt-20 border-t border-border bg-main py-8 text-center text-xs text-text-muted leading-loose">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-2 text-text-muted">
            <Gavel className="h-4 w-4" />
            <span className="font-display font-semibold tracking-wide text-text-secondary uppercase text-[10px]">Portal de Subastas Universitarias (TPI)</span>
          </div>
          <p className="max-w-md">
            Desarrollado entre 3 integrantes del grupo de Programación IV de la Universidad Tecnológica Nacional (UTN FRVM). El código de este front se integra de forma directa con los controladores y servicios REST expuestos en el backend de Spring Boot.
          </p>
          <span className="block text-[10px] text-text-secondary font-mono mt-2">© 2026 • UTN FRVM • Todos los derechos reservados de prueba</span>
        </div>
      </footer>

    </div>
  );
}

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  return d.toLocaleString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
