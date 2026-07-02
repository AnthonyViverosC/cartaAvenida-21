import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import { useConfig } from '../context/ConfigContext.jsx';

export default function Navbar({ busqueda, setBusqueda }) {
  const { config } = useConfig();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={[
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-night-950/90 backdrop-blur-xl border-b border-bronze-700/30 shadow-card'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-8 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-4">
        <a href="#top" className="flex items-center gap-2 md:gap-3 group min-w-0">
          <div className="relative w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden ring-1 ring-bronze-600/50 shadow-gold shrink-0">
            <img
              src={config.logo_url}
              alt={config.nombre_negocio}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="leading-tight min-w-0">
            <p className="font-display text-base md:text-xl tracking-wide gradient-text truncate">
              {config.nombre_negocio}
            </p>
            <p className="hidden xs:block text-[9px] md:text-xs text-white/55 tracking-[0.2em] uppercase truncate">
              {config.eslogan}
            </p>
          </div>
        </a>

        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar value={busqueda} onChange={setBusqueda} />
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="md:hidden w-10 h-10 grid place-items-center rounded-full border border-white/10 text-white/80 hover:text-bronze-400 hover:border-bronze-500 transition"
            aria-label="Buscar"
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden px-4 pb-3 overflow-hidden"
          >
            <SearchBar value={busqueda} onChange={setBusqueda} autoFocus />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
