import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Users,
  Radio,
  CheckCircle,
  Ban,
  Unlock,
  Clock,
  MessageSquare,
  Tag,
  Plus,
  Pencil,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { Dispute, UserAccount, Auction } from '../types';
import type { Categoria } from '../services/categoriaService';

interface AdminPanelProps {
  disputes: Dispute[];
  users: UserAccount[];
  auctions: Auction[];
  categorias: Categoria[];
  onResolveDispute: (id: string, state: 'ADJUDICADA' | 'CANCELADA' | 'FINALIZADA', resolution: string) => void;
  onToggleUserStatus: (id: string) => void;
  onCrearCategoria: (nombre: string) => Promise<void>;
  onActualizarCategoria: (id: number, nombre: string) => Promise<void>;
  onEliminarCategoria: (id: number) => Promise<void>;
  sseLogs: string[];
}

export default function AdminPanel({
  disputes,
  users,
  auctions,
  categorias,
  onResolveDispute,
  onToggleUserStatus,
  onCrearCategoria,
  onActualizarCategoria,
  onEliminarCategoria,
  sseLogs
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'disputes' | 'users' | 'monitor' | 'categorias'>('disputes');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoNombre, setEditandoNombre] = useState('');
  const [categoriaSaving, setCategoriaSaving] = useState(false);
  const [categoriaError, setCategoriaError] = useState('');
  const [disputeFilter, setDisputeFilter] = useState<'TODOS' | 'ABIERTA' | 'RESUELTA'>('TODOS');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionState, setResolutionState] = useState<'ADJUDICADA' | 'CANCELADA' | 'FINALIZADA'>('CANCELADA');
  const [resolutionText, setResolutionText] = useState('');
  const [errorText, setErrorText] = useState('');

  const filteredDisputes = disputes.filter(d => {
    if (disputeFilter === 'TODOS') return true;
    return d.estado === disputeFilter;
  });

  const handleOpenResolve = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setResolutionText('');
    setResolutionState('CANCELADA');
    setErrorText('');
  };

  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionText.trim()) {
      setErrorText('Debes ingresar una resolución administrativa detallada.');
      return;
    }
    if (selectedDispute) {
      onResolveDispute(selectedDispute.id, resolutionState, resolutionText);
      setSelectedDispute(null);
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMotiveLabel = (motive: string) => {
    switch (motive) {
      case 'FRAUDE': return 'Posible Fraude';
      case 'FALTA_DE_PAGO': return 'Falta de Pago';
      case 'PRODUCTO_NO_RECIBIDO': return 'Producto No Recibido';
      default: return 'Otro Motivo';
    }
  };

  const getMotiveClass = (motive: string) => {
    switch (motive) {
      case 'FRAUDE': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'FALTA_DE_PAGO': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'PRODUCTO_NO_RECIBIDO': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      default: return 'bg-input0/10 text-text-secondary border border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface text-text-primary overflow-hidden">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-border bg-main px-5 py-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/5">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-wide uppercase text-text-primary">
              Panel del Administrador
            </h3>
            <p className="text-[11px] text-text-muted">Mediación de Conflictos y Control de Seguridad (TPI)</p>
          </div>
        </div>

        
        <div className="flex rounded-xl bg-input border border-border p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'disputes'
                ? 'bg-amber-500 text-[#0A0A0C] shadow-md shadow-amber-500/10'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Disputas ({disputes.filter(d => d.estado === 'ABIERTA').length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-amber-500 text-[#0A0A0C] shadow-md shadow-amber-500/10'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Usuarios ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'monitor'
                ? 'bg-amber-500 text-[#0A0A0C] shadow-md shadow-amber-500/10'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Monitor SSE</span>
          </button>

          <button
            onClick={() => setActiveTab('categorias')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'categorias'
                ? 'bg-amber-500 text-[#0A0A0C] shadow-md shadow-amber-500/10'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Tag className="h-3.5 w-3.5" />
            <span>Categorías ({categorias.length})</span>
          </button>
        </div>
      </div>

      
      <div className="flex-1 p-5 overflow-y-auto max-h-[600px] bg-main">
        
        
        {activeTab === 'disputes' && (
          <div className="space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between bg-input border border-border/60 p-3 rounded-xl">
              <span className="text-xs text-text-secondary font-medium">Filtrar Reclamos:</span>
              <div className="flex space-x-1">
                {(['TODOS', 'ABIERTA', 'RESUELTA'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setDisputeFilter(f)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide transition-all ${
                      disputeFilter === f
                        ? 'bg-input text-amber-400 border border-amber-500/30'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredDisputes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border">
                <CheckCircle className="h-10 w-10 text-emerald-500/40 mb-3" />
                <span className="text-sm font-semibold text-text-secondary">Sin conflictos en esta categoría</span>
                <span className="text-xs text-text-muted mt-1">Todas las subastas operan en total conformidad.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDisputes.map(dispute => (
                  <div 
                    key={dispute.id} 
                    className={`rounded-xl border p-4 bg-surface transition-all hover:border-border/80 ${
                      dispute.estado === 'ABIERTA' ? 'border-amber-500/20' : 'border-border'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/60 pb-3 mb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Subasta Adjudicada #{dispute.subastaId}</span>
                        <h4 className="text-sm font-bold text-text-primary">{dispute.subastaTitle}</h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getMotiveClass(dispute.motivo)}`}>
                          {getMotiveLabel(dispute.motivo)}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dispute.estado === 'ABIERTA' 
                            ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {dispute.estado === 'ABIERTA' ? 'ABIERTA' : 'RESUELTA'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="md:col-span-2 space-y-2">
                        <div className="flex items-start space-x-2 bg-input p-3 rounded-lg border border-border/40">
                          <MessageSquare className="h-4 w-4 text-text-muted mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="block font-semibold text-text-secondary text-[11px]">Fundamentos del Reclamo:</span>
                            <p className="text-text-primary leading-relaxed mt-1">{dispute.descripcion}</p>
                          </div>
                        </div>

                        {dispute.estado === 'RESUELTA' && (
                          <div className="flex items-start space-x-2 bg-emerald-950/10 p-3 rounded-lg border border-emerald-500/20">
                            <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="block font-semibold text-emerald-400 text-[11px]">Resolución Administrativa:</span>
                              <p className="text-text-primary leading-relaxed mt-1">{dispute.resolucionAdmin}</p>
                              <div className="flex items-center space-x-1.5 mt-2 text-[10px] text-emerald-500/80">
                                <span>Estado final establecido:</span>
                                <strong className="font-mono uppercase bg-emerald-500/10 px-1 py-0.5 rounded">{dispute.estadoFinalSubasta}</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-input/50 p-3 rounded-lg border border-border/50 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-text-muted">Iniciado por:</span>
                            <span className="font-medium text-text-primary">{dispute.iniciador}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-text-muted">Fecha de apertura:</span>
                            <span className="font-mono text-text-secondary">{formatDate(dispute.fechaCreacion)}</span>
                          </div>
                          {dispute.estado === 'RESUELTA' && dispute.fechaResolucion && (
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-text-muted">Fecha resolución:</span>
                              <span className="font-mono text-text-secondary">{formatDate(dispute.fechaResolucion)}</span>
                            </div>
                          )}
                        </div>

                        {dispute.estado === 'ABIERTA' && (
                          <button
                            onClick={() => handleOpenResolve(dispute)}
                            className="w-full mt-4 bg-amber-500 text-[#0A0A0C] hover:bg-amber-400 py-2 rounded-lg font-bold text-xs transition-colors shadow-md shadow-amber-500/5"
                          >
                            Mediar & Resolver
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl text-xs text-text-secondary leading-relaxed flex items-start space-x-3">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-text-primary block mb-1">Políticas de Moderación (OWASP A01 & A07)</strong>
                Al aplicar un bloqueo sobre un usuario, el backend revoca de forma inmediata su token en la tabla de blacklist en PostgreSQL. Las conexiones SSE activas para recibir notificaciones y pujas son cerradas por el <code className="text-amber-400 bg-input px-1 py-0.5 rounded font-mono">SseSubscriptionService</code>.
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full text-left text-xs divide-y divide-slate-800">
                <thead className="bg-main text-text-secondary font-semibold">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Roles</th>
                    <th className="px-4 py-3">Calificación</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-text-primary">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-input/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-text-primary">{user.name}</td>
                      <td className="px-4 py-3 font-mono text-text-secondary">{user.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {user.roles.map(r => (
                            <span key={r} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              r === 'ADMIN' ? 'bg-red-500/15 text-red-400 border border-red-500/10' :
                              r === 'SELLER' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/10' :
                              'bg-input0/15 text-text-secondary border border-slate-500/10'
                            }`}>
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-amber-500 font-bold">{user.rating} ★</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {user.status === 'ACTIVE' ? 'Activo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {user.roles.includes('ADMIN') ? (
                          <span className="text-[10px] text-text-muted font-medium italic">Protegido (Admin)</span>
                        ) : (
                          <button
                            onClick={() => onToggleUserStatus(user.id)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all ${
                              user.status === 'ACTIVE'
                                ? 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-[#0A0A0C]'
                                : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-[#0A0A0C]'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? (
                              <span className="flex items-center space-x-1 justify-end">
                                <Ban className="h-3 w-3" />
                                <span>Bloquear</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1 justify-end">
                                <Unlock className="h-3 w-3" />
                                <span>Desbloquear</span>
                              </span>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        
        {activeTab === 'monitor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span>Canal SSE Global Admin (Sin Anonimizar)</span>
                </span>
                <span className="text-[10px] font-mono text-text-muted">Filtro de seguridad omitido</span>
              </div>

              {auctions.map(auction => {
                const latestBid = auction.bids.length > 0 ? auction.bids[0] : null;
                return (
                  <div key={auction.id} className="bg-input border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4">
                    
                    <img 
                      src={auction.image} 
                      alt={auction.title}
                      className="w-full md:w-24 h-24 md:h-20 object-cover rounded-lg bg-input border border-border"
                    />

                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-xs font-bold text-text-primary">{auction.title}</h5>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                            auction.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-input text-text-secondary'
                          }`}>
                            {auction.status === 'active' ? 'ACTIVA' : 'FINALIZADA'}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted line-clamp-1">{auction.description}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-2 mt-2">
                        <div>
                          <span className="block text-[9px] text-text-muted uppercase">Oferta Actual</span>
                          <span className="font-mono text-xs font-bold text-amber-500">${auction.currentPrice.toLocaleString('es-ES')}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-text-muted uppercase">Total Pujas</span>
                          <span className="text-xs font-semibold text-text-primary">{auction.bidsCount}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-text-muted uppercase">Último Postor</span>
                          <span className="text-xs font-semibold text-sky-400 truncate block">
                            {latestBid ? latestBid.bidderName : 'Ninguno'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            
            <div className="bg-main border border-border rounded-xl p-4 flex flex-col h-[400px]">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider pb-3 border-b border-border flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Logs del Servidor SSE</span>
              </span>

              <div className="flex-1 overflow-y-auto font-mono text-[10px] text-emerald-400/90 leading-relaxed mt-3 space-y-2 select-all">
                {sseLogs.length === 0 ? (
                  <span className="text-text-muted italic block py-4 text-center">Escuchando eventos de red...</span>
                ) : (
                  sseLogs.map((log, i) => (
                    <div key={i} className="border-b border-slate-900/80 pb-1.5">
                      <span className="text-emerald-500 font-bold">{`[${new Date().toLocaleTimeString()}] `}</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categorías tab */}
        {activeTab === 'categorias' && (
          <div className="space-y-4 animate-fade-in">
            {/* Crear nueva */}
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!nuevaCategoria.trim()) return;
                setCategoriaSaving(true);
                setCategoriaError('');
                try {
                  await onCrearCategoria(nuevaCategoria.trim());
                  setNuevaCategoria('');
                } catch (err: unknown) {
                  const axiosErr = err as { response?: { data?: { mensaje?: string } } };
                  setCategoriaError(axiosErr.response?.data?.mensaje ?? 'Error al crear la categoría');
                } finally {
                  setCategoriaSaving(false);
                }
              }}
              className="flex gap-2"
            >
              <input
                value={nuevaCategoria}
                onChange={e => setNuevaCategoria(e.target.value)}
                placeholder="Nueva categoría..."
                className="flex-1 rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={categoriaSaving || !nuevaCategoria.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar
              </button>
            </form>
            {categoriaError && <span className="block text-[11px] text-rose-400">{categoriaError}</span>}

            {/* Lista */}
            <div className="space-y-2">
              {categorias.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-6">No hay categorías registradas.</p>
              ) : categorias.map(cat => (
                <div key={cat.id} className="flex items-center gap-2 bg-input border border-border rounded-xl px-3 py-2">
                  {editandoId === cat.id ? (
                    <>
                      <input
                        autoFocus
                        value={editandoNombre}
                        onChange={e => setEditandoNombre(e.target.value)}
                        className="flex-1 bg-surface border border-amber-500/30 rounded-lg px-2 py-1 text-xs text-text-primary focus:border-amber-500 focus:outline-none"
                      />
                      <button
                        onClick={async () => {
                          if (!editandoNombre.trim()) return;
                          setCategoriaError('');
                          try {
                            await onActualizarCategoria(cat.id, editandoNombre.trim());
                            setEditandoId(null);
                          } catch (err: unknown) {
                            const axiosErr = err as { response?: { data?: { mensaje?: string } } };
                            setCategoriaError(axiosErr.response?.data?.mensaje ?? 'Error al actualizar');
                          }
                        }}
                        className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditandoId(null)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Tag className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                      <span className="flex-1 text-xs text-text-primary font-medium">{cat.nombre}</span>
                      <button
                        onClick={() => { setEditandoId(cat.id); setEditandoNombre(cat.nombre); setCategoriaError(''); }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-amber-400 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          setCategoriaError('');
                          try {
                            await onEliminarCategoria(cat.id);
                          } catch (err: unknown) {
                            const axiosErr = err as { response?: { data?: { mensaje?: string } } };
                            setCategoriaError(axiosErr.response?.data?.mensaje ?? 'No se puede eliminar (puede tener productos asociados)');
                          }
                        }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>


      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-main/80 backdrop-blur-sm p-4">
          <form 
            onSubmit={handleSubmitResolution}
            className="w-full max-w-lg rounded-2xl border border-border bg-surface text-text-primary p-6 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center space-x-2 text-amber-400 border-b border-border pb-3 mb-4">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="font-display font-bold text-sm tracking-wider uppercase">Mediación Administrativa</h4>
            </div>

            <div className="mb-4">
              <span className="block text-[10px] text-text-muted uppercase tracking-wider font-semibold">Caso a Resolver:</span>
              <span className="font-bold text-sm text-text-primary">{selectedDispute.subastaTitle}</span>
              <p className="text-xs text-text-secondary mt-1 bg-input p-2.5 rounded border border-border/40">
                &ldquo;{selectedDispute.descripcion}&rdquo;
              </p>
            </div>

            
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                Estado Final de la Subasta:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['CANCELADA', 'ADJUDICADA', 'FINALIZADA'] as const).map(state => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => setResolutionState(state)}
                    className={`py-2 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                      resolutionState === state
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'border-border bg-input text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-1.5 leading-relaxed">
                {resolutionState === 'CANCELADA' && '✓ CANCELADA: Cancela la adjudicación, anula las pujas y reintegra el saldo a los postores.'}
                {resolutionState === 'ADJUDICADA' && '✓ ADJUDICADA: Confirma al ganador actual de la subasta como poseedor del artículo.'}
                {resolutionState === 'FINALIZADA' && '✓ FINALIZADA: Declara la subasta concluida formalmente sin comprador válido.'}
              </p>
            </div>

            
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                Dictamen Técnico y Fundamentos:
              </label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-border bg-input p-3 text-xs text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Escribe aquí los motivos de la resolución administrativa, sanciones si las hubiera, y los pasos a seguir por las partes..."
              />
              {errorText && <span className="block mt-1.5 text-[11px] font-semibold text-rose-400">{errorText}</span>}
            </div>

            
            <div className="flex justify-end space-x-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="px-4 py-2 rounded-xl bg-input border border-border hover:bg-input text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-[#0A0A0C] hover:bg-amber-400 text-xs font-bold transition-all shadow-md shadow-amber-500/10"
              >
                Aplicar Dictamen
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
