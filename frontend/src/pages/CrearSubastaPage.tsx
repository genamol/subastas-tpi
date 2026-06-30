import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Upload } from 'lucide-react';
import { subirImagen } from '../services/imagenService';
import * as subastaService from '../services/subastaService';
import * as productoService from '../services/productoService';
import api from '../services/api';

const MAX_SIZE_MB = 5;

interface Categoria { id: number; nombre: string; }

function formatForInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CrearSubastaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editAuction = location.state?.editAuction;
  const isEditMode = !!editAuction;
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [newTitle, setNewTitle] = useState(editAuction?.title || '');
  const [newCategoryId, setNewCategoryId] = useState<number>(0);
  const [newImage, setNewImage] = useState(editAuction?.image || '');
  const [newBasePrice, setNewBasePrice] = useState(editAuction?.startingPrice ? String(editAuction.startingPrice) : '');
  const [newMinIncrement, setNewMinIncrement] = useState(editAuction?.minIncrement ? String(editAuction.minIncrement) : '');
  const [newDescription, setNewDescription] = useState(editAuction?.description || '');
  const [iniciarAhora, setIniciarAhora] = useState(true);
  const [fechaInicio, setFechaInicio] = useState(() => formatForInput(new Date(Date.now() + 5 * 60 * 1000)));
  const [fechaCierre, setFechaCierre] = useState(() => formatForInput(new Date(Date.now() + 60 * 60 * 1000)));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionType, setActionType] = useState<'publicar' | 'borrador'>('publicar');

  const minFechaInicio = formatForInput(new Date(Date.now() + 2 * 60 * 1000));

  useEffect(() => {
    api.get<Categoria[]>('/api/categorias').then(({ data }) => {
      setCategorias(data);
      if (editAuction) {
        const cat = data.find(c => c.nombre === editAuction.category);
        if (cat) setNewCategoryId(cat.id);
      } else if (data.length > 0) {
        setNewCategoryId(data[0].id);
      }
    }).catch(() => {});
  }, [editAuction]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') { setUploadError('Solo JPG y PNG'); return; }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) { setUploadError(`Máximo ${MAX_SIZE_MB} MB`); return; }
    setUploadError('');
    setUploading(true);
    try {
      const url = await subirImagen(file);
      setNewImage(url);
    } catch {
      setUploadError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setSubmitting(true);
    try {
      if (isEditMode) {
        // MODO EDICIÓN: Solo actualizamos el producto en el backend
        await productoService.actualizarProducto(Number(editAuction.productoId), {
          nombre: newTitle,
          descripcion: newDescription,
          categoriaId: newCategoryId,
          imagenes: newImage ? [newImage] : [],
        });

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate(`/subastas/${editAuction.id}`);
        }, 2000);
      } else {

        const inicioDate = iniciarAhora ? new Date(Date.now() + 5000) : new Date(fechaInicio);
        const cierreDate = new Date(fechaCierre);

        if (cierreDate <= inicioDate) {
          setError('La fecha de cierre debe ser posterior a la de inicio.');
          setSubmitting(false);
          return;
        }

        const producto = await productoService.crearProducto({
          nombre: newTitle,
          descripcion: newDescription,
          categoriaId: newCategoryId,
          imagenes: newImage ? [newImage] : [],
        });

        const subasta = await subastaService.crearSubasta({
          productoId: producto.id,
          precioBase: parseFloat(newBasePrice),
          incrementoMinimo: parseFloat(newMinIncrement),
          fechaInicio: inicioDate.toISOString(),
          fechaCierre: cierreDate.toISOString(),
          descripcion: newDescription,
        });

        if (actionType === 'publicar') {
          await subastaService.publicarSubasta(Number(subasta.id));
        }

        setSuccess(true);
        setNewTitle(''); setNewBasePrice(''); setNewMinIncrement(''); setNewDescription(''); setNewImage('');
        setTimeout(() => {
          setSuccess(false);
          navigate(actionType === 'publicar' ? '/catalogo' : '/mis-subastas');
        }, 2000);
      }
    } catch {
      setError('Error al procesar la solicitud. Verificá los datos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-surface border border-border p-6 rounded-2xl animate-fade-in">
      {success && (
        <div className="mb-4 flex items-center space-x-3 rounded-xl border border-emerald-500/20 bg-main/90 p-3 text-xs font-medium text-emerald-400">
          <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>
            {actionType === 'publicar'
              ? '¡Subasta publicada! Redirigiendo al catálogo...'
              : '¡Borrador guardado! Redirigiendo a mis publicaciones...'}
          </span>
        </div>
      )}
      {error && <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400">{error}</div>}

      <div className="border-b border-border pb-3 mb-5">
        <h3 className="font-display text-base font-bold text-text-primary uppercase tracking-wider">Publicar Nuevo Artículo</h3>
        <p className="text-[11px] text-text-muted">Crea el producto y la subasta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Título del Artículo:</label>
          <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none"
            placeholder="ej. iPhone 15 Pro Max impecable caja original" />
        </div>

        <div>
          <label htmlFor="categoria" className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Categoría:</label>
          <select id="categoria" value={newCategoryId} onChange={(e) => setNewCategoryId(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-input p-3 text-text-primary focus:border-amber-500 focus:outline-none">
            <option value={0}>Seleccionar categoría</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Precio Base (ARS):</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-text-muted">$</span></div>
              <input type="number" required value={newBasePrice} disabled={isEditMode} onChange={(e) => setNewBasePrice(e.target.value)}
                className="w-full rounded-xl border border-border bg-input py-3 pl-8 pr-3 text-text-primary focus:border-amber-500 focus:outline-none font-mono"
                placeholder="250" min="1" />
            </div>
          </div>
          <div>
            <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Incremento Mínimo (ARS):</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-text-muted">$</span></div>
              <input type="number" required value={newMinIncrement} onChange={(e) => setNewMinIncrement(e.target.value)}
                className="w-full rounded-xl border border-border bg-input py-3 pl-8 pr-3 text-text-primary focus:border-amber-500 focus:outline-none font-mono"
                placeholder="10" min="1" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-input border border-border rounded-xl px-4 py-3">
            <label className="flex items-center gap-2 cursor-pointer text-text-primary font-bold uppercase tracking-wider">
              <input type="checkbox" checked={iniciarAhora} onChange={() => setIniciarAhora(v => !v)}
                className="accent-amber-500 h-4 w-4" />
              Iniciar ahora
            </label>
          </div>

          {!iniciarAhora && (
            <div>
              <label htmlFor="fecha-inicio" className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Fecha de Inicio:</label>
              <input id="fecha-inicio" type="datetime-local" required value={fechaInicio} min={minFechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full rounded-xl border border-border bg-input p-3 text-text-primary focus:border-amber-500 focus:outline-none" />
            </div>
          )}

          <div>
            <label htmlFor="fecha-cierre" className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Fecha de Cierre:</label>
            <input id="fecha-cierre" type="datetime-local" required value={fechaCierre}
              min={iniciarAhora ? minFechaInicio : fechaInicio}
              onChange={(e) => setFechaCierre(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-3 text-text-primary focus:border-amber-500 focus:outline-none" />
          </div>
        </div>
2
        <div>
          <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Imagen del Producto:</label>
          <div className="flex gap-2">
            <input type="url" value={newImage} onChange={(e) => setNewImage(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              placeholder="https://... (URL) o subí un archivo" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-input px-4 py-3 text-xs font-medium text-text-secondary hover:text-amber-400 hover:border-amber-500/30 transition disabled:opacity-50">
              <Upload className="h-4 w-4" /><span>{uploading ? 'Subiendo...' : 'Archivo'}</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileUpload} className="hidden" title="Subir imagen" />
          </div>
          {uploadError && <p className="mt-1 text-[11px] text-rose-400">{uploadError}</p>}
          {newImage && <img src={newImage} alt="Vista previa" className="mt-2 h-24 rounded-xl object-cover border border-border" />}
          <p className="mt-1 text-[10px] text-text-muted">Máximo {MAX_SIZE_MB} MB. Formatos: JPG, PNG.</p>
        </div>

        <div>
          <label className="block text-text-secondary font-bold mb-1.5 uppercase tracking-wider">Descripción Detallada:</label>
          <textarea required value={newDescription} onChange={(e) => setNewDescription(e.target.value)}
            className="w-full h-24 rounded-xl border border-border bg-input p-3 text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none leading-relaxed"
            placeholder="Describe las condiciones, detalles técnicos and procedencia del producto..." />
        </div>

        {isEditMode ? (
            <div className="pt-2">
              <button type="submit" disabled={submitting}
                      className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg active:scale-98 disabled:opacity-50">
                {submitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
        ) : (
            <div className="pt-2 flex gap-3">
              <button type="submit" onClick={() => setActionType('publicar')} disabled={submitting}
                      className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-amber-500/5 active:scale-98 disabled:opacity-50">
                {submitting && actionType === 'publicar' ? 'Publicando...' : 'Publicar Ahora'}
              </button>
              <button type="submit" onClick={() => setActionType('borrador')} disabled={submitting}
                      className="flex-1 rounded-xl bg-input border border-border hover:border-amber-500/30 text-text-secondary hover:text-text-primary py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer active:scale-98 disabled:opacity-50">
                {submitting && actionType === 'borrador' ? 'Guardando...' : 'Guardar Borrador'}
              </button>
            </div>
        )}
      </form>
    </div>
  );
}
