// Servicio de Promociones: CRUD contra Supabase.
import { supabase } from '../lib/supabase.js';

const SELECT = `
  id, titulo, descripcion, tipo, valor, producto_id, imagen_url,
  activa, fecha_inicio, fecha_fin, creado_en,
  productos ( nombre )
`;

export async function listarPromociones() {
  const { data, error } = await supabase
    .from('promociones')
    .select(SELECT)
    .order('creado_en', { ascending: false });
  if (error) throw error;
  return data;
}

// Valida el formulario de promoción. Devuelve {campo: mensaje}.
export function validarPromocion(f) {
  const errores = {};
  if (!f.titulo?.trim()) errores.titulo = 'El título es obligatorio.';
  if (!['descuento', 'combo', 'destacado'].includes(f.tipo)) errores.tipo = 'Tipo inválido.';
  if (f.tipo === 'descuento') {
    const v = Number(f.valor);
    if (!v || v <= 0 || v > 100) errores.valor = 'El descuento debe estar entre 1 y 100 %.';
  }
  if (f.tipo === 'combo' && (f.valor === '' || Number(f.valor) < 0)) {
    errores.valor = 'Indica el precio del combo.';
  }
  if (f.fecha_inicio && f.fecha_fin && f.fecha_fin < f.fecha_inicio) {
    errores.fecha_fin = 'La fecha fin no puede ser anterior al inicio.';
  }
  return errores;
}

function preparar(f) {
  return {
    titulo: f.titulo.trim(),
    descripcion: f.descripcion?.trim() || null,
    tipo: f.tipo,
    valor: f.valor === '' || f.valor == null ? null : Number(f.valor),
    producto_id: f.producto_id || null,
    imagen_url: f.imagen_url?.trim() || null,
    activa: Boolean(f.activa),
    fecha_inicio: f.fecha_inicio || null,
    fecha_fin: f.fecha_fin || null,
  };
}

export async function crearPromocion(form) {
  const { data, error } = await supabase.from('promociones').insert(preparar(form)).select('id').single();
  if (error) throw error;
  return data;
}

export async function actualizarPromocion(id, form) {
  const { error } = await supabase.from('promociones').update(preparar(form)).eq('id', id);
  if (error) throw error;
}

export async function eliminarPromocion(id) {
  const { error } = await supabase.from('promociones').delete().eq('id', id);
  if (error) throw error;
}

export async function alternarActiva(id, activa) {
  const { error } = await supabase.from('promociones').update({ activa }).eq('id', id);
  if (error) throw error;
}
