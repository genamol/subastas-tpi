import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import * as subastaService from '../services/subastaService';
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
  useEffect(() => { const i = setInterval(() => setInfo(formatCountdown(endTime)), 1000); return () => clearInterval(i); }, [endTime]);
  if (info.ended) return <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-input/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-text-muted border border-border/50"><Clock className="h-3.5 w-3.5" />Finalizada</div>;
  return <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg backdrop-blur px-2.5 py-1 text-[11px] font-semibold border ${info.urgent ? 'bg-rose-950/90 text-rose-300 border-rose-500/30 animate-pulse' : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/20'}`}><Clock className={`h-3.5 w-3.5 ${info.urgent ? 'text-rose-400' : 'text-emerald-400'}`} />{info.text}</div>;
}

export default function CatalogoInvitadoPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => { subastaService.listarSubastas().then(r => setAuctions(r.items)).catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-main">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-500" /><span className="font-display font-bold text-text-primary">UniSubastas</span></div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-xs text-amber-400 hover:text-amber-300 font-medium">Iniciar sesión</Link>
          <Link to="/register" className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-amber-400">Registrarse</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-center">
          <Eye className="h-4 w-4 text-amber-400 inline mr-2" />
          <span className="text-xs text-amber-400">Estás viendo el catálogo como invitado. </span>
          <Link to="/register" className="text-xs font-bold text-amber-400 underline hover:text-amber-300">Registrate</Link>
          <span className="text-xs text-amber-400"> para pujar y ver los precios.</span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map(auc => (
            <div key={auc.id} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-input/60">
                <div className="absolute top-3 left-3 z-10 rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-text-primary backdrop-blur">
                  <span className="text-amber-500 font-bold uppercase mr-1">{new Date(auc.endTime).getTime() > Date.now() ? 'ACTIVA' : 'FINALIZADA'}</span>
                  {auc.category}
                </div>
                {auc.image ? <img src={auc.image} alt={auc.title} className="h-full w-full object-cover opacity-80" /> : <div className="h-full w-full bg-input" />}
                <CardCountdown endTime={auc.endTime} />
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-base text-text-primary mb-2 line-clamp-1">{auc.title}</h3>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{auc.description}</p>
                <div className="mt-4 pt-3 border-t border-border/60 text-center">
                  <Link to="/register" className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300">
                    <Eye className="h-3.5 w-3.5" /> Registrate para ver el precio y pujar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
