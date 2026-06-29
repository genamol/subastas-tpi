import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Gavel, Package, Edit2, Check, X, Star } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { obtenerCalificacionesPorUsuario, type CalificacionResponse } from '../services/calificacionService';

interface PerfilData {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  roles: string[];
  createdAt: string;
  totalPujas: number;
  totalSubastas: number;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  ADMIN:  { label: 'Administrador', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  SELLER: { label: 'Vendedor',      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  USER:   { label: 'Usuario',       color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

function Initials({ nombre }: { nombre: string }) {
  const foto = localStorage.getItem('foto_perfil');
  const parts = nombre.trim().split(' ');
  const ini = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2);
  return (
    <div className="h-20 w-20 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-2xl shadow-lg shadow-amber-500/20 select-none overflow-hidden">
      {foto ? <img src={foto} alt="" className="h-full w-full object-cover" /> : ini.toUpperCase()}
    </div>
  );
}

export default function PerfilPage() {
  const { nombre: nombreCtx } = useAuth();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveOk, setSaveOk] = useState(false);
  const [calificaciones, setCalificaciones] = useState<CalificacionResponse[]>([]);
  const [loadingCalif, setLoadingCalif] = useState(false);

  useEffect(() => {
    api.get<PerfilData>('/api/usuarios/me')
      .then(({ data }) => {
        setPerfil(data);
        setLoadingCalif(true);
        return obtenerCalificacionesPorUsuario(data.id, 0, 20)
          .then(res => setCalificaciones(res.content))
          .catch(() => {})
          .finally(() => setLoadingCalif(false));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    if (!perfil) return;
    setEditNombre(perfil.nombre);
    setEditTelefono(perfil.telefono);
    setSaveError('');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!perfil) return;
    setSaving(true);
    setSaveError('');
    try {
      const { data } = await api.put<PerfilData>('/api/usuarios/me', {
        nombre: editNombre,
        telefono: editTelefono,
      });
      setPerfil(data);
      setEditing(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch {
      setSaveError('Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-40 rounded-2xl bg-surface border border-border" />
        <div className="h-48 rounded-2xl bg-surface border border-border" />
      </div>
    );
  }

  if (!perfil) {
    return <div className="py-20 text-center text-text-muted text-sm">No se pudo cargar el perfil.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">

      {saveOk && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="h-4 w-4" /> Perfil actualizado correctamente.
        </div>
      )}

      {/* Header */}
      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-5">
        <Initials nombre={perfil.nombre} />
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold text-text-primary truncate">{perfil.nombre}</h2>
          <p className="text-xs text-text-muted mt-0.5">{perfil.email}</p>
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
        {!editing && (
          <button onClick={handleEdit} className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-amber-400 border border-border hover:border-amber-500/30 px-3 py-2 rounded-xl transition-colors">
            <Edit2 className="h-3.5 w-3.5" /> Editar
          </button>
        )}
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

      {/* Calificaciones recibidas */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" /> Calificaciones recibidas
          </h3>
          {calificaciones.length > 0 && (
            <span className="text-xs font-mono font-bold text-amber-400">
              {(calificaciones.reduce((s, c) => s + c.puntuacion, 0) / calificaciones.length).toFixed(1)} ★ promedio
            </span>
          )}
        </div>

        {loadingCalif ? (
          <div className="py-6 text-center">
            <div className="h-5 w-5 mx-auto animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
        ) : calificaciones.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">Aún no recibiste calificaciones.</p>
        ) : (
          <div className="space-y-3">
            {calificaciones.map(c => (
              <div key={c.id} className="bg-input border border-border/60 rounded-xl p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-text-primary">{c.calificadorNombre}</span>
                  <span className="font-mono text-amber-400 font-bold">{'★'.repeat(c.puntuacion)}{'☆'.repeat(5 - c.puntuacion)}</span>
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

      {/* Info / Edit */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 text-xs">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-text-primary border-b border-border pb-2">
          Información personal
        </h3>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Nombre:</label>
              <input
                value={editNombre}
                onChange={e => setEditNombre(e.target.value)}
                className="w-full rounded-xl border border-border bg-input p-3 text-text-primary focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Teléfono:</label>
              <input
                value={editTelefono}
                onChange={e => setEditTelefono(e.target.value)}
                className="w-full rounded-xl border border-border bg-input p-3 text-text-primary focus:border-amber-500 focus:outline-none"
              />
            </div>
            {saveError && <p className="text-rose-400 text-[11px]">{saveError}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider transition-colors disabled:opacity-50">
                <Check className="h-3.5 w-3.5" /> {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary transition-colors">
                <X className="h-3.5 w-3.5" /> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-text-secondary">
              <User className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-text-muted">Nombre</span>
                <span className="text-text-primary font-medium">{perfil.nombre}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-text-muted">Email</span>
                <span className="text-text-primary font-medium">{perfil.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-text-muted">Teléfono</span>
                <span className="text-text-primary font-medium">{perfil.telefono}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <Calendar className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-text-muted">Miembro desde</span>
                <span className="text-text-primary font-medium">{formatDate(perfil.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
