// Página de inicio de sesión del panel administrativo.
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await iniciarSesion(email.trim(), password);
      navigate(destino, { replace: true });
    } catch (err) {
      // Mensaje amigable según el error de Supabase.
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Debes confirmar tu correo antes de entrar.');
      } else {
        setError('No se pudo iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-night-950 bg-radial-spot px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl gradient-text">Avenida 21</h1>
          <p className="text-white/50 mt-1">Panel de administración</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass rounded-2xl p-6 md:p-8 shadow-card space-y-5"
        >
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-sm text-white/70">Correo</span>
            <div className="mt-1.5 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white pl-10 pr-3 py-2.5 transition"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm text-white/70">Contraseña</span>
            <div className="mt-1.5 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white pl-10 pr-3 py-2.5 transition"
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={enviando}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950 font-semibold py-2.5 hover:shadow-gold transition disabled:opacity-60"
          >
            {enviando ? (
              <span className="h-5 w-5 rounded-full border-2 border-night-950/40 border-t-night-950 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Entrar
              </>
            )}
          </button>

          <div className="text-center">
            <Link to="/" className="text-sm text-white/40 hover:text-bronze-400 transition">
              ← Volver al menú
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
