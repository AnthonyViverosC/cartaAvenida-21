// Gestión de Productos: CRUD completo, activar/desactivar, disponibilidad,
// destacar, etiquetas y reordenamiento por drag & drop (dentro de cada categoría).
import { useEffect, useMemo, useState } from 'react';
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
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  GripVertical,
  Star,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ProductoForm from '../../components/admin/ProductoForm.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { formatearPrecio } from '../../data/menu.js';
import { listarCategorias } from '../../services/categorias.js';
import {
  listarProductos,
  listarEtiquetas,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  alternarCampo,
  reordenarProductos,
} from '../../services/productos.js';

// ── Fila individual (ordenable) ───────────────────────────────
function FilaProducto({ producto, onEditar, onEliminar, onToggle, arrastrable }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: producto.id,
    disabled: !arrastrable,
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-xl p-3 flex items-center gap-3"
    >
      {/* Handle de arrastre */}
      {arrastrable && (
        <button {...attributes} {...listeners} className="cursor-grab text-white/30 hover:text-white/60 touch-none">
          <GripVertical className="h-5 w-5" />
        </button>
      )}

      {/* Miniatura */}
      <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-night-800 flex items-center justify-center">
        {producto.imagen_url ? (
          <img src={producto.imagen_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ backgroundColor: producto.color || '#333' }} />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-medium truncate ${producto.activo ? 'text-white' : 'text-white/40 line-through'}`}>
            {producto.nombre}
          </p>
          {producto.destacado && <Star className="h-3.5 w-3.5 text-gold-400 fill-gold-400" />}
          {(producto.producto_etiquetas || []).map((pe) => (
            <span
              key={pe.etiqueta_id}
              className="text-[10px] px-1.5 py-0.5 rounded-full text-night-950 font-semibold"
              style={{ backgroundColor: pe.etiquetas?.color }}
            >
              {pe.etiquetas?.nombre}
            </span>
          ))}
        </div>
        <p className="text-xs text-white/40 truncate">
          {producto.categorias?.nombre} · {formatearPrecio(Number(producto.precio))}
        </p>
      </div>

      {/* Estado disponibilidad */}
      <button
        onClick={() => onToggle(producto, 'disponible', !producto.disponible)}
        title={producto.disponible ? 'Disponible' : 'Agotado'}
        className={`hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          producto.disponible ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
        }`}
      >
        {producto.disponible ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
        {producto.disponible ? 'Disponible' : 'Agotado'}
      </button>

      {/* Acciones */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggle(producto, 'destacado', !producto.destacado)}
          title="Destacar"
          className={`p-2 rounded-lg hover:bg-white/5 ${producto.destacado ? 'text-gold-400' : 'text-white/40'}`}
        >
          <Star className="h-4 w-4" />
        </button>
        <button
          onClick={() => onToggle(producto, 'activo', !producto.activo)}
          title={producto.activo ? 'Desactivar (ocultar del menú)' : 'Activar'}
          className={`p-2 rounded-lg hover:bg-white/5 ${producto.activo ? 'text-emerald-300' : 'text-white/40'}`}
        >
          {producto.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <button onClick={() => onEditar(producto)} title="Editar" className="p-2 rounded-lg hover:bg-white/5 text-white/60">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => onEliminar(producto)} title="Eliminar" className="p-2 rounded-lg hover:bg-red-500/10 text-red-400">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────
export default function Productos() {
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [catFiltro, setCatFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function cargar() {
    setCargando(true);
    try {
      const [prods, cats, etqs] = await Promise.all([
        listarProductos(),
        listarCategorias(),
        listarEtiquetas(),
      ]);
      setProductos(prods);
      setCategorias(cats);
      setEtiquetas(etqs);
    } catch (e) {
      toast.error('No se pudieron cargar los productos.');
      console.error(e);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Solo se puede arrastrar cuando NO hay búsqueda y hay una categoría concreta.
  const arrastrable = catFiltro !== 'todas' && !busqueda.trim();

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return productos
      .filter((p) => (catFiltro === 'todas' ? true : p.categoria_id === catFiltro))
      .filter((p) => (q ? p.nombre.toLowerCase().includes(q) : true));
  }, [productos, catFiltro, busqueda]);

  // ── Handlers ──────────────────────────────────────────────
  function abrirNuevo() {
    setEditando(null);
    setModalAbierto(true);
  }
  function abrirEditar(p) {
    setEditando(p);
    setModalAbierto(true);
  }

  async function onGuardar(form) {
    setGuardando(true);
    try {
      if (editando) {
        await actualizarProducto(editando.id, form);
        toast.exito('Producto actualizado.');
      } else {
        await crearProducto(form);
        toast.exito('Producto creado.');
      }
      setModalAbierto(false);
      await cargar();
    } catch (e) {
      toast.error(e.message || 'No se pudo guardar el producto.');
      console.error(e);
    } finally {
      setGuardando(false);
    }
  }

  async function onToggle(producto, campo, valor) {
    // Actualización optimista para respuesta inmediata.
    setProductos((prev) => prev.map((p) => (p.id === producto.id ? { ...p, [campo]: valor } : p)));
    try {
      await alternarCampo(producto.id, campo, valor);
    } catch (e) {
      toast.error('No se pudo actualizar. Revirtiendo.');
      setProductos((prev) => prev.map((p) => (p.id === producto.id ? { ...p, [campo]: !valor } : p)));
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarProducto(aEliminar.id);
      toast.exito('Producto eliminado.');
      setProductos((prev) => prev.filter((p) => p.id !== aEliminar.id));
      setAEliminar(null);
    } catch (e) {
      toast.error('No se pudo eliminar.');
    } finally {
      setEliminando(false);
    }
  }

  async function onDragEnd(evento) {
    const { active, over } = evento;
    if (!over || active.id === over.id) return;
    const ids = visibles.map((p) => p.id);
    const desde = ids.indexOf(active.id);
    const hasta = ids.indexOf(over.id);
    const nuevoOrden = arrayMove(visibles, desde, hasta);

    // Refleja el nuevo orden en el estado global.
    const idsNuevos = nuevoOrden.map((p) => p.id);
    setProductos((prev) => {
      const otros = prev.filter((p) => !idsNuevos.includes(p.id));
      return [...nuevoOrden, ...otros];
    });
    try {
      await reordenarProductos(idsNuevos);
      toast.exito('Orden guardado.');
    } catch (e) {
      toast.error('No se pudo guardar el orden.');
      cargar();
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl gradient-text">Productos</h1>
          <p className="text-white/50">{productos.length} productos en total.</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950 font-semibold hover:shadow-gold transition"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white pl-10 pr-3 py-2.5 transition"
          />
        </div>
        <select
          value={catFiltro}
          onChange={(e) => setCatFiltro(e.target.value)}
          className="rounded-lg bg-night-800 border border-white/10 focus:border-bronze-500 outline-none text-white px-3 py-2.5"
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {arrastrable && (
        <p className="text-xs text-white/40">💡 Arrastra desde el ícono ⋮⋮ para reordenar los productos de esta categoría.</p>
      )}

      {/* Lista */}
      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 rounded-full border-2 border-bronze-600/30 border-t-bronze-400 animate-spin" />
        </div>
      ) : visibles.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-white/50">No hay productos que coincidan.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={visibles.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {visibles.map((p) => (
                <FilaProducto
                  key={p.id}
                  producto={p}
                  arrastrable={arrastrable}
                  onEditar={abrirEditar}
                  onEliminar={setAEliminar}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal formulario */}
      <Modal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        titulo={editando ? 'Editar producto' : 'Nuevo producto'}
        ancho="max-w-2xl"
      >
        <ProductoForm
          inicial={editando}
          categorias={categorias}
          etiquetas={etiquetas}
          guardando={guardando}
          onGuardar={onGuardar}
          onCancelar={() => setModalAbierto(false)}
        />
      </Modal>

      {/* Confirmación de borrado */}
      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        onClose={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
        procesando={eliminando}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que deseas eliminar «${aEliminar?.nombre}»? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
