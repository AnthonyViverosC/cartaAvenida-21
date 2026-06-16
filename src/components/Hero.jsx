import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, MessageCircle } from 'lucide-react';
import { whatsappLink } from './ReservationButton.jsx';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-16 md:pt-20 md:pb-20"
    >
      {/* Imagen de portada — ambiente de bar */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(/cocteles/Polvo%20de%20media%20noche.jpeg)',
            filter: 'brightness(0.35) saturate(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/70 via-night-950/55 to-night-950" />
        <div className="absolute inset-0 bg-radial-spot" />
      </div>

      {/* Luces neon flotantes */}
      <motion.div
        className="absolute top-1/4 left-10 w-72 h-72 rounded-full blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle, #9d4dff, transparent 70%)' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full blur-3xl opacity-35"
        style={{ background: 'radial-gradient(circle, #e6b656, transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6"
        >
          <Sparkles size={14} className="text-bronze-400" />
          <span className="text-xs tracking-[0.3em] text-white/80 uppercase">
            Carta digital · Bar premium
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-5xl xs:text-6xl md:text-8xl lg:text-9xl leading-none mb-4"
        >
          <span className="block gradient-text">Avenida</span>
          <span className="block font-script text-bronze-400 text-6xl xs:text-7xl md:text-9xl lg:text-[10rem] -mt-1 md:-mt-4">
            21
          </span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="mx-auto w-40 h-px bg-gold-line mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="font-script text-3xl md:text-4xl text-bronze-400 mb-3"
        >
          Dónde la magia empieza
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-white/65 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10"
        >
          Cócteles de autor, licores selectos y noches que recordarás.
          Desliza y descubre nuestra carta.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <a href="#cocteles" className="btn-gold w-full sm:w-auto">
            Ver la carta
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full
                       bg-gradient-to-br from-[#25d366] to-[#128c7e] text-white font-semibold
                       shadow-[0_10px_30px_-10px_rgba(37,211,102,0.55)]
                       hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
          >
            <MessageCircle size={18} />
            Reservar por WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-bronze-400"
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}
