import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, TrendingUp, TrendingDown, Trophy } from 'lucide-react';
import { misPujas, obtenerMiPosicion } from '../services/pujaService';
import * as subastaService from '../services/subastaService';
import { useSse } from '../hooks/useSse';
import { obtenerTicketNotificaciones } from '../services/sseService';
import type { Auction } from '../types';

interface SubastaResumen {
  subastaId: string;
  auction: Auction | null;
  miMejorPuja: number;
  totalMisPujas: number;
  posicion: number;
}

type Filtro = 'all' | 'ganando' | 'perdiendo';

export default function MisPujasPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SubastaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>('all');

  const cargarPujas = async () => {
    const result = await misPujas(0, 200);
    const mapa = new Map<string, { bids: typeof result.items }>();
    for (const bid of result.items) {
      const key = bid.auctionId;
      if (!mapa.has(key)) mapa.set(key, { bids: [] });
      mapa.get(key)!.bids.push(bid);
    }
    const resúmenes = await Promise.all(
      Array.from(mapa.entries()).map(async ([subastaId, { bids }]) => {
        const miMejorPuja = Math.max(...bids.map(b => b.amount));
        const totalMisPujas = bids.length;
        const [auction, posicion] = await Promise.allSettled([
          subastaService.obtenerSubasta(subastaId),
          obtenerMiPosicion(subastaId),
        ]);
        return {
          subastaId, miMejorPuja, totalMisPujas,
          auction: auction.status === 'fulfilled' ? auction.value : null,
          posicion: posicion.status === 'fulfilled' ? posicion.value : 0,
        } satisfies SubastaResumen;
      })
    );
    resúmenes.sort((a, b) => {
      const aG = a.posicion === 1, bG = b.posicion === 1;
      if (aG && !bG) return -1;
      if (!aG && bG) return 1;
      return a.posicion - b.posicion;
    });
    setItems(resúmenes);
  };

  useEffect(() => {
    cargarPujas()
      .catch(() => setError('No se pudieron cargar tus pujas'))
      .finally(() => setLoading(false));
  }, []);

  useSse(obtenerTicketNotificaciones, '/api/notificaciones/stream', {
    'notificacion-nueva': () => { cargarPujas(); },
  });

  const filtrados = items.filter(item => {
    if (filtro === 'ganando') return item.posicion === 1;
    if (filtro === 'perdiendo') return item.posicion !== 1;
    return true;
  });

  const ganando = items.filter(i => i.posicion === 1).length;
  const perdiendo = items.filter(i => i.posicion !== 1 && i.posicion > 0).length;

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
        <Gavel className="h-10 w-10 text-text-secondary/60 mx-auto mb-3" />
        <span className="block text-text-muted text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-display text-lg font-bold text-text-primary uppercase tracking-wide">Mis Pujas</h3>
          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg">
            {items.length} {items.length === 1 ? 'subasta' : 'subastas'}
          </span>
          {ganando > 0 && (
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />{ganando} ganando
            </span>
          )}
          {perdiendo > 0 && (
            <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold rounded-lg flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />{perdiendo} superado
            </span>
          )}
        </div>
        <div className="flex gap-1 rounded-xl bg-input border border-border p-0.5">
          {(['all', 'ganando', 'perdiendo'] as Filtro[]).map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${filtro === f ? 'bg-amber-500 text-black' : 'text-text-muted hover:text-text-primary'}`}>
              {f === 'all' ? 'Todas' : f === 'ganando' ? 'Ganando' : 'Superado'}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border">
          <Gavel className="h-10 w-10 text-text-secondary/60 mx-auto mb-3" />
          <span className="block text-text-muted text-sm">
            {filtro !== 'all' ? 'No tenés pujas en esta categoría' : 'Aún no realizaste ninguna puja'}
          </span>
          <button onClick={() => navigate('/catalogo')}
            className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors">
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map(item => {
            const estado = item.auction?.estado ?? '';
            const finalizada = estado === 'ADJUDICADA' || estado === 'FINALIZADA' || estado === 'CANCELADA';
            const esPrimero = item.posicion === 1;
            const ganando = !finalizada && esPrimero;
            const ganaste = finalizada && esPrimero && estado !== 'CANCELADA';
            const currentPrice = item.auction?.currentPrice ?? 0;
            const diferencia = currentPrice - item.miMejorPuja;

            let badgeText = '';
            let badgeClass = '';
            if (estado === 'CANCELADA') {
              badgeText = 'CANCELADA';
              badgeClass = 'bg-input text-text-muted border border-border';
            } else if (ganaste) {
              badgeText = '¡GANASTE!';
              badgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
            } else if (ganando) {
              badgeText = '¡GANANDO!';
              badgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            } else if (finalizada) {
              badgeText = 'FINALIZADA';
              badgeClass = 'bg-input text-text-muted border border-border';
            } else {
              badgeText = `PUESTO #${item.posicion > 0 ? item.posicion : '?'}`;
              badgeClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
            }

            const borderClass = ganaste
              ? 'border-amber-500/30'
              : ganando ? 'border-emerald-500/30'
              : finalizada ? 'border-border'
              : 'border-rose-500/20';

            return (
              <div key={item.subastaId}
                onClick={() => navigate(`/subastas/${item.subastaId}`)}
                className={`relative rounded-2xl border bg-surface p-4 cursor-pointer hover:border-amber-500/30 transition-all group ${borderClass}`}>

                {/* Badge posición */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {(ganando || ganaste) && <Trophy className={`h-3.5 w-3.5 ${ganaste ? 'text-amber-400' : 'text-emerald-400'}`} />}
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${badgeClass}`}>
                    {badgeText}
                  </span>
                </div>

                {/* Imagen + título */}
                <div className="flex items-start gap-3 pr-24 mb-3">
                  {item.auction?.image ? (
                    <img src={item.auction.image} alt="" className="h-12 w-12 rounded-xl object-cover flex-shrink-0 border border-border" />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-input flex-shrink-0 border border-border" />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-text-primary line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {item.auction?.title ?? `Subasta #${item.subastaId}`}
                    </h4>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {item.totalMisPujas} {item.totalMisPujas === 1 ? 'puja realizada' : 'pujas realizadas'}
                    </p>
                  </div>
                </div>

                {/* Precios */}
                <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
                  <div>
                    <span className="block text-[9px] text-text-muted uppercase tracking-wider mb-0.5">Mi mejor puja</span>
                    <span className="font-mono font-extrabold text-amber-400 text-sm">
                      ${item.miMejorPuja.toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-text-muted uppercase tracking-wider mb-0.5">Precio actual</span>
                    <span className={`font-mono font-bold text-sm ${ganando || ganaste ? 'text-emerald-400' : finalizada ? 'text-text-muted' : 'text-rose-400'}`}>
                      ${currentPrice.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>

                {/* Diferencia / estado */}
                {ganaste && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400">
                    <Trophy className="h-3 w-3" />
                    <span>Ganaste esta subasta</span>
                  </div>
                )}
                {!ganando && !ganaste && !finalizada && diferencia > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-rose-400">
                    <TrendingDown className="h-3 w-3" />
                    <span>Te superaron por <strong>${diferencia.toLocaleString('es-ES')}</strong></span>
                  </div>
                )}
                {ganando && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Tenés la oferta más alta</span>
                  </div>
                )}
                {finalizada && !ganaste && estado !== 'CANCELADA' && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-text-muted">
                    <span>Subasta finalizada</span>
                  </div>
                )}

                {/* Acciones */}
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 bg-input border border-border py-2 rounded-xl text-xs text-text-primary font-bold hover:text-amber-400 transition-colors">
                    Ver Detalle
                  </button>
                  {!ganando && item.auction?.estado === 'ACTIVA' && (
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/subastas/${item.subastaId}`); }}
                      className="px-3 bg-amber-500 hover:bg-amber-400 text-black py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors">
                      <Gavel className="h-3.5 w-3.5" /> Superar
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
