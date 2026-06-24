import { useState, useEffect } from 'react';
import { Clock, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubastas } from '../hooks/useSubastas';
import { Spinner, CardSkeleton } from '../components/Spinner';
import type { Auction } from '../types';

function formatCountdown(endTime: string): { text: string; urgent: boolean; ended: boolean } {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { text: 'Finalizada', urgent: false, ended: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
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

const CATEGORIAS = ['Todos', 'Tecnología', 'Hogar', 'Vehículos', 'Deportes', 'Coleccionables', 'Herramientas'];

export default function CatalogoPage() {
  const { auctions, loading, error, pujar } = useSubastas();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [bidError, setBidError] = useState<string | null>(null);

  const filteredAuctions = auctions.filter(a => {
    const matchesCategory = selectedCategory === 'Todos' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectAuction = (auction: Auction) => {
    navigate(`/subastas/${auction.id}`);
  };

  const handleQuickBid = async (auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) return;
    const result = await pujar(auctionId, auction.currentPrice + auction.minIncrement);
    if (result.error) {
      setBidError(result.error);
      setTimeout(() => setBidError(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400">{error}</div>
      )}
      {bidError && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400">{bidError}</div>
      )}
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
          {CATEGORIAS.map(cat => (
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

      {loading && auctions.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border">
          <span className="block text-text-muted text-sm">No se encontraron subastas</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAuctions.map(auc => (
            <div key={auc.id} className="cursor-pointer" onClick={() => handleSelectAuction(auc)}>
              <div className="relative group rounded-2xl border border-border bg-surface overflow-hidden hover:border-border/80 transition-all duration-300">
                <div className="absolute top-3 left-3 z-10 rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-text-primary backdrop-blur">
                  <span className="text-amber-500 font-bold uppercase mr-1">
                    {new Date(auc.endTime).getTime() > Date.now() ? 'ACTIVA' : 'FINALIZADA'}
                  </span>
                  {auc.category}
                </div>
                <div className="aspect-video w-full overflow-hidden bg-input/60 relative">
                  <img src={auc.image} alt={auc.title} className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                  <CardCountdown endTime={auc.endTime} />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-[11px] text-text-muted mb-2">
                    <span>Vendedor: {auc.seller.name}</span>
                    <span className="text-amber-500">{auc.seller.rating} ★</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-text-primary mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">{auc.title}</h3>
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4">{auc.description}</p>
                  <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-text-muted font-semibold mb-0.5">Oferta Actual</span>
                      <span className="font-mono text-base font-extrabold text-amber-500">${auc.currentPrice.toLocaleString('es-ES')}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] uppercase tracking-wider text-text-muted font-semibold mb-0.5">Pujas Realizadas</span>
                      <span className="font-mono font-bold text-text-primary block mt-0.5">{auc.bidsCount}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-xl bg-input hover:bg-input border border-border py-2.5 text-center text-xs font-bold text-text-primary hover:text-white transition-colors cursor-pointer">Ver Detalle</button>
                    <button onClick={(e) => { e.stopPropagation(); handleQuickBid(auc.id); }} className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center space-x-1 cursor-pointer transition-colors shadow-lg shadow-amber-500/5 active:scale-95">
                      <Gavel className="h-3.5 w-3.5" /><span>+${auc.minIncrement}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
