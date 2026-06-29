import { useState, useEffect, useCallback } from 'react';
import { Package, Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as productoService from '../services/productoService';
import type { ProductoBackend } from '../utils/backendTypes';
import api from '../services/api';

interface Categoria { id: number; nombre: string; }

export default function MisProductosPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<ProductoBackend[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editCategoriaId, setEditCategoriaId] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    try {
      const data = await productoService.misProductos(0, 50);
      setProductos(data.content);
    } catch {
      setError('Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    api.get<Categoria[]>('/api/categorias').then(({ data }) => setCategorias(data)).catch(() => {});
  }, [cargar]);

  const startEdit = (p: ProductoBackend) => {
    setEditandoId(p.id);
    setEditNombre(p.nombre);
    setEditDescripcion(p.descripcion ?? '');
    setEditCategoriaId(p.categoriaId);
    setError('');
  };

  const cancelEdit = () => {
    setEditandoId(null);
    setError('');
  };

  const handleSave = async (id: number) => {
    if (!editNombre.trim()) return;
    setSaving(true);
    setError('');
    try {
      const updated = await productoService.actualizarProducto(id, {
        nombre: editNombre.trim(),
        descripcion: editDescripcion.trim() || undefined,
        categoriaId: editCategoriaId,
      });
      setProductos(prev => prev.map(p => p.id === id ? updated : p));
      setEditandoId(null);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { mensaje?: string } } };
      setError(axiosErr.response?.data?.mensaje ?? 'Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que querés eliminar este producto?')) return;
    setError('');
    try {
      await productoService.eliminarProducto(id);
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { mensaje?: string } } };
      setError(axiosErr.response?.data?.mensaje ?? 'No se puede eliminar (puede tener subastas asociadas).');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-3 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-surface border border-border" />)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-lg font-bold text-text-primary uppercase tracking-wide">Mis Productos</h3>
          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg">
            {productos.length}
          </span>
        </div>
        <button
          onClick={() => navigate('/crear')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Nuevo
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400">
          {error}
        </div>
      )}

      {productos.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border">
          <Package className="h-10 w-10 text-text-secondary/60 mx-auto mb-3" />
          <span className="block text-text-muted text-sm">No tenés productos cargados</span>
          <button onClick={() => navigate('/crear')} className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition-colors">
            Publicar artículo
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {productos.map(p => (
            <div key={p.id} className="bg-surface border border-border rounded-xl p-4">
              {editandoId === p.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Nombre</label>
                      <input
                        autoFocus
                        value={editNombre}
                        onChange={e => setEditNombre(e.target.value)}
                        className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Categoría</label>
                      <select
                        value={editCategoriaId}
                        onChange={e => setEditCategoriaId(Number(e.target.value))}
                        className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-amber-500 focus:outline-none"
                      >
                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Descripción</label>
                      <textarea
                        value={editDescripcion}
                        onChange={e => setEditDescripcion(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-amber-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(p.id)}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" /> {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-text-secondary hover:text-text-primary text-xs font-bold transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {p.imagenes?.[0] && (
                    <img src={p.imagenes[0]} alt={p.nombre} className="h-12 w-12 rounded-lg object-cover flex-shrink-0 border border-border" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-text-primary truncate">{p.nombre}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-input border border-border/60 mr-1">{p.categoriaNombre}</span>
                      {p.descripcion && <span className="truncate">{p.descripcion.slice(0, 60)}{p.descripcion.length > 60 ? '…' : ''}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="p-2 rounded-lg text-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
