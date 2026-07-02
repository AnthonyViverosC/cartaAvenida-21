// Gestión de Eventos: crear, editar, eliminar y activar/desactivar la agenda
// del bar (música en vivo, shows, fechas especiales).
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Calendar, Clock, MapPin, Save } from 'lucide-react';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import VideoUploader from '../../components/admin/VideoUploader.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  listarEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  alternarActivoEvento,
  validarEvento,
} from '../../services/eventos.js';

const VACIO = {
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  lugar: '',
  imagen_url: '',
  video_url: '',
  activo: true,
  destacado: false,
};

const input =
  'w-full rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white px-3 py-2.5 transition';

// Formatea "2026-07-09" → "9 jul 2026".
function fechaLegible(iso) {
  if (!iso) return 'Sin fecha';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Eventos() {
  const toast = useToast();
  const [eventos, setEventos] = useState([]);
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
      setEventos(await listarEventos());
    } catch (e) {
      toast.error('No se pudieron cargar los eventos.');
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
  function abrirEditar(ev) {
    setEditando(ev);
    setForm({
      titulo: ev.titulo ?? '',
      descripcion: ev.descripcion ?? '',
      fecha: ev.fecha ?? '',
      hora: ev.hora ?? '',
      lugar: ev.lugar ?? '',
      imagen_url: ev.imagen_url ?? '',
      video_url: ev.video_url ?? '',
      activo: ev.activo ?? true,
      destacado: ev.destacado ?? false,
    });
    setErrores({});
    setModal(true);
  }

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  async function onGuardar(e) {
    e.preventDefault();
    const errs = validarEvento(form);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    setGuardando(true);
    try {
      if (editando) {
        await actualizarEvento(editando.id, form);
        toast.exito('Evento actualizado.');
      } else {
        await crearEvento(form);
        toast.exito('Evento creado.');
      }
      setModal(false);
      await cargar();
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  }

  async function onToggle(ev) {
    const nuevo = !ev.activo;
    setEventos((prev) => prev.map((x) => (x.id === ev.id ? { ...x, activo: nuevo } : x)));
    try {
      await alternarActivoEvento(ev.id, nuevo);
    } catch (e) {
      toast.error('No se pudo actualizar.');
      setEventos((prev) => prev.map((x) => (x.id === ev.id ? { ...x, activo: !nuevo } : x)));
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarEvento(aEliminar.id);
      toast.exito('Evento eliminado.');
      setEventos((prev) => prev.filter((x) => x.id !== aEliminar.id));
      setAEliminar(null);
    } catch (e) {
      toast.error('No se pudo eliminar.');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl gradient-text">Eventos</h1>
          <p className="text-white/50">{eventos.length} eventos · agenda del bar.</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950 font-semibold hover:shadow-gold transition"
        >
          <Plus className="h-4 w-4" /> Nuevo evento
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 rounded-full border-2 border-bronze-600/30 border-t-bronze-400 animate-spin" />
        </div>
      ) : eventos.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-white/50">
          Aún no hay eventos. Crea el primero con el botón de arriba.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {eventos.map((ev) => (
            <div key={ev.id} className={`glass rounded-2xl overflow-hidden ${!ev.activo && 'opacity-60'}`}>
              {ev.video_url ? (
                <div className="h-32 w-full overflow-hidden bg-night-800">
                  <video src={ev.video_url} className="w-full h-full object-cover" muted playsInline controls />
                </div>
              ) : ev.imagen_url ? (
                <div className="h-28 w-full overflow-hidden bg-night-800">
                  <img src={ev.imagen_url} alt="" className="w-full h-full object-cover" />
                </div>
              ) : null}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-lg text-white leading-tight">
                    {ev.titulo} {ev.destacado && <Star className="inline h-4 w-4 text-gold-400 fill-gold-400" />}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/50">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {fechaLegible(ev.fecha)}</span>
                  {ev.hora && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {ev.hora}</span>}
                  {ev.lugar && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ev.lugar}</span>}
                </div>
                {ev.descripcion && <p className="text-sm text-white/55 line-clamp-2">{ev.descripcion}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => onToggle(ev)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      ev.activo ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-white/50'
                    }`}
                  >
                    {ev.activo ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {ev.activo ? 'Visible' : 'Oculto'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => abrirEditar(ev)} className="p-2 rounded-lg hover:bg-white/5 text-white/60">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setAEliminar(ev)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal abierto={modal} onClose={() => setModal(false)} titulo={editando ? 'Editar evento' : 'Nuevo evento'} ancho="max-w-xl">
        <form onSubmit={onGuardar} className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Título *</label>
            <input className={input} value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Música en vivo · Rock clásico" />
            {errores.titulo && <p className="text-red-400 text-xs mt-1">{errores.titulo}</p>}
          </div>

          <div>
            <label className="text-sm text-white/70">Descripción</label>
            <textarea rows={2} className={input} value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">Fecha</label>
              <input type="date" className={input} value={form.fecha || ''} onChange={(e) => set('fecha', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-white/70">Hora</label>
              <input className={input} value={form.hora} onChange={(e) => set('hora', e.target.value)} placeholder="9:00 PM" />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Lugar</label>
            <input className={input} value={form.lugar} onChange={(e) => set('lugar', e.target.value)} placeholder="Terraza principal" />
          </div>

          <div>
            <label className="text-sm text-white/70 block mb-1.5">Imagen (opcional)</label>
            <ImageUploader value={form.imagen_url} onChange={(url) => set('imagen_url', url)} carpeta="eventos" />
          </div>

          <div>
            <label className="text-sm text-white/70 block mb-1.5">Video (opcional)</label>
            <VideoUploader value={form.video_url} onChange={(url) => set('video_url', url)} carpeta="eventos" />
            <p className="text-xs text-white/35 mt-1">Si agregas video, se mostrará en lugar de la imagen.</p>
          </div>

          <div className="flex gap-2">
            <label className="flex items-center gap-2 rounded-lg bg-night-800 border border-white/10 px-3 py-2.5 cursor-pointer text-sm">
              <input type="checkbox" checked={form.activo} onChange={(e) => set('activo', e.target.checked)} className="accent-bronze-500" />
              <span className="text-white/80">Visible</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg bg-night-800 border border-white/10 px-3 py-2.5 cursor-pointer text-sm">
              <input type="checkbox" checked={form.destacado} onChange={(e) => set('destacado', e.target.checked)} className="accent-bronze-500" />
              <span className="text-white/80">Destacado</span>
            </label>
          </div>

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
        titulo="Eliminar evento"
        mensaje={`¿Eliminar «${aEliminar?.titulo}»? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
