import { useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import MenuSection from './components/MenuSection.jsx';
import Footer from './components/Footer.jsx';
import InstagramButton from './components/InstagramButton.jsx';
import ReservationButton from './components/ReservationButton.jsx';
import BackToTopButton from './components/BackToTopButton.jsx';
import { categorias, productos } from './data/menu.js';

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0].id);

  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
    );
  }, [busqueda]);

  const categoriasConProductos = useMemo(() => {
    if (!busqueda.trim()) return categorias;
    const conResultados = new Set(productosFiltrados.map((p) => p.categoria));
    return categorias.filter((c) => conResultados.has(c.id));
  }, [busqueda, productosFiltrados]);

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

      <div id="menu-anchor" />

      <CategoryTabs
        categorias={categoriasConProductos}
        activa={categoriaActiva}
        setActiva={irACategoria}
        onSpy={setCategoriaActiva}
      />

      <main className="flex-1">
        {categoriasConProductos.length === 0 ? (
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
      <BackToTopButton />
      <ReservationButton />
      <InstagramButton />
    </div>
  );
}
