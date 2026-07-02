// Servicio de Productos: CRUD + etiquetas + orden, contra Supabase.
import { supabase } from '../lib/supabase.js';

// Selección estándar de un producto con su categoría y etiquetas.
const SELECT = `
  id, categoria_id, nombre, descripcion, precio, color, imagen_url,
  disponible, activo, destacado, orden, creado_en,
  categorias ( slug, nombre ),
  producto_etiquetas ( etiqueta_id, etiquetas ( id, nombre, color ) )
`;

// Lista TODOS los productos (activos e inactivos) para el panel.
export async function listarProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select(SELECT)
    .order('orden', { ascending: true });
  if (error) throw error;
  return data;
}

// Valida los campos del formulario. Devuelve un objeto {campo: mensaje}.
export function validarProducto(f) {
  const errores = {};
  if (!f.nombre?.trim()) errores.nombre = 'El nombre es obligatorio.';
  if (!f.categoria_id) errores.categoria_id = 'Elige una categoría.';
  if (f.precio !== '' && f.precio != null && Number(f.precio) < 0) {
    errores.precio = 'El precio no puede ser negativo.';
  }
  return errores;
}

// Normaliza los datos del formulario antes de guardar.
function prepararDatos(f) {
  return {
    nombre: f.nombre.trim(),
    descripcion: f.descripcion?.trim() || null,
    precio: f.precio === '' || f.precio == null ? null : Number(f.precio),
    categoria_id: f.categoria_id,
    color: f.color?.trim() || null,
    imagen_url: f.imagen_url?.trim() || null,
    disponible: Boolean(f.disponible),
    activo: Boolean(f.activo),
    destacado: Boolean(f.destacado),
  };
}

export async function crearProducto(form) {
  const datos = prepararDatos(form);
  // Coloca el nuevo al final de su categoría.
  const { count } = await supabase
    .from('productos')
    .select('id', { count: 'exact', head: true })
    .eq('categoria_id', datos.categoria_id);
  const { data, error } = await supabase
    .from('productos')
    .insert({ ...datos, orden: count ?? 0 })
    .select('id')
    .single();
  if (error) throw error;
  await sincronizarEtiquetas(data.id, form.etiquetaIds || []);
  return data;
}

export async function actualizarProducto(id, form) {
  const datos = prepararDatos(form);
  const { error } = await supabase.from('productos').update(datos).eq('id', id);
  if (error) throw error;
  await sincronizarEtiquetas(id, form.etiquetaIds || []);
}

export async function eliminarProducto(id) {
  const { error } = await supabase.from('productos').delete().eq('id', id);
  if (error) throw error;
}

// Cambia un booleano (activo / disponible / destacado) rápidamente.
export async function alternarCampo(id, campo, valor) {
  const { error } = await supabase.from('productos').update({ [campo]: valor }).eq('id', id);
  if (error) throw error;
}

// Reemplaza el conjunto de etiquetas de un producto.
async function sincronizarEtiquetas(productoId, etiquetaIds) {
  // Borra las actuales y vuelve a insertar (sencillo y seguro).
  const { error: eDel } = await supabase
    .from('producto_etiquetas')
    .delete()
    .eq('producto_id', productoId);
  if (eDel) throw eDel;
  if (!etiquetaIds.length) return;
  const filas = etiquetaIds.map((etiqueta_id) => ({ producto_id: productoId, etiqueta_id }));
  const { error: eIns } = await supabase.from('producto_etiquetas').insert(filas);
  if (eIns) throw eIns;
}

// Guarda el nuevo orden tras drag & drop (dentro de una categoría).
export async function reordenarProductos(idsOrdenados) {
  const updates = idsOrdenados.map((id, orden) =>
    supabase.from('productos').update({ orden }).eq('id', id)
  );
  const resultados = await Promise.all(updates);
  const fallo = resultados.find((r) => r.error);
  if (fallo) throw fallo.error;
}

// Lista de etiquetas disponibles.
export async function listarEtiquetas() {
  const { data, error } = await supabase.from('etiquetas').select('*').order('nombre');
  if (error) throw error;
  return data;
}
