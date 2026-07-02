// Subida de videos desde el PC con previsualización.
// No recomprime (los navegadores no lo hacen bien); valida el tamaño.
import { useRef, useState } from 'react';
import { Upload, Trash2, Film, Loader2 } from 'lucide-react';
import { subirVideo, eliminarImagen } from '../../services/imagenes.js';
import { useToast } from '../../context/ToastContext.jsx';

const MAX_MB = 50; // límite de tamaño para un video

export default function VideoUploader({ value, onChange, carpeta = 'eventos' }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);

  async function onArchivo(e) {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;

    if (archivo.size > MAX_MB * 1024 * 1024) {
      toast.error(`El video es muy pesado (máx ${MAX_MB} MB). Recórtalo o baja su calidad.`);
      return;
    }

    setSubiendo(true);
    try {
      const anterior = value;
      const { url } = await subirVideo(archivo, carpeta);
      onChange(url);
      await eliminarImagen(anterior); // borra el anterior si era nuestro
      toast.exito('Video subido.');
    } catch (err) {
      toast.error(err.message || 'No se pudo subir el video.');
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
      <div className="h-24 w-40 shrink-0 rounded-xl overflow-hidden bg-night-800 border border-white/10 flex items-center justify-center">
        {value ? (
          <video src={value} className="h-full w-full object-cover" muted playsInline controls />
        ) : (
          <Film className="h-8 w-8 text-white/25" />
        )}
      </div>

      <div className="space-y-2">
        <input ref={inputRef} type="file" accept="video/*" hidden onChange={onArchivo} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-night-700 border border-white/10 hover:border-bronze-500 text-white text-sm transition disabled:opacity-60"
        >
          {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {subiendo ? 'Subiendo…' : value ? 'Cambiar video' : 'Subir video'}
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
        <p className="text-xs text-white/35">MP4 o WebM. Máx {MAX_MB} MB.</p>
      </div>
    </div>
  );
}
