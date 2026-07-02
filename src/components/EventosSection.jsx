// Sección pública de eventos (agenda) del bar. Se muestra sobre el menú.
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Music } from 'lucide-react';
import { useEventos } from '../hooks/useEventos.js';

function fechaLegible(iso) {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function EventosSection() {
  const eventos = useEventos();
  if (!eventos.length) return null;

  return (
    <section id="eventos" className="scroll-mt-32 max-w-7xl mx-auto px-3 md:px-8 py-10 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-3">
          <Music size={14} className="text-bronze-400" />
          <span className="text-xs tracking-[0.3em] text-white/90 uppercase">Agenda</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl gradient-text">Próximos eventos</h2>
        <div className="mx-auto mt-3 md:mt-4 w-24 md:w-32 h-px bg-gold-line" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventos.map((ev, i) => (
          <motion.article
            key={ev.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`group relative rounded-2xl overflow-hidden glass shadow-card transition-colors ${
              ev.destacado ? 'border-bronze-500/50' : 'hover:border-bronze-600/40'
            }`}
          >
            {ev.video_url ? (
              // Video responsive: se ve bien en PC y celular (controles nativos).
              <div className="relative aspect-video overflow-hidden bg-black">
                <video
                  src={ev.video_url}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster={ev.imagen_url || undefined}
                />
              </div>
            ) : ev.imagen_url ? (
              <div className="relative aspect-video overflow-hidden bg-night-800">
                <img src={ev.imagen_url} alt={ev.titulo} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-night-900 to-transparent" />
              </div>
            ) : null}
            <div className="p-5">
              <h3 className="font-display text-xl text-white leading-tight mb-2">{ev.titulo}</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-bronze-400 mb-2">
                {ev.fecha && <span className="flex items-center gap-1 capitalize"><Calendar className="h-3.5 w-3.5" /> {fechaLegible(ev.fecha)}</span>}
                {ev.hora && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {ev.hora}</span>}
                {ev.lugar && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ev.lugar}</span>}
              </div>
              {ev.descripcion && <p className="text-sm text-white/60 leading-relaxed">{ev.descripcion}</p>}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
