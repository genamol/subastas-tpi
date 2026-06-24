import { useState, useRef } from 'react';
import { CheckCircle, Upload } from 'lucide-react';

const MAX_SIZE_MB = 5;
import { subirImagen } from '../services/imagenService';

interface CrearSubastaPageProps {
  categories: string[];
  onCreateAuction: (data: {
    title: string;
    category: string;
    image: string;
    basePrice: number;
    minIncrement: number;
    description: string;
    duration: number;
  }) => void;
  successMessage: string | null;
}

export default function CrearSubastaPage({ categories, onCreateAuction, successMessage }: CrearSubastaPageProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(categories.length > 0 ? categories[0] : 'Tecnología');
  const [newImage, setNewImage] = useState('');
  const [newBasePrice, setNewBasePrice] = useState('');
  const [newMinIncrement, setNewMinIncrement] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState('10');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setUploadError('Solo se permiten imágenes JPG y PNG');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`La imagen no debe superar los ${MAX_SIZE_MB} MB`);
      return;
    }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAuction({
      title: newTitle,
      category: newCategory,
      image: newImage,
      basePrice: parseFloat(newBasePrice),
      minIncrement: parseFloat(newMinIncrement),
      description: newDescription,
      duration: parseFloat(newDuration)
    });
    setNewTitle('');
    setNewBasePrice('');
    setNewMinIncrement('');
    setNewDescription('');
    setNewImage('');
  };

  return (
    <div className="max-w-xl mx-auto bg-[#0F0F13] border border-slate-800 p-6 rounded-2xl animate-fade-in">
      {successMessage && (
        <div className="mb-4 flex items-center space-x-3 rounded-xl border border-emerald-500/20 bg-[#0A0A0C]/90 p-3 text-xs font-medium text-emerald-400 shadow-lg shadow-emerald-500/5">
          <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="border-b border-slate-800 pb-3 mb-5">
        <h3 className="font-display text-base font-bold text-slate-100 uppercase tracking-wider">Publicar Nuevo Artículo</h3>
        <p className="text-[11px] text-slate-500">Crea el producto y regístralo como BORRADOR (luego cambia a PUBLICADA)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Título del Artículo:</label>
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#121216] p-3 text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
            placeholder="ej. iPhone 15 Pro Max impecable caja original"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Categoría:</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#121216] p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Duración de la Subasta (Minutos):</label>
            <input
              type="number"
              required
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#121216] p-3 text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
              placeholder="ej. 10"
              min="1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Precio Base (ARS):</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-600">$</span>
              </div>
              <input
                type="number"
                required
                value={newBasePrice}
                onChange={(e) => setNewBasePrice(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-[#121216] py-3 pl-8 pr-3 text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                placeholder="ej. 250"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Incremento Mínimo (ARS):</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-600">$</span>
              </div>
              <input
                type="number"
                required
                value={newMinIncrement}
                onChange={(e) => setNewMinIncrement(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-[#121216] py-3 pl-8 pr-3 text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                placeholder="ej. 10"
                min="1"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Imagen del Producto:</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="flex-1 rounded-xl border border-slate-800 bg-[#121216] p-3 text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              placeholder="https://... (URL) o subí un archivo"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#121216] px-4 py-3 text-xs font-medium text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? 'Subiendo...' : 'Archivo'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {uploadError && <p className="mt-1 text-[11px] text-rose-400">{uploadError}</p>}
          {newImage && (
            <img src={newImage} alt="Vista previa" className="mt-2 h-24 rounded-xl object-cover border border-slate-800" />
          )}
          <p className="mt-1 text-[10px] text-slate-600">Máximo {MAX_SIZE_MB} MB. Formatos: JPG, PNG, WebP.</p>
        </div>

        <div>
          <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Descripción Detallada:</label>
          <textarea
            required
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full h-24 rounded-xl border border-slate-800 bg-[#121216] p-3 text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none leading-relaxed"
            placeholder="Describe las condiciones, detalles técnicos y procedencia del producto..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-amber-500/5 active:scale-98"
          >
            Publicar Artículo en Vivo
          </button>
        </div>
      </form>
    </div>
  );
}
