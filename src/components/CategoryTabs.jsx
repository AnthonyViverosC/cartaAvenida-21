import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CategoryTabs({ categorias, activa, setActiva, onSpy }) {
  const [sticky, setSticky] = useState(false);
  const ref = useRef(null);
  const tabsScrollRef = useRef(null);

  // Sticky visual
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

  // Scroll-spy con IntersectionObserver — detecta qué sección está a la vista
  useEffect(() => {
    if (!onSpy) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Encuentra la sección más visible
        const visibles = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibles[0]) {
          onSpy(visibles[0].target.id);
        }
      },
      {
        // El "centro de atención" se ubica ~30% desde la parte superior
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    categorias.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categorias, onSpy]);

  // Auto-scroll de la barra de pestañas para mantener la activa visible (móvil)
  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;
    const btn = container.querySelector(`[data-cat="${activa}"]`);
    if (!btn) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    if (bRect.left < cRect.left || bRect.right > cRect.right) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activa]);

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
        <div
          ref={tabsScrollRef}
          className="flex gap-2 overflow-x-auto hide-scrollbar px-3 md:px-6 scroll-smooth"
        >
          {categorias.map((cat) => {
            const isActive = activa === cat.id;
            return (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={() => setActiva(cat.id)}
                className={[
                  'relative whitespace-nowrap px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-200 shrink-0',
                  isActive
                    ? 'text-night-950'
                    : 'text-white/70 hover:text-bronze-400',
                ].join(' ')}
              >
                {isActive && (
                  <motion.span
                    layoutId="pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
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
