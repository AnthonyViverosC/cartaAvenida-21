// Subida de imágenes desde el PC con previsualización.
// Optimiza (redimensiona + comprime) automáticamente antes de subir a Storage.
import { useRef, useState } from 'react';
import { Upload, Trash2, ImageIcon, Loader2 } from 'lucide-react';
import { subirImagen, eliminarImagen } from '../../services/imagenes.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function ImageUploader({ value, onChange, carpeta = 'productos' }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);

  async function onArchivo(e) {
    const archivo = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!archivo) return;

    // Validación de tamaño (máx 8 MB de origen).
    if (archivo.size > 8 * 1024 * 1024) {
      toast.error('La imagen es muy pesada (máx 8 MB).');
      return;
    }

    setSubiendo(true);
    try {
      // Si había una imagen previa subida por nosotros, la reemplazamos (borramos la anterior).
      const anterior = value;
      const { url } = await subirImagen(archivo, carpeta);
      onChange(url);
      await eliminarImagen(anterior); // no borra rutas estáticas /public
      toast.exito('Imagen subida y optimizada.');
    } catch (err) {
      toast.error(err.message || 'No se pudo subir la imagen.');
    } finally {
      setSubiendo(false);
    }
  }

  async function quitar() {
    const anterior = value;
    onChange('');
    await eliminarImagen(anterior);
  }

  return (
    <div className="flex items-center gap-4">
      {/* Previsualización */}
      <div className="h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-night-800 border border-white/10 flex items-center justify-center">
        {value ? (
          <img src={value} alt="Vista previa" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-white/25" />
        )}
      </div>

      {/* Controles */}
      <div className="space-y-2">
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={onArchivo} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-night-700 border border-white/10 hover:border-bronze-500 text-white text-sm transition disabled:opacity-60"
        >
          {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {subiendo ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen'}
        </button>
        {value && !subiendo && (
          <button
            type="button"
            onClick={quitar}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition"
          >
            <Trash2 className="h-4 w-4" /> Quitar
          </button>
        )}
        <p className="text-xs text-white/35">JPG, PNG o WebP. Se optimiza automáticamente.</p>
      </div>
    </div>
  );
}
