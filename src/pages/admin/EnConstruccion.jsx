// Página provisional para secciones que se implementan en fases posteriores.
import { Hammer } from 'lucide-react';

export default function EnConstruccion({ titulo }) {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl gradient-text">{titulo}</h1>
      <div className="glass rounded-2xl p-10 text-center">
        <Hammer className="h-10 w-10 mx-auto text-bronze-400 mb-3" />
        <p className="text-white/70">Esta sección estará disponible en la próxima fase.</p>
      </div>
    </div>
  );
}
