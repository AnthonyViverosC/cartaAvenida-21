// Formulario para crear / editar un producto. Se usa dentro de un Modal.
import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { validarProducto } from '../../services/productos.js';
import ImageUploader from './ImageUploader.jsx';

const VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria_id: '',
  color: '',
  imagen_url: '',
  disponible: true,
  activo: true,
  destacado: false,
  etiquetaIds: [],
};

export default function ProductoForm({ inicial, categorias, etiquetas, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});

  // Carga los datos al abrir (edición) o resetea (creación).
  useEffect(() => {
    if (inicial) {
      setForm({
        nombre: inicial.nombre ?? '',
        descripcion: inicial.descripcion ?? '',
        precio: inicial.precio ?? '',
        categoria_id: inicial.categoria_id ?? '',
        color: inicial.color ?? '',
        imagen_url: inicial.imagen_url ?? '',
        disponible: inicial.disponible ?? true,
        activo: inicial.activo ?? true,
        destacado: inicial.destacado ?? false,
        etiquetaIds: (inicial.producto_etiquetas || []).map((pe) => pe.etiqueta_id),
      });
    } else {
      setForm({ ...VACIO, categoria_id: categorias[0]?.id ?? '' });
    }
    setErrores({});
  }, [inicial, categorias]);

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const toggleEtiqueta = (id) =>
    setForm((f) => ({
      ...f,
      etiquetaIds: f.etiquetaIds.includes(id)
        ? f.etiquetaIds.filter((x) => x !== id)
        : [...f.etiquetaIds, id],
    }));

  function onSubmit(e) {
    e.preventDefault();
    const errs = validarProducto(form);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    onGuardar(form);
  }

  const inputBase =
    'w-full rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white px-3 py-2.5 transition';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="text-sm text-white/70">Nombre *</label>
        <input className={inputBase} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
        {errores.nombre && <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm text-white/70">Descripción</label>
        <textarea
          rows={2}
          className={inputBase}
          value={form.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Precio */}
        <div>
          <label className="text-sm text-white/70">Precio (en miles)</label>
          <input
            type="number"
            min="0"
            step="1"
            className={inputBase}
            value={form.precio}
            onChange={(e) => set('precio', e.target.value)}
            placeholder="Ej: 180 = $180.000"
          />
          {errores.precio && <p className="text-red-400 text-xs mt-1">{errores.precio}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="text-sm text-white/70">Categoría *</label>
          <select
            className={inputBase}
            value={form.categoria_id}
            onChange={(e) => set('categoria_id', e.target.value)}
          >
            <option value="">— Selecciona —</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {errores.categoria_id && <p className="text-red-400 text-xs mt-1">{errores.categoria_id}</p>}
        </div>
      </div>

      {/* Imagen (subida desde el PC, con optimización automática) */}
      <div>
        <label className="text-sm text-white/70">Imagen</label>
        <div className="mt-1.5">
          <ImageUploader value={form.imagen_url} onChange={(url) => set('imagen_url', url)} carpeta="productos" />
        </div>
      </div>

      {/* Color placeholder (se usa cuando el producto no tiene imagen) */}
      <div>
        <label className="text-sm text-white/70">Color (cuando no hay imagen)</label>
        <div className="flex items-center gap-2 mt-1.5">
          <input
            type="color"
            className="h-11 w-12 rounded-lg bg-night-800 border border-white/10 cursor-pointer"
            value={form.color || '#b8854a'}
            onChange={(e) => set('color', e.target.value)}
          />
          <input className={inputBase} value={form.color} onChange={(e) => set('color', e.target.value)} placeholder="#b8854a" />
        </div>
      </div>

      {/* Etiquetas */}
      <div>
        <label className="text-sm text-white/70">Etiquetas</label>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {etiquetas.map((et) => {
            const activa = form.etiquetaIds.includes(et.id);
            return (
              <button
                type="button"
                key={et.id}
                onClick={() => toggleEtiqueta(et.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  activa ? 'text-night-950' : 'text-white/60 border-white/15 hover:border-white/30'
                }`}
                style={activa ? { backgroundColor: et.color, borderColor: et.color } : undefined}
              >
                {et.nombre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interruptores */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          ['disponible', 'Disponible'],
          ['activo', 'Activo'],
          ['destacado', 'Destacado'],
        ].map(([campo, texto]) => (
          <label
            key={campo}
            className="flex items-center gap-2 rounded-lg bg-night-800 border border-white/10 px-3 py-2.5 cursor-pointer text-sm"
          >
            <input type="checkbox" checked={form[campo]} onChange={(e) => set(campo, e.target.checked)} className="accent-bronze-500" />
            <span className="text-white/80">{texto}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950 font-semibold hover:shadow-gold transition disabled:opacity-60"
        >
          {guardando ? (
            <span className="h-4 w-4 rounded-full border-2 border-night-950/40 border-t-night-950 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Guardar
        </button>
      </div>
    </form>
  );
}
