import { motion } from 'framer-motion';
import ProductCard from './ProductCard.jsx';

export default function MenuSection({ categoria, productos }) {
  if (!productos.length) return null;

  return (
    <section
      id={categoria.id}
      className="scroll-mt-32 max-w-7xl mx-auto px-3 md:px-8 py-10 md:py-20"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 1200px' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8 md:mb-14"
      >
        <p className="text-2xl md:text-4xl mb-1 md:mb-2" aria-hidden>
          {categoria.icono}
        </p>
        <h2 className="font-display text-3xl md:text-5xl gradient-text">
          {categoria.nombre}
        </h2>
        <div className="mx-auto mt-3 md:mt-4 w-24 md:w-32 h-px bg-gold-line" />
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {productos.map((producto, i) => (
          <ProductCard key={producto.id} producto={producto} index={i} />
        ))}
      </div>
    </section>
  );
}
