import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, XCircle, ChevronLeft, Clock } from 'lucide-react';
import { procesarPago, type PagoResponse } from '../services/pagoService';
import * as subastaService from '../services/subastaService';

function formatCardNumber(value: string): string {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function PagoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    vencimiento: '',
    cvv: '',
    medioPago: 'CREDITO',
  });
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<PagoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fechaLimite, setFechaLimite] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    subastaService.obtenerSubasta(id).then(a => {
      if (a.fechaLimitePago) {
        setFechaLimite(a.fechaLimitePago);
        setRemaining(new Date(a.fechaLimitePago).getTime() - Date.now());
      }
    }).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!fechaLimite) return;
    const t = setInterval(() => setRemaining(new Date(fechaLimite).getTime() - Date.now()), 1000);
    return () => clearInterval(t);
  }, [fechaLimite]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const raw = form.numeroTarjeta.replace(/\s/g, '');
      const res = await procesarPago(id, { ...form, numeroTarjeta: raw });
      setResultado(res);
    } catch {
      setError('Error al procesar el pago. Verificá los datos e intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (resultado) {
    const aprobado = resultado.estado === 'APROBADO';
    return (
      <div className="max-w-md mx-auto mt-10 animate-fade-in">
        <div className={`rounded-2xl border p-8 text-center ${aprobado ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
          {aprobado
            ? <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            : <XCircle className="h-16 w-16 text-rose-400 mx-auto mb-4" />
          }
          <h2 className={`font-display text-2xl font-bold mb-2 ${aprobado ? 'text-emerald-400' : 'text-rose-400'}`}>
            {aprobado ? 'Pago aprobado' : 'Pago rechazado'}
          </h2>
          <p className="text-sm text-text-muted mb-1">
            {aprobado
              ? `Tu pago fue procesado exitosamente.`
              : 'La tarjeta fue rechazada. Intentá con otra tarjeta.'}
          </p>
          {aprobado && (
            <p className="text-xs text-text-muted mb-6">
              Tarjeta terminada en <span className="font-mono font-bold text-text-primary">••••{resultado.ultimosCuatroDigitos}</span>
            </p>
          )}
          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={() => navigate(`/subastas/${id}`)}
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 text-sm transition-colors"
            >
              Volver a la subasta
            </button>
            {!aprobado && (
              <button
                onClick={() => setResultado(null)}
                className="w-full rounded-xl border border-border text-text-secondary hover:text-text-primary py-3 text-sm transition-colors"
              >
                Intentar nuevamente
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const cardDigits = form.numeroTarjeta.replace(/\s/g, '');
  const maskedDisplay = form.numeroTarjeta
    ? form.numeroTarjeta.replace(/\d(?=(\d| ){5})/g, '•')
    : '•••• •••• •••• ••••';

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <button
        onClick={() => navigate(`/subastas/${id}`)}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Volver a la subasta
      </button>

      {remaining !== null && (
        <div className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold border ${
          remaining <= 0
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            : remaining < 3600000
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          <Clock className="h-4 w-4 flex-shrink-0" />
          {remaining <= 0
            ? 'El plazo de pago venció.'
            : (() => {
                const h = Math.floor(remaining / 3600000);
                const m = Math.floor((remaining % 3600000) / 60000);
                const s = Math.floor((remaining % 60000) / 1000);
                const txt = h > 0 ? `${h}h ${m}min` : m > 0 ? `${m}min ${s}s` : `${s}s`;
                return `Tiempo restante para pagar: ${txt}`;
              })()
          }
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {/* Card preview */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <CreditCard className="h-8 w-8 mb-4 opacity-80" />
            <p className="font-mono text-lg tracking-[0.2em] font-bold mb-3">{maskedDisplay}</p>
            <div className="flex justify-between text-xs font-semibold opacity-80">
              <span>{form.nombreTitular || 'NOMBRE TITULAR'}</span>
              <span>{form.vencimiento || 'MM/AA'}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-2 mb-2">
            {['CREDITO', 'DEBITO'].map(tipo => (
              <button
                key={tipo}
                type="button"
                onClick={() => handleChange('medioPago', tipo)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wider transition-all border ${
                  form.medioPago === tipo
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-input border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {tipo === 'CREDITO' ? 'Crédito' : 'Débito'}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Número de tarjeta</label>
            <input
              type="text"
              inputMode="numeric"
              value={form.numeroTarjeta}
              onChange={e => handleChange('numeroTarjeta', formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              required
              className="w-full rounded-xl border border-border bg-input py-2.5 px-4 text-sm font-mono text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Nombre del titular</label>
            <input
              type="text"
              value={form.nombreTitular}
              onChange={e => handleChange('nombreTitular', e.target.value.toUpperCase())}
              placeholder="COMO APARECE EN LA TARJETA"
              required
              className="w-full rounded-xl border border-border bg-input py-2.5 px-4 text-sm font-mono text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Vencimiento</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.vencimiento}
                onChange={e => handleChange('vencimiento', formatExpiry(e.target.value))}
                placeholder="MM/AA"
                maxLength={5}
                required
                className="w-full rounded-xl border border-border bg-input py-2.5 px-4 text-sm font-mono text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">CVV</label>
              <input
                type="password"
                inputMode="numeric"
                value={form.cvv}
                onChange={e => handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                maxLength={4}
                required
                className="w-full rounded-xl border border-border bg-input py-2.5 px-4 text-sm font-mono text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400">{error}</div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || cardDigits.length < 16}
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-3 text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              {loading ? 'Procesando...' : 'Confirmar pago'}
            </button>
            <p className="text-center text-[10px] text-text-muted mt-3 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Pago simulado — no se realiza ningún cobro real
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
