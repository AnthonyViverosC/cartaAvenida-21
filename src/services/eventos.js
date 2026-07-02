// Servicio de Eventos: CRUD contra Supabase.
import { supabase } from '../lib/supabase.js';

export async function listarEventos() {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .order('fecha', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data;
}

export function validarEvento(f) {
  const errores = {};
  if (!f.titulo?.trim()) errores.titulo = 'El título es obligatorio.';
  return errores;
}

function preparar(f) {
  return {
    titulo: f.titulo.trim(),
    descripcion: f.descripcion?.trim() || null,
    fecha: f.fecha || null,
    hora: f.hora?.trim() || null,
    lugar: f.lugar?.trim() || null,
    imagen_url: f.imagen_url?.trim() || null,
    video_url: f.video_url?.trim() || null,
    activo: Boolean(f.activo),
    destacado: Boolean(f.destacado),
  };
}

export async function crearEvento(form) {
  const { data, error } = await supabase.from('eventos').insert(preparar(form)).select('id').single();
  if (error) throw error;
  return data;
}

export async function actualizarEvento(id, form) {
  const { error } = await supabase.from('eventos').update(preparar(form)).eq('id', id);
  if (error) throw error;
}

export async function eliminarEvento(id) {
  const { error } = await supabase.from('eventos').delete().eq('id', id);
  if (error) throw error;
}

export async function alternarActivoEvento(id, activo) {
  const { error } = await supabase.from('eventos').update({ activo }).eq('id', id);
  if (error) throw error;
}
