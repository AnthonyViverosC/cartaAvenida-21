// Cliente de Supabase (único para toda la app).
// Las claves se leen desde variables de entorno (.env), nunca se escriben en el código.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Aviso claro en consola si faltan las variables (evita errores confusos).
if (!url || !anonKey) {
  console.error(
    '[Supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
      'Crea un archivo .env a partir de .env.example.'
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ¿Está configurado el backend? (para hacer fallback elegante si aún no)
export const supabaseConfigurado = Boolean(url && anonKey);
