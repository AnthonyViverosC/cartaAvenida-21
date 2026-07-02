// Gestión de Categorías: crear, editar, eliminar, mostrar/ocultar y reordenar
// mediante drag & drop.
import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  reordenarCategorias,
} from '../../services/categorias.js';
import { supabase } from '../../lib/supabase.js';

function FilaCategoria({ cat, conteo, onEditar, onEliminar, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="glass rounded-xl p-3 flex items-center gap-3">
      <button {...attributes} {...listeners} className="cursor-grab text-white/30 hover:text-white/60 touch-none">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${cat.visible ? 'text-white' : 'text-white/40'}`}>{cat.nombre}</p>
        <p className="text-xs text-white/40">
          {conteo ?? 0} productos · <span className="font-mono">{cat.slug}</span>
        </p>
      </div>
      <button
        onClick={() => onToggle(cat, !cat.visible)}
        title={cat.visible ? 'Visible en el menú' : 'Oculta'}
        className={`p-2 rounded-lg hover:bg-white/5 ${cat.visible ? 'text-emerald-300' : 'text-white/40'}`}
      >
        {cat.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
      <button onClick={() => onEditar(cat)} className="p-2 rounded-lg hover:bg-white/5 text-white/60">
        <Pencil className="h-4 w-4" />
      </button>
      <button onClick={() => onEliminar(cat)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Categorias() {
  const toast = useToast();
  const [categorias, setCategorias] = useState([]);
  const [conteos, setConteos] = useState({});
  const [cargando, setCargando] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function cargar() {
    setCargando(true);
    try {
      const cats = await listarCategorias();
      setCategorias(cats);
      // Conteo de productos por categoría.
      const { data } = await supabase.from('productos').select('categoria_id');
      const mapa = {};
      (data || []).forEach((p) => {
        mapa[p.categoria_id] = (mapa[p.categoria_id] || 0) + 1;
      });
      setConteos(mapa);
    } catch (e) {
      toast.error('No se pudieron cargar las categorías.');
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
    setNombre('');
    setIcono('');
    setModalAbierto(true);
  }
  function abrirEditar(c) {
    setEditando(c);
    setNombre(c.nombre);
    setIcono(c.icono || '');
    setModalAbierto(true);
  }

  async function onGuardar(e) {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio.');
      return;
    }
    setGuardando(true);
    try {
      if (editando) {
        await actualizarCategoria(editando.id, { nombre: nombre.trim(), icono });
        toast.exito('Categoría actualizada.');
      } else {
        await crearCategoria({ nombre, icono });
        toast.exito('Categoría creada.');
      }
      setModalAbierto(false);
      await cargar();
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  }

  async function onToggle(cat, visible) {
    setCategorias((prev) => prev.map((c) => (c.id === cat.id ? { ...c, visible } : c)));
    try {
      await actualizarCategoria(cat.id, { visible });
    } catch (e) {
      toast.error('No se pudo actualizar.');
      setCategorias((prev) => prev.map((c) => (c.id === cat.id ? { ...c, visible: !visible } : c)));
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarCategoria(aEliminar.id);
      toast.exito('Categoría eliminada.');
      setCategorias((prev) => prev.filter((c) => c.id !== aEliminar.id));
      setAEliminar(null);
    } catch (e) {
      toast.error('No se pudo eliminar.');
    } finally {
      setEliminando(false);
    }
  }

  async function onDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const desde = categorias.findIndex((c) => c.id === active.id);
    const hasta = categorias.findIndex((c) => c.id === over.id);
    const nuevo = arrayMove(categorias, desde, hasta);
    setCategorias(nuevo);
    try {
      await reordenarCategorias(nuevo.map((c) => c.id));
      toast.exito('Orden guardado.');
    } catch (e) {
      toast.error('No se pudo guardar el orden.');
      cargar();
    }
  }

  const inputBase =
    'w-full rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white px-3 py-2.5 transition';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl gradient-text">Categorías</h1>
          <p className="text-white/50">Arrastra para cambiar el orden en el menú.</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950 font-semibold hover:shadow-gold transition"
        >
          <Plus className="h-4 w-4" /> Nueva categoría
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 rounded-full border-2 border-bronze-600/30 border-t-bronze-400 animate-spin" />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={categorias.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {categorias.map((c) => (
                <FilaCategoria
                  key={c.id}
                  cat={c}
                  conteo={conteos[c.id]}
                  onEditar={abrirEditar}
                  onEliminar={setAEliminar}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal crear/editar */}
      <Modal abierto={modalAbierto} onClose={() => setModalAbierto(false)} titulo={editando ? 'Editar categoría' : 'Nueva categoría'}>
        <form onSubmit={onGuardar} className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Nombre *</label>
            <input className={inputBase} value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="text-sm text-white/70">Icono (emoji, opcional)</label>
            <input className={inputBase} value={icono} onChange={(e) => setIcono(e.target.value)} placeholder="🍸" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalAbierto(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition">
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
        titulo="Eliminar categoría"
        mensaje={`¿Eliminar «${aEliminar?.nombre}»? Se eliminarán también sus ${conteos[aEliminar?.id] || 0} productos. Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
