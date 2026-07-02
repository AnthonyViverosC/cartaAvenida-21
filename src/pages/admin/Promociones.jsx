// Gestión de Promociones: crear descuentos, combos y productos destacados.
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Percent, Package, Star, Save } from 'lucide-react';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { listarProductos } from '../../services/productos.js';
import {
  listarPromociones,
  crearPromocion,
  actualizarPromocion,
  eliminarPromocion,
  alternarActiva,
  validarPromocion,
} from '../../services/promociones.js';

const TIPOS = [
  { id: 'descuento', nombre: 'Descuento', icono: Percent },
  { id: 'combo', nombre: 'Combo', icono: Package },
  { id: 'destacado', nombre: 'Destacado', icono: Star },
];

const VACIO = {
  titulo: '',
  descripcion: '',
  tipo: 'descuento',
  valor: '',
  producto_id: '',
  imagen_url: '',
  activa: true,
  fecha_inicio: '',
  fecha_fin: '',
};

const input =
  'w-full rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white px-3 py-2.5 transition';

export default function Promociones() {
  const toast = useToast();
  const [promos, setPromos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const [ps, prods] = await Promise.all([listarPromociones(), listarProductos()]);
      setPromos(ps);
      setProductos(prods);
    } catch (e) {
      toast.error('No se pudieron cargar las promociones.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirNuevo() {
    setEditando(null);
    setForm(VACIO);
    setErrores({});
    setModal(true);
  }
  function abrirEditar(p) {
    setEditando(p);
    setForm({
      titulo: p.titulo ?? '',
      descripcion: p.descripcion ?? '',
      tipo: p.tipo ?? 'descuento',
      valor: p.valor ?? '',
      producto_id: p.producto_id ?? '',
      imagen_url: p.imagen_url ?? '',
      activa: p.activa ?? true,
      fecha_inicio: p.fecha_inicio ?? '',
      fecha_fin: p.fecha_fin ?? '',
    });
    setErrores({});
    setModal(true);
  }

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  async function onGuardar(e) {
    e.preventDefault();
    const errs = validarPromocion(form);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    setGuardando(true);
    try {
      if (editando) {
        await actualizarPromocion(editando.id, form);
        toast.exito('Promoción actualizada.');
      } else {
        await crearPromocion(form);
        toast.exito('Promoción creada.');
      }
      setModal(false);
      await cargar();
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  }

  async function onToggle(p) {
    const nueva = !p.activa;
    setPromos((prev) => prev.map((x) => (x.id === p.id ? { ...x, activa: nueva } : x)));
    try {
      await alternarActiva(p.id, nueva);
    } catch (e) {
      toast.error('No se pudo actualizar.');
      setPromos((prev) => prev.map((x) => (x.id === p.id ? { ...x, activa: !nueva } : x)));
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarPromocion(aEliminar.id);
      toast.exito('Promoción eliminada.');
      setPromos((prev) => prev.filter((x) => x.id !== aEliminar.id));
      setAEliminar(null);
    } catch (e) {
      toast.error('No se pudo eliminar.');
    } finally {
      setEliminando(false);
    }
  }

  function etiquetaValor(p) {
    if (p.tipo === 'descuento') return `${p.valor}% OFF`;
    if (p.tipo === 'combo') return `$${Number(p.valor || 0).toLocaleString('es-CO')}.000`;
    return 'Destacado';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl gradient-text">Promociones</h1>
          <p className="text-white/50">{promos.length} promociones · descuentos, combos y destacados.</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950 font-semibold hover:shadow-gold transition"
        >
          <Plus className="h-4 w-4" /> Nueva promoción
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 rounded-full border-2 border-bronze-600/30 border-t-bronze-400 animate-spin" />
        </div>
      ) : promos.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-white/50">
          Aún no hay promociones. Crea la primera con el botón de arriba.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {promos.map((p) => {
            const Icono = TIPOS.find((t) => t.id === p.tipo)?.icono || Percent;
            return (
              <div key={p.id} className={`glass rounded-2xl overflow-hidden ${!p.activa && 'opacity-60'}`}>
                {p.imagen_url && (
                  <div className="h-28 w-full overflow-hidden bg-night-800">
                    <img src={p.imagen_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-display text-lg text-white truncate">{p.titulo}</p>
                      {p.productos?.nombre && <p className="text-xs text-white/45 truncate">{p.productos.nombre}</p>}
                    </div>
                    <span className="shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-bronze-500/15 text-bronze-300">
                      <Icono className="h-3.5 w-3.5" /> {etiquetaValor(p)}
                    </span>
                  </div>
                  {p.descripcion && <p className="text-sm text-white/55 line-clamp-2">{p.descripcion}</p>}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => onToggle(p)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        p.activa ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {p.activa ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {p.activa ? 'Activa' : 'Inactiva'}
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => abrirEditar(p)} className="p-2 rounded-lg hover:bg-white/5 text-white/60">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setAEliminar(p)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal abierto={modal} onClose={() => setModal(false)} titulo={editando ? 'Editar promoción' : 'Nueva promoción'} ancho="max-w-xl">
        <form onSubmit={onGuardar} className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Título *</label>
            <input className={input} value={form.titulo} onChange={(e) => set('titulo', e.target.value)} />
            {errores.titulo && <p className="text-red-400 text-xs mt-1">{errores.titulo}</p>}
          </div>

          <div>
            <label className="text-sm text-white/70">Descripción</label>
            <textarea rows={2} className={input} value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
          </div>

          {/* Tipo */}
          <div>
            <label className="text-sm text-white/70">Tipo</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {TIPOS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => set('tipo', t.id)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition ${
                    form.tipo === t.id
                      ? 'bg-bronze-500/15 border-bronze-500/40 text-bronze-300'
                      : 'border-white/10 text-white/60 hover:border-white/25'
                  }`}
                >
                  <t.icono className="h-4 w-4" /> {t.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Valor (según tipo) */}
            {form.tipo !== 'destacado' && (
              <div>
                <label className="text-sm text-white/70">
                  {form.tipo === 'descuento' ? 'Descuento (%)' : 'Precio combo (miles)'}
                </label>
                <input type="number" min="0" className={input} value={form.valor} onChange={(e) => set('valor', e.target.value)} />
                {errores.valor && <p className="text-red-400 text-xs mt-1">{errores.valor}</p>}
              </div>
            )}
            {/* Producto asociado */}
            <div>
              <label className="text-sm text-white/70">Producto (opcional)</label>
              <select className={input} value={form.producto_id} onChange={(e) => set('producto_id', e.target.value)}>
                <option value="">— Ninguno —</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">Desde</label>
              <input type="date" className={input} value={form.fecha_inicio || ''} onChange={(e) => set('fecha_inicio', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-white/70">Hasta</label>
              <input type="date" className={input} value={form.fecha_fin || ''} onChange={(e) => set('fecha_fin', e.target.value)} />
              {errores.fecha_fin && <p className="text-red-400 text-xs mt-1">{errores.fecha_fin}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70 block mb-1.5">Imagen (opcional)</label>
            <ImageUploader value={form.imagen_url} onChange={(url) => set('imagen_url', url)} carpeta="promociones" />
          </div>

          <label className="flex items-center gap-2 rounded-lg bg-night-800 border border-white/10 px-3 py-2.5 cursor-pointer text-sm w-fit">
            <input type="checkbox" checked={form.activa} onChange={(e) => set('activa', e.target.checked)} className="accent-bronze-500" />
            <span className="text-white/80">Activa</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition">
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
      </Modal>

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        onClose={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
        procesando={eliminando}
        titulo="Eliminar promoción"
        mensaje={`¿Eliminar «${aEliminar?.titulo}»? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
