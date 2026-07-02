// Sección pública de promociones activas. Se muestra sobre el menú.
import { motion } from 'framer-motion';
import { Percent, Package, Star, Sparkles } from 'lucide-react';
import { usePromociones } from '../hooks/usePromociones.js';

const ICONO = { descuento: Percent, combo: Package, destacado: Star };

function valorTexto(p) {
  if (p.tipo === 'descuento') return `${p.valor}% OFF`;
  if (p.tipo === 'combo') return `$${Number(p.valor || 0).toLocaleString('es-CO')}.000`;
  return 'Destacado';
}

export default function PromoSection() {
  const promociones = usePromociones();
  if (!promociones.length) return null;

  return (
    <section id="promociones" className="scroll-mt-32 max-w-7xl mx-auto px-3 md:px-8 py-10 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-3">
          <Sparkles size={14} className="text-bronze-400" />
          <span className="text-xs tracking-[0.3em] text-white/90 uppercase">Ofertas del momento</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl gradient-text">Promociones</h2>
        <div className="mx-auto mt-3 md:mt-4 w-24 md:w-32 h-px bg-gold-line" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promociones.map((p, i) => {
          const Icono = ICONO[p.tipo] || Percent;
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-2xl overflow-hidden glass hover:border-bronze-600/40 transition-colors shadow-card"
            >
              {p.imagen_url && (
                <div className="relative aspect-[16/9] overflow-hidden bg-night-800">
                  <img src={p.imagen_url} alt={p.titulo} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-night-900 to-transparent" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-xl text-white leading-tight">{p.titulo}</h3>
                  <span className="shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-bronze-500 to-gold-500 text-night-950">
                    <Icono className="h-3.5 w-3.5" /> {valorTexto(p)}
                  </span>
                </div>
                {p.productos?.nombre && <p className="text-xs text-bronze-400 mb-1">{p.productos.nombre}</p>}
                {p.descripcion && <p className="text-sm text-white/60 leading-relaxed">{p.descripcion}</p>}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
