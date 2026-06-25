import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Gavel } from 'lucide-react';
import { misPujas } from '../services/pujaService';
import * as subastaService from '../services/subastaService';
import type { Bid, Auction } from '../types';

export default function MisPujasPage() {
  const navigate = useNavigate();
  const [bids, setBids] = useState<Bid[]>([]);
  const [auctions, setAuctions] = useState<Map<string, Auction>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'winning' | 'outbid'>('all');

  useEffect(() => {
    misPujas()
      .then(async (result) => {
        setBids(result.items);
        const auctionMap = new Map<string, Auction>();
        await Promise.all(result.items.map(async (bid) => {
          try {
            const auction = await subastaService.obtenerSubasta(bid.auctionId);
            auctionMap.set(bid.auctionId, auction);
          } catch { /* subasta no encontrada */ }
        }));
        setAuctions(auctionMap);
      })
      .catch(() => setError('No se pudieron cargar tus pujas'))
      .finally(() => setLoading(false));
  }, []);

  const filteredBids = bids.filter(bid => {
    if (filter === 'all') return true;
    const auction = auctions.get(bid.auctionId);
    const isWinning = auction ? bid.amount >= auction.currentPrice : false;
    return filter === 'winning' ? isWinning : !isWinning;
  });

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <span className="block text-text-muted text-sm mt-4">Cargando tus pujas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <Award className="h-10 w-10 text-text-secondary/60 mx-auto mb-3" />
        <span className="block text-text-muted text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <h3 className="font-display text-lg font-bold text-text-primary uppercase tracking-wide">Tus Pujas</h3>
          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg">
            {bids.length} {bids.length === 1 ? 'puja' : 'pujas'}
          </span>
        </div>
        <div className="flex gap-1 rounded-xl bg-input border border-border p-0.5">
          {(['all', 'winning', 'outbid'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-[11px] font-bold ${filter === f ? 'bg-amber-500 text-black' : 'text-text-muted hover:text-text-primary'}`}>
              {f === 'all' ? 'Todas' : f === 'winning' ? 'Ganando' : 'Superado'}
            </button>
          ))}
        </div>
      </div>

      {filteredBids.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border">
          <Award className="h-10 w-10 text-text-secondary/60 mx-auto mb-3" />
          <span className="block text-text-muted text-sm">{filter !== 'all' ? 'No tenés pujas en esta categoría' : 'Aún no has ofertado'}</span>
          <button onClick={() => navigate('/catalogo')} className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors">Explorar Catálogo</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBids.map(bid => {
            const auction = auctions.get(bid.auctionId);
            const isWinning = auction ? bid.amount >= auction.currentPrice : false;
            return (
              <div key={bid.id}
                className={`relative rounded-2xl border p-4 bg-surface overflow-hidden cursor-pointer hover:border-amber-500/30 transition-all ${isWinning ? 'border-emerald-500/20' : 'border-rose-500/20'}`}
                onClick={() => navigate(`/subastas/${bid.auctionId}`)}
              >
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${isWinning ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {isWinning ? 'GANANDO' : 'SUPERADO'}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted block uppercase font-mono tracking-wider">Subasta #{bid.auctionId}</span>
                <h4 className="font-bold text-sm text-text-primary mt-1 line-clamp-1">
                  {auction?.title ?? `Subasta #${bid.auctionId}`}
                </h4>
                <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-4 text-xs">
                  <div>
                    <span className="block text-[9px] text-text-muted uppercase">Tu Puja</span>
                    <span className="font-mono font-extrabold text-amber-400">${bid.amount.toLocaleString('es-ES')}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-text-muted uppercase text-right">Oferta Actual</span>
                    <span className="font-mono font-bold text-text-primary block text-right">
                      ${auction?.currentPrice.toLocaleString('es-ES') ?? bid.amount.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-input border border-border hover:bg-input py-2 rounded-xl text-xs text-text-primary font-bold transition-all">Ver Detalle</button>
                  {!isWinning && (
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/subastas/${bid.auctionId}`); }} className="px-3 bg-amber-500 hover:bg-amber-400 text-black py-2 rounded-xl text-xs font-bold flex items-center space-x-1">
                      <Gavel className="h-3.5 w-3.5" /><span>Superar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
