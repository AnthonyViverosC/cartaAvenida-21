// Diálogo de confirmación para acciones destructivas (eliminar).
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal.jsx';

export default function ConfirmDialog({
  abierto,
  onClose,
  onConfirmar,
  titulo = '¿Estás seguro?',
  mensaje = 'Esta acción no se puede deshacer.',
  textoConfirmar = 'Eliminar',
  procesando = false,
}) {
  return (
    <Modal abierto={abierto} onClose={onClose} titulo={titulo} ancho="max-w-md">
      <div className="flex gap-4">
        <div className="h-11 w-11 shrink-0 rounded-full bg-red-500/15 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <p className="text-white/70 pt-1.5">{mensaje}</p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={procesando}
          className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          disabled={procesando}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:opacity-50 flex items-center gap-2"
        >
          {procesando && (
            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          )}
          {textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}
