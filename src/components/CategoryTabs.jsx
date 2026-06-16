import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CategoryTabs({ categorias, activa, setActiva }) {
  const [sticky, setSticky] = useState(false);
  const ref = useRef(null);

  // Sticky visual cuando se pega al top
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setSticky(rect.top <= 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detectar categoría activa por scroll
  useEffect(() => {
    const onScroll = () => {
      const offsets = categorias.map((cat) => {
        const el = document.getElementById(cat.id);
        if (!el) return { id: cat.id, top: Infinity };
        return { id: cat.id, top: Math.abs(el.getBoundingClientRect().top - 140) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) setActiva(offsets[0].id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [categorias, setActiva]);

  const handleClick = (id) => {
    setActiva(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={ref}
      className={[
        'sticky top-16 md:top-20 z-30 transition-all duration-300',
        sticky
          ? 'bg-night-950/85 backdrop-blur-xl border-y border-bronze-700/30 shadow-card'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar px-3 md:px-6 snap-x snap-mandatory">
          {categorias.map((cat) => {
            const isActive = activa === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className={[
                  'relative whitespace-nowrap px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 shrink-0 snap-start',
                  isActive
                    ? 'text-night-950'
                    : 'text-white/70 hover:text-bronze-400',
                ].join(' ')}
              >
                {isActive && (
                  <motion.span
                    layoutId="pill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-bronze-600 via-gold-500 to-bronze-600 shadow-gold"
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <span aria-hidden>{cat.icono}</span>
                  {cat.nombre}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
