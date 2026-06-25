import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Package } from 'lucide-react';
import * as subastaService from '../services/subastaService';
import type { Auction } from '../types';

export default function MisSubastasPage() {
  const [subastas, setSubastas] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    subastaService.misSubastas().then(r => setSubastas(r.items)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <h3 className="font-display text-lg font-bold text-text-primary uppercase tracking-wide">Mis Publicaciones</h3>
        <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg">
          {subastas.length} subastas
        </span>
      </div>

      {subastas.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border">
          <Package className="h-10 w-10 text-text-secondary/60 mx-auto mb-3" />
          <span className="block text-text-muted text-sm">No tenés publicaciones</span>
          <button onClick={() => navigate('/crear')} className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors">
            Crear publicación
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {subastas.map(auc => (
            <div key={auc.id} onClick={() => navigate(`/subastas/${auc.id}`)}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 cursor-pointer hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-4">
                {auc.image && <img src={auc.image} alt={auc.title} className="h-14 w-14 rounded-xl object-cover" />}
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{auc.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${auc.estado === 'ACTIVA' ? 'bg-emerald-500/10 text-emerald-400' : auc.estado === 'BORRADOR' ? 'bg-amber-500/10 text-amber-400' : 'bg-input text-text-muted'}`}>
                      {auc.estado}
                    </span>
                    <span>${auc.currentPrice.toLocaleString('es-ES')}</span>
                    <span>{auc.bidsCount} pujas</span>
                  </div>
                </div>
              </div>
              <Megaphone className="h-4 w-4 text-text-muted" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
