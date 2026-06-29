import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gavel, Package, Star, ChevronLeft } from 'lucide-react';
import { obtenerPerfilPublico, type UsuarioPublico } from '../services/usuarioService';
import { obtenerCalificacionesPorUsuario, type CalificacionResponse } from '../services/calificacionService';
import { censorName } from '../utils/privacidad';
import { getAvatarAnimado } from '../components/AvatarAnimado';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  ADMIN:  { label: 'Administrador', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  SELLER: { label: 'Vendedor',      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  USER:   { label: 'Usuario',       color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

export default function PerfilPublicoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<UsuarioPublico | null>(null);
  const [calificaciones, setCalificaciones] = useState<CalificacionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    obtenerPerfilPublico(id)
      .then(data => {
        setPerfil(data);
        return obtenerCalificacionesPorUsuario(data.id, 0, 20);
      })
      .then(res => setCalificaciones(res.content))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-40 rounded-2xl bg-surface border border-border" />
        <div className="h-32 rounded-2xl bg-surface border border-border" />
      </div>
    );
  }

  if (error || !perfil) {
    return <div className="py-20 text-center text-text-muted text-sm">Usuario no encontrado.</div>;
  }

  const avatarInfo = getAvatarAnimado(perfil.id);
  const PublicAvatarComp = avatarInfo.Component;
  const nombreCensurado = censorName(perfil.nombre);
  const promedio = calificaciones.length > 0
    ? (calificaciones.reduce((s, c) => s + c.puntuacion, 0) / calificaciones.length).toFixed(1)
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
        <ChevronLeft className="h-3.5 w-3.5" /> Volver
      </button>

      {/* Header */}
      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-5">
        <div className="flex-shrink-0">
          <PublicAvatarComp size={80} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold text-text-primary truncate">{nombreCensurado}</h2>
          {promedio && (
            <p className="text-xs text-amber-400 font-bold mt-0.5">{promedio} ★ calificación promedio</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {perfil.roles.map(r => {
              const meta = ROLE_LABELS[r] ?? { label: r, color: 'bg-input text-text-secondary border-border' };
              return (
                <span key={r} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.color}`}>
                  {meta.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-5 text-center">
          <Gavel className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <span className="block font-mono text-3xl font-extrabold text-text-primary">{perfil.totalPujas}</span>
          <span className="block text-[11px] text-text-muted uppercase tracking-wider mt-1">Pujas realizadas</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 text-center">
          <Package className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <span className="block font-mono text-3xl font-extrabold text-text-primary">{perfil.totalSubastas}</span>
          <span className="block text-[11px] text-text-muted uppercase tracking-wider mt-1">Subastas publicadas</span>
        </div>
      </div>

      {/* Calificaciones */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" /> Calificaciones recibidas
          </h3>
          {promedio && (
            <span className="text-xs font-mono font-bold text-amber-400">{promedio} ★ promedio</span>
          )}
        </div>

        {calificaciones.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">Este usuario aún no tiene calificaciones.</p>
        ) : (
          <div className="space-y-3">
            {calificaciones.map(c => (
              <div key={c.id} className="bg-input border border-border/60 rounded-xl p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-text-primary">{censorName(c.calificadorNombre)}</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {'★'.repeat(c.puntuacion)}{'☆'.repeat(5 - c.puntuacion)}
                  </span>
                </div>
                {c.comentario && <p className="text-text-secondary leading-relaxed">{c.comentario}</p>}
                <span className="block mt-1 text-[10px] text-text-muted">
                  {new Date(c.fechaCreacion).toLocaleDateString('es-ES')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
