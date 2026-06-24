import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Gavel } from 'lucide-react';
import { useSubastas } from '../hooks/useSubastas';
import { useAuth } from '../context/AuthContext';
import type { Auction } from '../types';

export default function MisPujasPage() {
  const { auctions } = useSubastas();
  const { nombre } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'winning' | 'outbid' | 'all'>('all');

  const myBids = auctions.filter(a =>
    a.bids.some(b => b.bidderName === (nombre ?? ''))
  );

  const filtered = myBids.filter(a => {
    if (filter === 'all') return true;
    const latestBid = a.bids[0];
    if (!latestBid) return false;
    const amWinning = latestBid.bidderName === (nombre ?? '');
    if (filter === 'winning') return amWinning;
    return !amWinning;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <h3 className="font-display text-lg font-bold text-text-primary uppercase tracking-wide">Tus Ofertas</h3>
          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg">
            {myBids.length} Subastas
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

      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border">
          <Award className="h-10 w-10 text-text-secondary/60 mx-auto mb-3" />
          <span className="block text-text-muted text-sm">No tenés ofertas {filter !== 'all' ? 'en esta categoría' : 'todavía'}</span>
          <button onClick={() => navigate('/catalogo')} className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors">
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(auc => {
            const latestBid = auc.bids[0];
            const amWinning = latestBid?.bidderName === (nombre ?? '');
            return (
              <div key={auc.id}
                className={`rounded-2xl border p-4 bg-surface relative overflow-hidden transition-all hover:scale-101 cursor-pointer ${amWinning ? 'border-emerald-500/20' : 'border-rose-500/20'}`}
                onClick={() => navigate(`/subastas/${auc.id}`)}
              >
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${amWinning ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
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
                      ${auc.bids.find(b => b.bidderName === (nombre ?? ''))?.amount.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-input border border-border hover:bg-input py-2 rounded-xl text-xs text-text-primary font-bold transition-all">Ver Detalle</button>
                  {!amWinning && (
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/subastas/${auc.id}`); }} className="px-3 bg-amber-500 hover:bg-amber-400 text-black py-2 rounded-xl text-xs font-bold flex items-center space-x-1">
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
