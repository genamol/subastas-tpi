import { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Radio, 
  Gavel, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Unlock, 
  Clock, 
  UserX, 
  MessageSquare, 
  Calendar,
  Send,
  HelpCircle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { Dispute, UserAccount, Auction, Bid } from '../types';

interface AdminPanelProps {
  disputes: Dispute[];
  users: UserAccount[];
  auctions: Auction[];
  onResolveDispute: (id: string, state: 'ADJUDICADA' | 'CANCELADA' | 'FINALIZADA', resolution: string) => void;
  onToggleUserStatus: (id: string) => void;
  sseLogs: string[];
}

export default function AdminPanel({
  disputes,
  users,
  auctions,
  onResolveDispute,
  onToggleUserStatus,
  sseLogs
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'disputes' | 'users' | 'monitor'>('disputes');
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
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0F0F13] text-slate-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-800 bg-[#0A0A0C] px-5 py-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/5">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-wide uppercase text-slate-100">
              Panel del Administrador
            </h3>
            <p className="text-[11px] text-slate-500">Mediación de Conflictos y Control de Seguridad (TPI)</p>
          </div>
        </div>

        
        <div className="flex rounded-xl bg-[#121216] border border-slate-800 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'disputes'
                ? 'bg-amber-500 text-[#0A0A0C] shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
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
                : 'text-slate-400 hover:text-slate-200'
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
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Monitor SSE en Vivo</span>
          </button>
        </div>
      </div>

      
      <div className="flex-1 p-5 overflow-y-auto max-h-[600px] bg-[#0C0C10]">
        
        
        {activeTab === 'disputes' && (
          <div className="space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between bg-[#121216] border border-slate-800/60 p-3 rounded-xl">
              <span className="text-xs text-slate-400 font-medium">Filtrar Reclamos:</span>
              <div className="flex space-x-1">
                {(['TODOS', 'ABIERTA', 'RESUELTA'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setDisputeFilter(f)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide transition-all ${
                      disputeFilter === f
                        ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredDisputes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-slate-800">
                <CheckCircle className="h-10 w-10 text-emerald-500/40 mb-3" />
                <span className="text-sm font-semibold text-slate-400">Sin conflictos en esta categoría</span>
                <span className="text-xs text-slate-600 mt-1">Todas las subastas operan en total conformidad.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDisputes.map(dispute => (
                  <div 
                    key={dispute.id} 
                    className={`rounded-xl border p-4 bg-[#0F0F13] transition-all hover:border-slate-700/80 ${
                      dispute.estado === 'ABIERTA' ? 'border-amber-500/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3 mb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Subasta Adjudicada #{dispute.subastaId}</span>
                        <h4 className="text-sm font-bold text-slate-200">{dispute.subastaTitle}</h4>
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
                        <div className="flex items-start space-x-2 bg-[#121216] p-3 rounded-lg border border-slate-800/40">
                          <MessageSquare className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="block font-semibold text-slate-400 text-[11px]">Fundamentos del Reclamo:</span>
                            <p className="text-slate-300 leading-relaxed mt-1">{dispute.descripcion}</p>
                          </div>
                        </div>

                        {dispute.estado === 'RESUELTA' && (
                          <div className="flex items-start space-x-2 bg-emerald-950/10 p-3 rounded-lg border border-emerald-500/20">
                            <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="block font-semibold text-emerald-400 text-[11px]">Resolución Administrativa:</span>
                              <p className="text-slate-300 leading-relaxed mt-1">{dispute.resolucionAdmin}</p>
                              <div className="flex items-center space-x-1.5 mt-2 text-[10px] text-emerald-500/80">
                                <span>Estado final establecido:</span>
                                <strong className="font-mono uppercase bg-emerald-500/10 px-1 py-0.5 rounded">{dispute.estadoFinalSubasta}</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#121216]/50 p-3 rounded-lg border border-slate-800/50 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Iniciado por:</span>
                            <span className="font-medium text-slate-300">{dispute.iniciador}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Fecha de apertura:</span>
                            <span className="font-mono text-slate-400">{formatDate(dispute.fechaCreacion)}</span>
                          </div>
                          {dispute.estado === 'RESUELTA' && dispute.fechaResolucion && (
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Fecha resolución:</span>
                              <span className="font-mono text-slate-400">{formatDate(dispute.fechaResolucion)}</span>
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
            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl text-xs text-slate-400 leading-relaxed flex items-start space-x-3">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-200 block mb-1">Políticas de Moderación (OWASP A01 & A07)</strong>
                Al aplicar un bloqueo sobre un usuario, el backend revoca de forma inmediata su token en la tabla de blacklist en PostgreSQL. Las conexiones SSE activas para recibir notificaciones y pujas son cerradas por el <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded font-mono">SseSubscriptionService</code>.
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0F0F13]">
              <table className="w-full text-left text-xs divide-y divide-slate-800">
                <thead className="bg-[#0A0A0C] text-slate-400 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Roles</th>
                    <th className="px-4 py-3">Calificación</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-200">{user.name}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{user.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {user.roles.map(r => (
                            <span key={r} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              r === 'ADMIN' ? 'bg-red-500/15 text-red-400 border border-red-500/10' :
                              r === 'SELLER' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/10' :
                              'bg-slate-500/15 text-slate-400 border border-slate-500/10'
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
                          <span className="text-[10px] text-slate-600 font-medium italic">Protegido (Admin)</span>
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span>Canal SSE Global Admin (Sin Anonimizar)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Filtro de seguridad omitido</span>
              </div>

              {auctions.map(auction => {
                const latestBid = auction.bids.length > 0 ? auction.bids[0] : null;
                return (
                  <div key={auction.id} className="bg-[#121216] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                    
                    <img 
                      src={auction.image} 
                      alt={auction.title}
                      className="w-full md:w-24 h-24 md:h-20 object-cover rounded-lg bg-slate-900 border border-slate-800"
                    />

                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-xs font-bold text-slate-200">{auction.title}</h5>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                            auction.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {auction.status === 'active' ? 'ACTIVA' : 'FINALIZADA'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{auction.description}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-slate-800/60 pt-2 mt-2">
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase">Oferta Actual</span>
                          <span className="font-mono text-xs font-bold text-amber-500">${auction.currentPrice.toLocaleString('es-ES')}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase">Total Pujas</span>
                          <span className="text-xs font-semibold text-slate-300">{auction.bidsCount}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase">Último Postor</span>
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

            
            <div className="bg-[#0A0A0C] border border-slate-800 rounded-xl p-4 flex flex-col h-[400px]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Logs del Servidor SSE</span>
              </span>

              <div className="flex-1 overflow-y-auto font-mono text-[10px] text-emerald-400/90 leading-relaxed mt-3 space-y-2 select-all">
                {sseLogs.length === 0 ? (
                  <span className="text-slate-600 italic block py-4 text-center">Escuchando eventos de red...</span>
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

      </div>

      
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form 
            onSubmit={handleSubmitResolution}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0F0F13] text-slate-100 p-6 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center space-x-2 text-amber-400 border-b border-slate-800 pb-3 mb-4">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="font-display font-bold text-sm tracking-wider uppercase">Mediación Administrativa</h4>
            </div>

            <div className="mb-4">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Caso a Resolver:</span>
              <span className="font-bold text-sm text-slate-200">{selectedDispute.subastaTitle}</span>
              <p className="text-xs text-slate-400 mt-1 bg-[#121216] p-2.5 rounded border border-slate-800/40">
                &ldquo;{selectedDispute.descripcion}&rdquo;
              </p>
            </div>

            
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
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
                        : 'border-slate-800 bg-[#121216] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                {resolutionState === 'CANCELADA' && '✓ CANCELADA: Cancela la adjudicación, anula las pujas y reintegra el saldo a los postores.'}
                {resolutionState === 'ADJUDICADA' && '✓ ADJUDICADA: Confirma al ganador actual de la subasta como poseedor del artículo.'}
                {resolutionState === 'FINALIZADA' && '✓ FINALIZADA: Declara la subasta concluida formalmente sin comprador válido.'}
              </p>
            </div>

            
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Dictamen Técnico y Fundamentos:
              </label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-800 bg-[#121216] p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Escribe aquí los motivos de la resolución administrativa, sanciones si las hubiera, y los pasos a seguir por las partes..."
              />
              {errorText && <span className="block mt-1.5 text-[11px] font-semibold text-rose-400">{errorText}</span>}
            </div>

            
            <div className="flex justify-end space-x-2 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="px-4 py-2 rounded-xl bg-[#121216] border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
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
