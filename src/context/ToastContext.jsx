// Sistema de notificaciones (toasts) para mensajes de éxito y error.
// Uso: const toast = useToast(); toast.exito('Guardado'); toast.error('Ups');
import { createContext, useContext, useCallback, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const quitar = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const agregar = useCallback(
    (tipo, mensaje) => {
      const id = crypto.randomUUID();
      setToasts((t) => [...t, { id, tipo, mensaje }]);
      // Auto-cierre a los 4 segundos.
      setTimeout(() => quitar(id), 4000);
    },
    [quitar]
  );

  const valor = {
    exito: (m) => agregar('exito', m),
    error: (m) => agregar('error', m),
  };

  return (
    <ToastContext.Provider value={valor}>
      {children}
      {/* Contenedor de toasts (esquina inferior derecha) */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-card backdrop-blur border text-sm animate-[fadeIn_.2s_ease] ${
              t.tipo === 'exito'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                : 'bg-red-500/15 border-red-500/30 text-red-200'
            }`}
          >
            {t.tipo === 'exito' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="flex-1">{t.mensaje}</span>
            <button onClick={() => quitar(t.id)} className="text-white/50 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}
