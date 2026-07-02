// Layout base del panel: barra lateral con navegación + área de contenido.
// Las secciones se renderizan con <Outlet/> (rutas hijas).
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  Percent,
  CalendarDays,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const enlaces = [
  { to: '/admin', fin: true, icono: LayoutDashboard, texto: 'Dashboard' },
  { to: '/admin/productos', icono: Package, texto: 'Productos' },
  { to: '/admin/categorias', icono: Tags, texto: 'Categorías' },
  { to: '/admin/promociones', icono: Percent, texto: 'Promociones' },
  { to: '/admin/eventos', icono: CalendarDays, texto: 'Eventos' },
  { to: '/admin/configuracion', icono: Settings, texto: 'Configuración' },
];

export default function AdminLayout() {
  const { perfil, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);

  async function onLogout() {
    await cerrarSesion();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-night-950 text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-night-900 border-r border-white/10 flex flex-col transition-transform lg:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <span className="font-display text-2xl gradient-text">Avenida 21</span>
          <button className="lg:hidden text-white/60" onClick={() => setAbierto(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {enlaces.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.fin}
              onClick={() => setAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-bronze-500/15 text-bronze-300 border border-bronze-500/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <e.icono className="h-4 w-4" />
              {e.texto}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition"
          >
            <ExternalLink className="h-4 w-4" /> Ver el menú
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {abierto && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setAbierto(false)}
        />
      )}

      {/* Contenido */}
      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="sticky top-0 z-20 bg-night-900/80 backdrop-blur border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between">
          <button className="lg:hidden text-white/70" onClick={() => setAbierto(true)}>
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">{perfil?.nombre}</p>
              <p className="text-xs text-bronze-400 capitalize">{perfil?.rol}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-bronze-500 to-gold-500 flex items-center justify-center text-night-950 font-semibold">
              {(perfil?.nombre || '?').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
