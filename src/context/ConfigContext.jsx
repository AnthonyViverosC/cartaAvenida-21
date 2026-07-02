// Contexto de Configuración: carga los datos del negocio desde Supabase,
// los mezcla con los valores por defecto y aplica los colores del sitio.
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, supabaseConfigurado } from '../lib/supabase.js';
import { CONFIG_DEFAULT } from '../config/defaults.js';

const ConfigContext = createContext(null);

// Mezcla profunda sencilla para colores/redes.
function mezclar(base, extra) {
  const out = { ...base, ...(extra || {}) };
  out.colores = { ...base.colores, ...(extra?.colores || {}) };
  out.redes = { ...base.redes, ...(extra?.redes || {}) };
  return out;
}

// Aplica los colores del negocio como variables CSS (accento principal).
function aplicarColores(colores) {
  const raiz = document.documentElement;
  raiz.style.setProperty('--acento', colores?.primario || CONFIG_DEFAULT.colores.primario);
  raiz.style.setProperty('--acento-2', colores?.secundario || CONFIG_DEFAULT.colores.secundario);
}

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(CONFIG_DEFAULT);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!supabaseConfigurado) {
      aplicarColores(CONFIG_DEFAULT.colores);
      setCargando(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('configuracion').select('*').eq('id', 1).single();
      if (error) throw error;
      const fusion = mezclar(CONFIG_DEFAULT, data);
      setConfig(fusion);
      aplicarColores(fusion.colores);
    } catch (e) {
      console.error('[Config] Usando valores por defecto:', e.message);
      aplicarColores(CONFIG_DEFAULT.colores);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <ConfigContext.Provider value={{ config, cargando, recargar: cargar, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig debe usarse dentro de <ConfigProvider>');
  return ctx;
}
