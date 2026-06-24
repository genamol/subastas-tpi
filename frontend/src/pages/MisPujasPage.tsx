import { Award, Gavel } from 'lucide-react';
import { Auction } from '../types';

interface MisPujasPageProps {
  myBidsAuctions: Auction[];
  userName: string;
  onSelectAuction: (a: Auction) => void;
}

export default function MisPujasPage({ myBidsAuctions, userName, onSelectAuction }: MisPujasPageProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-4">
        <h3 className="font-display text-lg font-bold text-slate-100 uppercase tracking-wide">Tus Ofertas Activas</h3>
        <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg">
          {myBidsAuctions.length} Subastas
        </span>
      </div>

      {myBidsAuctions.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-slate-800">
          <Award className="h-10 w-10 text-slate-700/60 mx-auto mb-3" />
          <span className="block text-slate-500 text-sm">Aún no has ofertado en ninguna subasta</span>
          <button
            className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myBidsAuctions.map(auc => {
            const latestBid = auc.bids.length > 0 ? auc.bids[0] : null;
            const amWinning = latestBid ? latestBid.bidderName === userName : false;
            return (
              <div
                key={auc.id}
                className={`rounded-2xl border p-4 bg-[#0F0F13] relative overflow-hidden transition-all hover:scale-101 cursor-pointer ${
                  amWinning ? 'border-emerald-500/20' : 'border-rose-500/20'
                }`}
                onClick={() => onSelectAuction(auc)}
              >
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    amWinning ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {amWinning ? 'VAS GANANDO' : 'SUPERADO'}
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">{auc.category}</span>
                <h4 className="font-bold text-sm text-slate-200 mt-1 line-clamp-1">{auc.title}</h4>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-4 text-xs">
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase">Oferta Actual</span>
                    <span className="font-mono font-extrabold text-amber-400">${auc.currentPrice.toLocaleString('es-ES')}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase text-right">Tu Última Puja</span>
                    <span className="font-mono font-bold text-slate-300 block text-right">
                      ${auc.bids.find(b => b.bidderName === userName)?.amount.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 py-2 rounded-xl text-xs text-slate-300 font-bold transition-all">
                    Ver Panel de Puja
                  </button>
                  {!amWinning && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectAuction(auc); }}
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
  );
}
