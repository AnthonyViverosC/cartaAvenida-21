// Servicio de Categorías: operaciones CRUD contra Supabase.
import { supabase } from '../lib/supabase.js';

// Genera un slug limpio a partir del nombre (para el ancla en la web).
export function generarSlug(nombre) {
  return (nombre || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Lista todas las categorías (incluye ocultas), ordenadas.
export async function listarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('orden', { ascending: true });
  if (error) throw error;
  return data;
}

export async function crearCategoria({ nombre, icono = '', visible = true }) {
  if (!nombre?.trim()) throw new Error('El nombre es obligatorio.');
  // Coloca la nueva al final.
  const { count } = await supabase
    .from('categorias')
    .select('id', { count: 'exact', head: true });
  const { data, error } = await supabase
    .from('categorias')
    .insert({ nombre: nombre.trim(), slug: generarSlug(nombre), icono, visible, orden: count ?? 0 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarCategoria(id, cambios) {
  if (cambios.nombre !== undefined && !cambios.nombre.trim()) {
    throw new Error('El nombre es obligatorio.');
  }
  const { data, error } = await supabase
    .from('categorias')
    .update(cambios)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarCategoria(id) {
  const { error } = await supabase.from('categorias').delete().eq('id', id);
  if (error) throw error;
}

// Guarda el nuevo orden tras un drag & drop.
export async function reordenarCategorias(idsOrdenados) {
  const updates = idsOrdenados.map((id, orden) =>
    supabase.from('categorias').update({ orden }).eq('id', id)
  );
  const resultados = await Promise.all(updates);
  const fallo = resultados.find((r) => r.error);
  if (fallo) throw fallo.error;
}
