import { useState, type FormEvent } from 'react';
import { Gavel } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(nombre, email, password, telefono);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-main px-4 relative">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="rounded-2xl border border-border bg-surface p-6 text-center max-w-sm w-full">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Gavel className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-text-primary">¡Registro exitoso!</h2>
          <p className="mt-1 text-xs text-text-secondary">Roles <strong className="text-amber-400">USER</strong> y <strong className="text-amber-400">SELLER</strong> asignados</p>
          <p className="mt-1 text-xs text-text-muted">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-main px-4 relative">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-main shadow-lg shadow-amber-500/10">
            <Gavel className="h-5 w-5" />
          </div>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-text-primary">
            <span className="font-display font-bold tracking-widest">QUIEN DA MA<span className="text-amber-500">$</span></span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs text-rose-400">{error}</div>
          )}

          <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            placeholder="Nombre" />

          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            placeholder="Email" />

          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            placeholder="Contraseña (mín. 8 caracteres)" />

          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            placeholder="Teléfono (opcional)" />

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-main shadow-sm hover:bg-amber-400 transition disabled:opacity-50">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-xs text-text-muted">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="font-medium text-amber-400 hover:text-amber-300">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
