// Hook que carga el menú (categorías + productos) desde Supabase.
// Mapea los datos de la BD a la MISMA forma que ya esperan los componentes,
// así el diseño no cambia. Si el backend aún no está configurado, cae de forma
// elegante a los datos estáticos de src/data/menu.js.
import { useEffect, useState } from 'react';
import { supabase, supabaseConfigurado } from '../lib/supabase.js';
import {
  categorias as categoriasEstaticas,
  productos as productosEstaticos,
} from '../data/menu.js';

// Convierte una fila de producto de la BD a la forma que usa <ProductCard/>.
function mapProducto(p, slugPorId) {
  return {
    id: p.id,
    categoria: slugPorId[p.categoria_id], // los componentes agrupan por slug
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio != null ? Number(p.precio) : null,
    color: p.color,
    imagen: p.imagen_url,
    disponible: p.disponible,
    destacado: p.destacado,
    etiquetas: (p.producto_etiquetas || []).map((pe) => pe.etiquetas).filter(Boolean),
  };
}

export function useMenu() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      // Sin backend configurado → usar datos estáticos (modo demo).
      if (!supabaseConfigurado) {
        setCategorias(categoriasEstaticas);
        setProductos(productosEstaticos);
        setCargando(false);
        return;
      }

      try {
        // Solo categorías visibles, ordenadas.
        const { data: cats, error: eCats } = await supabase
          .from('categorias')
          .select('id, slug, nombre, icono, orden')
          .eq('visible', true)
          .order('orden', { ascending: true });
        if (eCats) throw eCats;

        // Solo productos activos, ordenados.
        const { data: prods, error: eProds } = await supabase
          .from('productos')
          .select(
            'id, categoria_id, nombre, descripcion, precio, color, imagen_url, disponible, destacado, orden, producto_etiquetas(etiquetas(nombre, color))'
          )
          .eq('activo', true)
          .order('orden', { ascending: true });
        if (eProds) throw eProds;

        if (!activo) return;

        const slugPorId = Object.fromEntries((cats || []).map((c) => [c.id, c.slug]));
        setCategorias((cats || []).map((c) => ({ id: c.slug, nombre: c.nombre, icono: c.icono || '' })));
        setProductos((prods || []).map((p) => mapProducto(p, slugPorId)));
        setError(null);
      } catch (e) {
        console.error('[useMenu] Error cargando el menú:', e);
        if (!activo) return;
        // Fallback a datos estáticos si algo falla, para no dejar la web vacía.
        setCategorias(categoriasEstaticas);
        setProductos(productosEstaticos);
        setError(e.message || 'No se pudo cargar el menú');
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, []);

  return { categorias, productos, cargando, error };
}
