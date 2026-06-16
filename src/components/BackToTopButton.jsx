import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const subir = () => {
    const ancla = document.getElementById('menu-anchor');
    if (ancla) {
      const top = ancla.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={subir}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Volver arriba"
          className="fixed bottom-44 right-4 md:bottom-48 md:right-8 z-50
                     w-12 h-12 md:w-14 md:h-14 grid place-items-center rounded-full
                     bg-gradient-to-br from-bronze-600 via-gold-500 to-bronze-600 text-night-950
                     shadow-gold ring-1 ring-white/20
                     hover:shadow-[0_15px_35px_-10px_rgba(230,182,86,0.8)]
                     transition-shadow"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
