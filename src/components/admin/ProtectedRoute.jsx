// Protege las rutas del panel: si no hay sesión redirige al login.
// Si se pasa soloAdmin, además exige rol de administrador.
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { autenticado, esAdmin, cargando } = useAuth();
  const location = useLocation();

  // Mientras se resuelve la sesión, evita parpadeos/redirecciones falsas.
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-950">
        <div className="h-10 w-10 rounded-full border-2 border-bronze-600/30 border-t-bronze-400 animate-spin" />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (soloAdmin && !esAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-night-950 text-center px-6">
        <p className="font-display text-2xl text-bronze-400">Acceso restringido</p>
        <p className="text-white/60">Esta sección es solo para administradores.</p>
      </div>
    );
  }

  return children;
}
