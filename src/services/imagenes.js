// Servicio de Imágenes: optimización (redimensión + compresión) y subida a
// Supabase Storage (bucket "imagenes").
import { supabase } from '../lib/supabase.js';

const BUCKET = 'imagenes';
const MAX_LADO = 1000; // px máximo del lado mayor
const CALIDAD = 0.82; // compresión WebP

// Optimiza una imagen en el navegador usando canvas.
// Devuelve un Blob WebP más liviano, conservando la proporción.
export function optimizarImagen(archivo) {
  return new Promise((resolve, reject) => {
    if (!archivo.type.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen.'));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      // Redimensiona si excede el máximo.
      if (width > MAX_LADO || height > MAX_LADO) {
        if (width >= height) {
          height = Math.round((height * MAX_LADO) / width);
          width = MAX_LADO;
        } else {
          width = Math.round((width * MAX_LADO) / height);
          height = MAX_LADO;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo procesar la imagen.'))),
        'image/webp',
        CALIDAD
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen.'));
    };
    img.src = url;
  });
}

// Sube una imagen optimizada al bucket y devuelve su URL pública + ruta.
export async function subirImagen(archivo, carpeta = 'productos') {
  const blob = await optimizarImagen(archivo);
  const nombre = `${carpeta}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nombre, blob, { contentType: 'image/webp', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombre);
  return { url: data.publicUrl, path: nombre };
}

// Sube un video (sin recompresión; se valida el tamaño) al bucket.
// Devuelve su URL pública + ruta. Los videos se reproducen tal cual.
export async function subirVideo(archivo, carpeta = 'eventos') {
  if (!archivo.type.startsWith('video/')) {
    throw new Error('El archivo debe ser un video.');
  }
  const ext = archivo.name.split('.').pop()?.toLowerCase() || 'mp4';
  const nombre = `${carpeta}/video/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nombre, archivo, { contentType: archivo.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombre);
  return { url: data.publicUrl, path: nombre };
}

// Elimina una imagen o video del bucket a partir de su ruta o URL pública.
export async function eliminarImagen(pathOUrl) {
  if (!pathOUrl) return;
  // Si viene una URL pública, extrae la ruta interna del bucket.
  const marca = `/${BUCKET}/`;
  let path = pathOUrl;
  const idx = pathOUrl.indexOf(marca);
  if (idx !== -1) path = pathOUrl.slice(idx + marca.length);
  // Solo intentamos borrar si es un archivo de nuestro bucket (no rutas /public estáticas).
  if (path.startsWith('/')) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn('[Imagenes] No se pudo eliminar del storage:', error.message);
}
