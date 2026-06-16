import { memo, useState } from 'react';
import BottlePlaceholder from './BottlePlaceholder.jsx';
import { formatearPrecio } from '../data/menu.js';

function ProductCard({ producto }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = producto.imagen && !imgError;

  // Tipo de placeholder según categoría
  const tipoPlaceholder =
    producto.categoria === 'cervezas'
      ? 'lata'
      : producto.categoria === 'otros'
      ? producto.nombre.toLowerCase().includes('agua')
        ? 'botella'
        : 'lata'
      : 'botella';

  return (
    <article className="group relative rounded-2xl overflow-hidden glass hover:border-bronze-600/40 transition-colors duration-300 shadow-card">
      {/* halo dorado al hacer hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(230,182,86,0.14), transparent 60%)',
        }}
      />

      {/* media */}
      <div className="relative aspect-[4/5] overflow-hidden bg-night-800">
        {hasImage ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-night-700 to-night-900">
            <BottlePlaceholder
              nombre={producto.nombre}
              color={producto.color || '#b8854a'}
              tipo={tipoPlaceholder}
            />
          </div>
        )}

        {/* gradiente inferior */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night-900 to-transparent pointer-events-none" />
      </div>

      {/* info */}
      <div className="relative p-3 md:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm xs:text-base md:text-xl text-white leading-tight break-words min-w-0">
            {producto.nombre}
          </h3>
          {producto.precio != null && producto.precio !== '' && (
            <span className="shrink-0 font-display text-sm xs:text-base md:text-lg gradient-text font-semibold">
              {formatearPrecio(producto.precio)}
            </span>
          )}
        </div>
        {producto.descripcion && (
          <p className="mt-1.5 text-[11px] xs:text-xs md:text-sm text-white/55 leading-relaxed line-clamp-3">
            {producto.descripcion}
          </p>
        )}
        <div className="mt-2 md:mt-3 divider-gold opacity-40 group-hover:opacity-100 transition" />
      </div>
    </article>
  );
}

export default memo(ProductCard);
