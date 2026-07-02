// Contexto de autenticación: expone la sesión, el perfil (con su rol) y las
// acciones de login/logout. Envuelve toda la app para proteger rutas del panel.
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null); // { id, nombre, rol }
  const [cargando, setCargando] = useState(true);

  // Carga el perfil (rol) del usuario autenticado.
  async function cargarPerfil(userId) {
    if (!userId) {
      setPerfil(null);
      return;
    }
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombre, rol')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('[Auth] No se pudo cargar el perfil:', error.message);
      setPerfil(null);
    } else {
      setPerfil(data);
    }
  }

  useEffect(() => {
    // Sesión inicial.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      await cargarPerfil(session?.user?.id);
      setCargando(false);
    });

    // Reacciona a cambios de sesión (login, logout, refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_evento, session) => {
        setSession(session);
        await cargarPerfil(session?.user?.id);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Acciones ──────────────────────────────────────────────
  async function iniciarSesion(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setPerfil(null);
  }

  const valor = {
    session,
    perfil,
    cargando,
    autenticado: Boolean(session),
    esAdmin: perfil?.rol === 'admin',
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// Hook de acceso al contexto de auth.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
