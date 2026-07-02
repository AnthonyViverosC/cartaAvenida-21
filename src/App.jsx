import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import MenuSection from './components/MenuSection.jsx';
import PromoSection from './components/PromoSection.jsx';
import EventosSection from './components/EventosSection.jsx';
import Footer from './components/Footer.jsx';
import InstagramButton from './components/InstagramButton.jsx';
import ReservationButton from './components/ReservationButton.jsx';
import { useMenu } from './hooks/useMenu.js';

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  // El menú ahora se carga dinámicamente desde la base de datos.
  const { categorias, productos, cargando } = useMenu();
  const [categoriaActiva, setCategoriaActiva] = useState('');

  // Fija la primera categoría como activa cuando llegan los datos.
  useEffect(() => {
    if (categorias.length && !categoriaActiva) {
      setCategoriaActiva(categorias[0].id);
    }
  }, [categorias, categoriaActiva]);

  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
    );
  }, [busqueda, productos]);

  const categoriasConProductos = useMemo(() => {
    if (!busqueda.trim()) return categorias;
    const conResultados = new Set(productosFiltrados.map((p) => p.categoria));
    return categorias.filter((c) => conResultados.has(c.id));
  }, [busqueda, productosFiltrados, categorias]);

  // Click en pestaña → scroll suave a la sección
  const irACategoria = (id) => {
    setCategoriaActiva(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar busqueda={busqueda} setBusqueda={setBusqueda} />
      <Hero />

      {/* Promociones activas (si las hay) */}
      <PromoSection />

      {/* Próximos eventos (si los hay) */}
      <EventosSection />

      <div id="menu-anchor" />

      <CategoryTabs
        categorias={categoriasConProductos}
        activa={categoriaActiva}
        setActiva={irACategoria}
        onSpy={setCategoriaActiva}
      />

      <main className="flex-1">
        {cargando ? (
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-bronze-600/30 border-t-bronze-400 animate-spin" />
            <p className="text-white/60">Cargando la carta…</p>
          </div>
        ) : categoriasConProductos.length === 0 ? (
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <p className="text-2xl font-display text-bronze-400 mb-3">
              Sin coincidencias
            </p>
            <p className="text-white/60">
              No encontramos nada con «{busqueda}». Prueba con otra palabra.
            </p>
          </div>
        ) : (
          categoriasConProductos.map((cat) => (
            <MenuSection
              key={cat.id}
              categoria={cat}
              productos={productosFiltrados.filter((p) => p.categoria === cat.id)}
            />
          ))
        )}
      </main>

      <Footer />
      <ReservationButton />
      <InstagramButton />
    </div>
  );
}
