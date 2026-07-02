// Trae las promociones ACTIVAS y vigentes (según fechas) para mostrarlas
// en la página pública.
import { useEffect, useState } from 'react';
import { supabase, supabaseConfigurado } from '../lib/supabase.js';

export function usePromociones() {
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    if (!supabaseConfigurado) return;
    let activo = true;

    (async () => {
      const hoy = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('promociones')
        .select('id, titulo, descripcion, tipo, valor, imagen_url, fecha_inicio, fecha_fin, productos(nombre)')
        .eq('activa', true)
        .order('creado_en', { ascending: false });
      if (error) {
        console.error('[usePromociones]', error.message);
        return;
      }
      // Filtra por vigencia de fechas (si están definidas).
      const vigentes = (data || []).filter((p) => {
        if (p.fecha_inicio && p.fecha_inicio > hoy) return false;
        if (p.fecha_fin && p.fecha_fin < hoy) return false;
        return true;
      });
      if (activo) setPromociones(vigentes);
    })();

    return () => {
      activo = false;
    };
  }, []);

  return promociones;
}
