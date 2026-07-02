import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, MessageCircle } from 'lucide-react';
import { useConfig } from '../context/ConfigContext.jsx';
import { construirWhatsapp } from '../config/defaults.js';

export default function Hero() {
  const { config } = useConfig();
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-16 md:pt-20 md:pb-20"
    >
      {/* Imagen de portada — más viva y saturada */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${config.portada_url}")`,
            filter: 'brightness(0.55) saturate(1.35) contrast(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/45 via-night-950/30 to-night-950" />
      </div>

      {/* Capa de neones — muchos, saturados, en movimiento */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #9d4dff, transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[8%] right-[5%] w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full blur-3xl opacity-55 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff3ea5, transparent 70%)' }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[30%] right-[15%] w-64 h-64 md:w-80 md:h-80 rounded-full blur-3xl opacity-55 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #37e6ff, transparent 70%)' }}
        animate={{ x: [0, 25, 0], y: [0, 35, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[15%] w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f4d289, transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Partículas brillantes flotando */}
      <Sparkleitos />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6"
        >
          <Sparkles size={14} className="text-bronze-400" />
          <span className="text-xs tracking-[0.3em] text-white/90 uppercase">
            Carta digital · Bar premium
          </span>
        </motion.div>

        {/* ── LOGO HERO ── */}
        <LogoHero logo={config.logo_url} nombre={config.nombre_negocio} />

        {/* Marca tipográfica */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0 }}
          className="font-display text-4xl xs:text-5xl md:text-7xl leading-none mt-2 mb-3"
        >
          <span className="shimmer-text">{config.nombre_negocio}</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mx-auto w-32 h-px bg-gold-line mb-4"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="font-script text-3xl md:text-5xl text-bronze-400 mb-4 drop-shadow-[0_0_20px_rgba(230,182,86,0.45)]"
        >
          {config.eslogan}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-white/75 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-8"
        >
          Cócteles de autor, licores selectos y noches que recordarás.
          Desliza y descubre nuestra carta.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <a href="#cocteles" className="btn-gold w-full sm:w-auto animate-glow">
            Ver la carta
          </a>
          <a
            href={construirWhatsapp(config.whatsapp, config.nombre_negocio)}
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

/* ──────────── LOGO ESPECTACULAR ──────────── */
function LogoHero({ logo, nombre }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-44 h-44 xs:w-52 xs:h-52 md:w-72 md:h-72 mb-4"
    >
      {/* Halo dorado pulsante */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(230,182,86,0.85), rgba(255,62,165,0.35) 55%, transparent 75%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Anillo cónico rotando — efecto premium */}
      <motion.div
        className="absolute -inset-3 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, #f4d289, #ff3ea5, #9d4dff, #37e6ff, #f4d289)',
          filter: 'blur(6px)',
          opacity: 0.85,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Anillo dorado nítido */}
      <div className="absolute -inset-1 rounded-full ring-2 ring-bronze-500/70 shadow-[0_0_60px_rgba(230,182,86,0.55)]" />

      {/* Logo */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-2 rounded-full overflow-hidden ring-1 ring-white/20 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]"
      >
        <img
          src={logo}
          alt={`${nombre} - Logo`}
          className="w-full h-full object-cover"
        />
        {/* Brillo de barrido */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)',
          }}
          animate={{ x: ['-120%', '120%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
        />
      </motion.div>

      {/* Sparks flotando alrededor */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-bronze-300 shadow-[0_0_12px_4px_rgba(244,210,137,0.7)]"
          animate={{
            x: [
              0,
              Math.cos((i / 5) * Math.PI * 2) * 130,
              Math.cos((i / 5) * Math.PI * 2 + Math.PI) * 130,
              0,
            ],
            y: [
              0,
              Math.sin((i / 5) * Math.PI * 2) * 130,
              Math.sin((i / 5) * Math.PI * 2 + Math.PI) * 130,
              0,
            ],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 6 + i * 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </motion.div>
  );
}

/* Partículas de brillo dispersas */
function Sparkleitos() {
  const stars = Array.from({ length: 22 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {stars.map((_, i) => {
        const left = (i * 53) % 100;
        const top = (i * 37) % 100;
        const size = 2 + (i % 3);
        const delay = (i % 7) * 0.4;
        const dur = 3 + (i % 5);
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-bronze-300"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              boxShadow: '0 0 10px rgba(244,210,137,0.9)',
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}
