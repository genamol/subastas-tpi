import { useState, type FormEvent } from 'react';
import { Gavel } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/catalogo');
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Network Error') {
        setError('No se pudo conectar con el servidor');
      } else {
        setError('Email o contraseña incorrectos');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-main px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-[#0A0A0C] shadow-lg shadow-amber-500/10">
            <Gavel className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
            <span className="font-display">UniSubastas</span>
          </h1>
          <p className="mt-1 text-xs text-text-muted">Iniciá sesión para pujar</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-8 space-y-5">
          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400">
              {error}
            </div>
          )}

          {error === 'Email o contraseña incorrectos' && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-xs text-amber-400">
              ¿Primera vez?{' '}
              <Link to="/register" className="underline font-medium hover:text-amber-300 transition">
                Creá tu cuenta gratis
              </Link>
              {' '}— es inmediato, sin verificación.
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
              placeholder="usuario@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-text-primary placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-[#0A0A0C] shadow-sm shadow-amber-500/10 hover:bg-amber-400 transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="text-center text-xs text-text-muted">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="font-medium text-amber-400 hover:text-amber-300 transition">
              Registrate
            </Link>
          </p>

          <div className="pt-3 border-t border-border">
            <Link
              to="/demo"
              className="block w-full rounded-xl border border-border bg-input py-2.5 text-center text-xs font-medium text-text-muted hover:text-text-primary hover:border-border transition"
            >
              Ver demo sin registrarse
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
