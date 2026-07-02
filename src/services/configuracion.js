// Servicio de Configuración del negocio (fila única id=1).
import { supabase } from '../lib/supabase.js';

export async function obtenerConfig() {
  const { data, error } = await supabase
    .from('configuracion')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}

export async function guardarConfig(cambios) {
  const { data, error } = await supabase
    .from('configuracion')
    .update({ ...cambios, actualizado_en: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}
