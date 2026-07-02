// Modal reutilizable con overlay. Cierra con Escape o clic fuera.
import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ abierto, onClose, titulo, children, ancho = 'max-w-lg' }) {
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    // Evita scroll del fondo mientras el modal está abierto.
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${ancho} glass rounded-2xl shadow-card my-8`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-display text-xl text-white">{titulo}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
