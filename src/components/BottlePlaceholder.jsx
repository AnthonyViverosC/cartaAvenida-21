// Botella SVG estilizada para productos sin imagen propia.
// Recibe un color de etiqueta y el nombre del producto.
export default function BottlePlaceholder({ nombre, color = '#b8854a', tipo = 'botella' }) {
  if (tipo === 'lata') {
    return <CanSvg nombre={nombre} color={color} />;
  }
  if (tipo === 'vaso') {
    return <GlassSvg nombre={nombre} color={color} />;
  }
  return <BottleSvg nombre={nombre} color={color} />;
}

function BottleSvg({ nombre, color }) {
  const idGrad = `g-${nombre.replace(/\W/g, '')}`;
  const idShine = `s-${nombre.replace(/\W/g, '')}`;
  const idLabel = `l-${nombre.replace(/\W/g, '')}`;
  return (
    <svg
      viewBox="0 0 200 320"
      className="w-full h-full"
      aria-label={nombre}
    >
      <defs>
        <linearGradient id={idGrad} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#0d1018" />
          <stop offset="35%" stopColor="#1a2030" />
          <stop offset="65%" stopColor="#0d1220" />
          <stop offset="100%" stopColor="#05070d" />
        </linearGradient>
        <linearGradient id={idShine} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id={idLabel} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={shade(color, 0.15)} />
          <stop offset="100%" stopColor={shade(color, -0.25)} />
        </linearGradient>
      </defs>

      {/* sombra base */}
      <ellipse cx="100" cy="305" rx="60" ry="6" fill="rgba(0,0,0,0.55)" />

      {/* cuello */}
      <rect x="86" y="20" width="28" height="55" rx="4" fill={`url(#${idGrad})`} stroke="#e6b656" strokeOpacity="0.25" />
      {/* tapa */}
      <rect x="82" y="10" width="36" height="18" rx="3" fill="#e6b656" />
      <rect x="82" y="10" width="36" height="6" rx="3" fill="#f4d289" />

      {/* hombros */}
      <path
        d="M86 70 C 86 90, 50 100, 50 140 L50 290 Q50 305 65 305 L135 305 Q150 305 150 290 L150 140 C150 100, 114 90, 114 70 Z"
        fill={`url(#${idGrad})`}
        stroke="#e6b656"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* brillo lateral */}
      <path
        d="M62 130 Q60 200 70 290 L80 290 Q72 200 74 135 Z"
        fill={`url(#${idShine})`}
        opacity="0.55"
      />

      {/* etiqueta */}
      <rect x="58" y="165" width="84" height="100" rx="6" fill={`url(#${idLabel})`} stroke="rgba(0,0,0,0.35)" />
      <rect x="58" y="165" width="84" height="100" rx="6" fill="url(#labelTexture)" opacity="0.18" />
      <rect x="58" y="170" width="84" height="2" fill="rgba(255,255,255,0.4)" />
      <rect x="58" y="258" width="84" height="2" fill="rgba(0,0,0,0.35)" />

      <text
        x="100"
        y="220"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontSize="13"
        fontWeight="700"
        fill="#fff"
        style={{ letterSpacing: 1 }}
      >
        {nombre.length > 14 ? nombre.split(' ')[0] : nombre}
      </text>
      <text
        x="100"
        y="240"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="7"
        fill="rgba(255,255,255,0.75)"
        style={{ letterSpacing: 2 }}
      >
        AVENIDA · 21
      </text>
    </svg>
  );
}

function CanSvg({ nombre, color }) {
  return (
    <svg viewBox="0 0 200 320" className="w-full h-full" aria-label={nombre}>
      <defs>
        <linearGradient id={`can-${nombre.replace(/\W/g, '')}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={shade(color, -0.4)} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={shade(color, -0.4)} />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="305" rx="55" ry="6" fill="rgba(0,0,0,0.55)" />
      <rect
        x="55"
        y="60"
        width="90"
        height="240"
        rx="10"
        fill={`url(#can-${nombre.replace(/\W/g, '')})`}
        stroke="#e6b656"
        strokeOpacity="0.25"
      />
      <ellipse cx="100" cy="60" rx="45" ry="8" fill={shade(color, -0.55)} />
      <ellipse cx="100" cy="58" rx="42" ry="6" fill={shade(color, 0.25)} />
      <rect x="55" y="80" width="90" height="3" fill="rgba(255,255,255,0.2)" />
      <rect x="55" y="278" width="90" height="3" fill="rgba(0,0,0,0.35)" />
      <text
        x="100"
        y="180"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontSize="15"
        fontWeight="700"
        fill="#fff"
        style={{ letterSpacing: 1 }}
      >
        {nombre.split(' ')[0]}
      </text>
      <text
        x="100"
        y="200"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="8"
        fill="rgba(255,255,255,0.85)"
        style={{ letterSpacing: 2 }}
      >
        AV · 21
      </text>
    </svg>
  );
}

function GlassSvg({ nombre, color }) {
  return (
    <svg viewBox="0 0 200 320" className="w-full h-full" aria-label={nombre}>
      <ellipse cx="100" cy="305" rx="55" ry="5" fill="rgba(0,0,0,0.45)" />
      <path
        d="M55 60 L145 60 L130 280 Q125 305 100 305 Q75 305 70 280 Z"
        fill={shade(color, -0.25)}
        opacity="0.85"
        stroke="rgba(230,182,86,0.35)"
      />
      <path
        d="M62 70 L138 70 L126 270 Q122 290 100 290 Q78 290 74 270 Z"
        fill={shade(color, 0.15)}
        opacity="0.5"
      />
      <ellipse cx="100" cy="62" rx="42" ry="6" fill="rgba(255,255,255,0.18)" />
      <text
        x="100"
        y="180"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="9"
        fill="rgba(255,255,255,0.7)"
        style={{ letterSpacing: 3 }}
      >
        AVENIDA · 21
      </text>
    </svg>
  );
}

// Aclarar/oscurecer un color hex
function shade(hex, percent) {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}
