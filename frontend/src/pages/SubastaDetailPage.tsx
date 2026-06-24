import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, History, Gavel } from 'lucide-react';
import { obtenerTicket } from '../services/sseService';
import { useSse } from '../hooks/useSse';
import * as subastaService from '../services/subastaService';
import * as pujaService from '../services/pujaService';
import { DetailSkeleton } from '../components/Spinner';
import type { Auction, Bid } from '../types';

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  return d.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export default function SubastaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeMotive, setDisputeMotive] = useState<'FRAUDE' | 'FALTA_DE_PAGO' | 'PRODUCTO_NO_RECIBIDO' | 'OTRO'>('PRODUCTO_NO_RECIBIDO');
  const [disputeText, setDisputeText] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    subastaService.obtenerSubasta(id).then(setAuction).finally(() => setLoading(false));
  }, [id]);

  useSse(
    obtenerTicket,
    `/api/subastas/${id}/stream`,
    {
      'nueva-puja': (data: unknown) => {
        const puja = data as Bid;
        setAuction(prev => prev ? { ...prev, currentPrice: puja.amount, bidsCount: prev.bidsCount + 1, bids: [puja, ...prev.bids] } : prev);
      },
      'cambio-estado': (data: unknown) => {
        const estado = data as { estado: string };
        setAuction(prev => prev ? { ...prev, status: estado.estado as Auction['status'] } : prev);
      },
    }
  );

  useEffect(() => {
    if (!auction) return;
    function updateTimer() {
      const diff = new Date(auction!.endTime).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Finalizada'); setIsEnded(true); setShowCountdown(true); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (days > 0) { setTimeLeft(`${days}d ${hours}hs`); setShowCountdown(false); }
      else { setTimeLeft(`${hours}hs ${mins}min ${secs.toString().padStart(2, '0')}s`); setShowCountdown(true); }
      setIsUrgent(diff < 3600000);
    }
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  const handleBid = async () => {
    if (!auction || !id) return;
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < auction.currentPrice + auction.minIncrement) {
      setBidError('El monto debe ser mayor al precio actual + incremento mínimo');
      return;
    }
    setBidError('');
    try {
      const bid = await pujaService.registrarPuja(id, amount);
      setAuction(prev => prev ? { ...prev, currentPrice: amount, bidsCount: prev.bidsCount + 1, bids: [bid, ...prev.bids] } : prev);
      setBidAmount('');
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosErr = err as { response?: { data?: { mensaje?: string } } };
        setBidError(axiosErr.response?.data?.mensaje ?? 'Error al registrar la puja');
      } else {
        setBidError('Error de conexión al registrar la puja');
      }
    }
  };

  const handleQuickBid = async () => {
    if (!auction || !id) return;
    const amount = auction.currentPrice + auction.minIncrement;
    try {
      const bid = await pujaService.registrarPuja(id, amount);
      setAuction(prev => prev ? { ...prev, currentPrice: amount, bidsCount: prev.bidsCount + 1, bids: [bid, ...prev.bids] } : prev);
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosErr = err as { response?: { data?: { mensaje?: string } } };
        setBidError(axiosErr.response?.data?.mensaje ?? 'Error al registrar la puja');
      } else {
        setBidError('Error de conexión');
      }
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!auction) return <div className="py-20 text-center text-text-muted text-sm">Subasta no encontrada</div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center space-x-2 text-xs">
        <button onClick={() => navigate('/catalogo')} className="text-text-secondary hover:text-text-primary font-bold">Catálogo</button>
        <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
        <span className="text-text-muted font-medium truncate max-w-[200px]">{auction.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden relative">
            <img src={auction.image} alt={auction.title} className="w-full aspect-video object-cover opacity-90" />
            <div className="absolute top-4 left-4 flex items-center space-x-1.5 rounded-full bg-main/85 backdrop-blur-md border border-border px-3 py-1 text-xs font-semibold text-text-primary">
              <Clock className="h-3.5 w-3.5 text-text-secondary" />
              <span>Finaliza: {formatDate(auction.endTime)}</span>
            </div>
            {showCountdown && (
              <div className={`absolute top-4 right-4 flex items-center space-x-2 rounded-full border px-3 py-1.5 text-sm font-bold text-white ${
                isEnded ? 'bg-input/85 border-border' : isUrgent ? 'bg-rose-950/85 border-rose-500/30 animate-pulse' : 'bg-emerald-950/70 border-emerald-500/20'
              }`}>
                <Clock className={`h-4 w-4 ${isUrgent ? 'text-rose-400 animate-pulse' : isEnded ? 'text-text-muted' : 'text-emerald-400'}`} />
                <span className={isUrgent ? 'text-rose-300' : isEnded ? 'text-text-secondary' : 'text-emerald-300'}>{timeLeft}</span>
              </div>
            )}
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl">
            <h4 className="font-display font-bold text-sm tracking-wide uppercase text-text-primary border-b border-border pb-2 mb-3">Descripción del Producto</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">{auction.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-border/60 pt-4 text-xs">
              <div><span className="block text-[9px] text-text-muted uppercase">Categoría</span><strong className="text-text-primary mt-0.5 block">{auction.category}</strong></div>
              <div><span className="block text-[9px] text-text-muted uppercase">Vendedor</span><strong className="text-text-primary mt-0.5 block">{auction.seller.name}</strong></div>
              <div><span className="block text-[9px] text-text-muted uppercase">Precio Base</span><strong className="text-text-primary mt-0.5 block">${auction.startingPrice.toLocaleString('es-ES')}</strong></div>
              <div><span className="block text-[9px] text-text-muted uppercase">Pujas</span><strong className="text-text-primary mt-0.5 block">{auction.bidsCount}</strong></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface border border-border p-5 rounded-2xl">
            <h4 className="font-display font-bold text-sm tracking-wide uppercase text-text-primary border-b border-border pb-2 mb-3">Pizarra de Cotización</h4>
            <div className="text-center mb-4">
              <span className="block text-[10px] text-text-muted uppercase">Precio Actual</span>
              <span className="font-mono text-3xl font-extrabold text-amber-500">${auction.currentPrice.toLocaleString('es-ES')}</span>
            </div>
            {successMessage && <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-400">{successMessage}</div>}
            <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
              <span>Incremento mínimo: <strong className="text-text-primary font-mono">+${auction.minIncrement}</strong></span>
              <span>Puja rápida: <button onClick={handleQuickBid} className="rounded-lg bg-amber-500 text-black px-2 py-0.5 text-[11px] font-bold hover:bg-amber-400">+${auction.minIncrement}</button></span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleBid(); }} className="space-y-3">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">Tu Propuesta (ARS):</label>
              <div className="relative">
                <input type="number" required value={bidAmount} onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input p-3 pr-16 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none font-mono"
                  placeholder={`${auction.currentPrice + auction.minIncrement}`} min={auction.currentPrice + auction.minIncrement} />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-amber-500 px-3 py-1.5 text-[11px] font-bold text-black hover:bg-amber-400">Pujar</button>
              </div>
              {bidError && <span className="block mt-1 text-[11px] font-semibold text-rose-400">{bidError}</span>}
            </form>
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <h4 className="font-display font-bold text-sm uppercase tracking-wide text-text-primary">Historial de Ofertas</h4>
              <History className="h-4 w-4 text-text-muted" />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {auction.bids.length === 0 ? (
                <p className="text-xs text-text-muted py-4 text-center">Sin ofertas aún</p>
              ) : (
                auction.bids.slice(0, 20).map(bid => (
                  <div key={bid.id} className="flex items-center justify-between text-xs bg-input/50 p-2 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-[10px]">{bid.bidderName.charAt(0)}</div>
                      <span className="text-text-primary">{bid.bidderName || 'Anónimo'}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-500">${bid.amount.toLocaleString('es-ES')}</span>
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
