import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload } from 'lucide-react';
import { subirImagen } from '../services/imagenService';
import * as subastaService from '../services/subastaService';
import * as productoService from '../services/productoService';
import api from '../services/api';

const MAX_SIZE_MB = 5;

interface Categoria { id: number; nombre: string; }

export default function CrearSubastaPage() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState<number>(0);
  const [newImage, setNewImage] = useState('');
  const [newBasePrice, setNewBasePrice] = useState('');
  const [newMinIncrement, setNewMinIncrement] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [iniciarAhora, setIniciarAhora] = useState(true);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/api/categorias').then(res => {
      const data = res.data.content ?? res.data;
      if (Array.isArray(data)) setCategorias(data);
    }).catch(() => {});
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') { setUploadError('Solo JPG y PNG'); return; }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) { setUploadError(`Máximo ${MAX_SIZE_MB} MB`); return; }
    setUploadError('');
    setUploading(true);
    try { const url = await subirImagen(file); setNewImage(url); } catch { setUploadError('Error al subir'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const ahora = iniciarAhora ? new Date(Date.now() + 60000).toISOString() : new Date(fechaInicio).toISOString();
      const cierre = iniciarAhora
        ? new Date(Date.now() + 3600000).toISOString()
        : new Date(fechaCierre).toISOString();

      const producto = await productoService.crearProducto({
        nombre: newTitle, descripcion: newDescription, categoriaId: newCategoryId,
        imagenes: newImage ? [newImage] : [],
      });

      await subastaService.crearSubasta({
        productoId: producto.id,
        precioBase: parseFloat(newBasePrice),
        incrementoMinimo: parseFloat(newMinIncrement),
        fechaInicio: ahora, fechaCierre: cierre, descripcion: newDescription,
      });
      setSuccess(true);
      setNewTitle(''); setNewBasePrice(''); setNewMinIncrement(''); setNewDescription(''); setNewImage('');
      setTimeout(() => { setSuccess(false); navigate('/catalogo'); }, 2000);
    } catch { setError('Error al crear la subasta'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-xl mx-auto bg-surface border border-border p-6 rounded-2xl animate-fade-in">
      {success && (
        <div className="mb-4 flex items-center space-x-3 rounded-xl border border-emerald-500/20 bg-main/90 p-3 text-xs font-medium text-emerald-400">
          <CheckCircle className="h-4 w-4 text-emerald-400" /><span>¡Subasta creada! Redirigiendo...</span>
        </div>
      )}
      {error && <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400">{error}</div>}
      <div className="border-b border-border pb-3 mb-5">
        <h3 className="font-display text-base font-bold text-text-primary uppercase tracking-wider">Publicar Artículo</h3>
        <p className="text-[11px] text-text-muted">Crea el producto y la subasta</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          className="w-full rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none" placeholder="Título del artículo" />

        <select value={newCategoryId} onChange={(e) => setNewCategoryId(Number(e.target.value))}
          className="w-full rounded-xl border border-border bg-input p-3 text-text-primary focus:border-amber-500 focus:outline-none">
          <option value={0}>Seleccionar categoría</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-text-muted">$</span></div>
            <input type="number" required value={newBasePrice} onChange={(e) => setNewBasePrice(e.target.value)}
              className="w-full rounded-xl border border-border bg-input py-3 pl-8 pr-3 text-text-primary focus:border-amber-500 focus:outline-none font-mono" placeholder="Precio base" min="1" />
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-text-muted">$</span></div>
            <input type="number" required value={newMinIncrement} onChange={(e) => setNewMinIncrement(e.target.value)}
              className="w-full rounded-xl border border-border bg-input py-3 pl-8 pr-3 text-text-primary focus:border-amber-500 focus:outline-none font-mono" placeholder="Incremento" min="1" />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-input border border-border rounded-xl p-3">
          <label className="flex items-center gap-2 cursor-pointer text-text-primary">
            <input type="checkbox" checked={iniciarAhora} onChange={() => setIniciarAhora(!iniciarAhora)} />
            <span>Iniciar ahora</span>
          </label>
          {!iniciarAhora && (
            <>
              <input type="datetime-local" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-text-primary" />
              <input type="datetime-local" value={fechaCierre} onChange={(e) => setFechaCierre(e.target.value)}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-text-primary" />
            </>
          )}
        </div>

        <div>
          <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Imagen:</label>
          <div className="flex gap-2">
            <input type="url" value={newImage} onChange={(e) => setNewImage(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none" placeholder="URL o subir archivo" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-input px-4 py-3 text-xs font-medium text-text-secondary hover:text-amber-400 disabled:opacity-50">
              <Upload className="h-4 w-4" /><span>{uploading ? '...' : 'Archivo'}</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileUpload} className="hidden" />
          </div>
          {uploadError && <p className="mt-1 text-[11px] text-rose-400">{uploadError}</p>}
          {newImage && <img src={newImage} alt="Preview" className="mt-2 h-24 rounded-xl object-cover border border-border" />}
        </div>

        <textarea required value={newDescription} onChange={(e) => setNewDescription(e.target.value)}
          className="w-full h-24 rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none" placeholder="Descripción del producto..." />

        <button type="submit" disabled={submitting}
          className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50">
          {submitting ? 'Creando...' : 'Publicar Artículo'}
        </button>
      </form>
    </div>
  );
}
