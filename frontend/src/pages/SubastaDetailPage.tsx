import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, History } from 'lucide-react';
import { Auction } from '../types';

interface SubastaDetailPageProps {
  auction: Auction;
  onBack: () => void;
  onBid: (auctionId: string, amount: number) => void;
  bidAmount: string;
  setBidAmount: (v: string) => void;
  bidError: string;
  onOpenDispute: (auctionId: string) => void;
  showDisputeForm: boolean;
  disputeMotive: 'FRAUDE' | 'FALTA_DE_PAGO' | 'PRODUCTO_NO_RECIBIDO' | 'OTRO';
  setDisputeMotive: (v: 'FRAUDE' | 'FALTA_DE_PAGO' | 'PRODUCTO_NO_RECIBIDO' | 'OTRO') => void;
  disputeText: string;
  setDisputeText: (v: string) => void;
  onSubmitDispute: () => void;
  onCloseDispute: () => void;
  successMessage: string | null;
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

export default function SubastaDetailPage({
  auction,
  onBack,
  onBid,
  bidAmount,
  setBidAmount,
  bidError,
  onOpenDispute,
  showDisputeForm,
  disputeMotive,
  setDisputeMotive,
  disputeText,
  setDisputeText,
  onSubmitDispute,
  onCloseDispute,
  successMessage,
}: SubastaDetailPageProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    function updateTimer() {
      const diff = new Date(auction.endTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Finalizada');
        setIsEnded(true);
        setShowCountdown(true);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}hs`);
        setShowCountdown(false);
      } else {
        setTimeLeft(`${hours}hs ${mins}min ${secs.toString().padStart(2, '0')}s`);
        setShowCountdown(true);
      }
      setIsUrgent(diff < 3600000);
    }
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center space-x-2 text-xs">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 font-bold"
        >
          Catálogo
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-slate-500 font-medium truncate max-w-[200px]">{auction.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0F0F13] border border-slate-800 rounded-2xl overflow-hidden relative">
            <img
              src={auction.image}
              alt={auction.title}
              className="w-full aspect-video object-cover opacity-90"
            />

            <div className="absolute top-4 left-4 flex items-center space-x-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Finaliza: {formatDate(auction.endTime)}</span>
            </div>

            {showCountdown && (
              <div className={`absolute top-4 right-4 flex items-center space-x-2 rounded-full border px-3 py-1.5 text-sm font-bold text-white ${
                isEnded
                  ? 'bg-slate-900/85 border-slate-700'
                  : isUrgent
                    ? 'bg-rose-950/85 border-rose-500/30 animate-pulse'
                    : 'bg-emerald-950/70 border-emerald-500/20'
              }`}>
                <Clock className={`h-4 w-4 ${isUrgent ? 'text-rose-400 animate-pulse' : isEnded ? 'text-slate-500' : 'text-emerald-400'}`} />
                <span className={isUrgent ? 'text-rose-300' : isEnded ? 'text-slate-400' : 'text-emerald-300'}>
                  {timeLeft}
                </span>
              </div>
            )}
          </div>

          <div className="bg-[#0F0F13] border border-slate-800 p-5 rounded-2xl">
            <h4 className="font-display font-bold text-sm tracking-wide uppercase text-slate-100 border-b border-slate-800 pb-2 mb-3">
              Descripción del Producto
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {auction.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-slate-800/60 pt-4 text-xs">
              <div>
                <span className="block text-[9px] text-slate-500 uppercase">Categoría</span>
                <strong className="text-slate-200 mt-0.5 block">{auction.category}</strong>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 uppercase">Vendedor</span>
                <strong className="text-slate-200 mt-0.5 block">{auction.seller.name}</strong>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 uppercase">Reputación Vendedor</span>
                <strong className="text-amber-500 mt-0.5 block">{auction.seller.rating} ★</strong>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 uppercase">Fecha Lanzamiento</span>
                <strong className="text-slate-400 mt-0.5 block font-mono">{formatDate(auction.createdAt)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0F0F13] border border-slate-800 p-5 rounded-2xl">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Pizarra de Cotización</span>
            <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-300">Oferta Máxima Actual</span>
              <span className="font-mono text-2xl font-black text-amber-400">${auction.currentPrice.toLocaleString('es-ES')}</span>
            </div>

            <div className="space-y-3 mb-5 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Pujas Confirmadas:</span>
                <strong className="text-slate-200">{auction.bidsCount}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Incremento Mínimo:</span>
                <strong className="text-slate-200 font-mono">+${auction.minIncrement}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Oferta Mínima Requerida:</span>
                <strong className="text-amber-500 font-mono">${(auction.currentPrice + auction.minIncrement).toLocaleString('es-ES')}</strong>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onBid(auction.id, parseFloat(bidAmount)); }} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tu Propuesta (ARS):</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-600 font-mono">$</span>
                  </div>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#121216] py-3 pl-8 pr-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                    placeholder={`${auction.currentPrice + auction.minIncrement}`}
                    min={auction.currentPrice + auction.minIncrement}
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
                  onClick={() => onBid(auction.id, auction.currentPrice + auction.minIncrement)}
                  className="px-4 bg-slate-900 border border-slate-800 text-slate-200 font-bold hover:bg-slate-800 text-xs py-3 rounded-xl active:scale-95"
                  title="Puja rápida automática"
                >
                  +${auction.minIncrement}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#0F0F13] border border-slate-800 p-5 rounded-2xl">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mesa de Ayuda (TPI)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              ¿Hay algún inconveniente con el pago, envío o la calidad del artículo? Como vendedor o ganador, tienes derecho a iniciar una mediación con los Administradores de la universidad.
            </p>

            {!showDisputeForm ? (
              <button
                onClick={() => onOpenDispute(auction.id)}
                className="w-full bg-rose-500/15 border border-rose-500/20 hover:bg-rose-500 hover:text-black transition-all py-2 rounded-xl text-xs font-bold text-rose-400"
              >
                Abrir Reclamo o Disputa
              </button>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); onSubmitDispute(); }} className="space-y-3 mt-3 border-t border-slate-800/60 pt-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Motivo del Conflicto:</label>
                  <select
                    value={disputeMotive}
                    onChange={(e) => setDisputeMotive(e.target.value as 'FRAUDE' | 'FALTA_DE_PAGO' | 'PRODUCTO_NO_RECIBIDO' | 'OTRO')}
                    className="w-full rounded-xl border border-slate-800 bg-[#121216] p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="PRODUCTO_NO_RECIBIDO">Producto No Recibido</option>
                    <option value="FALTA_DE_PAGO">Falta de Pago del Ganador</option>
                    <option value="FRAUDE">Posible Fraude / Engaño</option>
                    <option value="OTRO">Otro Motivo de Fuerza Mayor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fundamentos Detallados:</label>
                  <textarea
                    value={disputeText}
                    onChange={(e) => setDisputeText(e.target.value)}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-slate-800 bg-[#121216] p-2.5 text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                    placeholder="Describe qué ocurrió detalladamente para que el administrador pueda evaluarlo..."
                  />
                </div>

                <div className="flex gap-1.5 justify-end">
                  <button
                    type="button"
                    onClick={onCloseDispute}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-400"
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

          <div className="bg-[#0F0F13] border border-slate-800 p-5 rounded-2xl">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <History className="h-3.5 w-3.5 text-amber-500" />
              <span>Historial de Ofertas (Stream)</span>
            </span>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {auction.bids.length === 0 ? (
                <span className="block py-4 text-center text-xs text-slate-600 italic">No hay ofertas registradas aún</span>
              ) : (
                auction.bids.map((b, i) => (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                      i === 0
                        ? 'bg-amber-500/5 border border-amber-500/10 font-bold text-amber-400'
                        : 'bg-[#121216]/50 border border-transparent text-slate-400'
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
  );
}
