// Carta digital - Avenida 21
// Precios en miles de pesos colombianos (COP). Ej: 180 = $180.000
// Las imágenes de cócteles se sirven desde /public/cocteles/
// Los productos sin imagen propia usan un placeholder elegante (BottlePlaceholder)

export const categorias = [
  { id: "cocteles", nombre: "Cócteles", icono: "" },
  { id: "cervezas", nombre: "Cervezas", icono: "" },
  { id: "nacionales", nombre: "Licores Nacionales", icono: "" },
  { id: "whisky", nombre: "Whisky", icono: "" },
  { id: "tequila", nombre: "Tequila", icono: "" },
  { id: "otros", nombre: "Otros", icono: "" },
];

// ─── CÓCTELES ────────────────────────────────────────────────
// Precios sugeridos: editar libremente.
const cocteles = [
  {
    nombre: "Mojito Tradicional",
    precio: 28,
    descripcion: "Ron, menta fresca, lima y soda. El clásico irresistible.",
    imagen: "/cocteles/Mojito Tradicional .jpeg",
  },
  {
    nombre: "Margarita Tradicional",
    precio: 30,
    descripcion: "Tequila, triple sec y limón. Borde de sal, intensidad pura.",
    imagen: "/cocteles/Margarita Tradicional.jpeg",
  },
  {
    nombre: "Margarita de Frutos Rojos",
    precio: 32,
    descripcion: "Margarita reinventada con frutos rojos frescos.",
    imagen: "/cocteles/Margarita de frutos rojos.jpeg",
  },
  {
    nombre: "Tequila Sunrise",
    precio: 30,
    descripcion: "Tequila, naranja y granadina. Un amanecer en cada sorbo.",
    imagen: "/cocteles/Tequila sunrise.jpeg",
  },
  {
    nombre: "Sour Apple Tequila",
    precio: 32,
    descripcion: "Tequila, manzana verde y un toque ácido perfecto.",
    imagen: "/cocteles/Sour apple tequila.jpeg",
  },
  {
    nombre: "Mexican Mule",
    precio: 30,
    descripcion:
      "Tequila, ginger beer y limón. Vaso de cobre, sabor de fiesta.",
    imagen: "/cocteles/Mexican mule.jpeg",
  },
  {
    nombre: "Long Island",
    precio: 35,
    descripcion:
      "Cinco licores, una sola intención. No apto para principiantes.",
    imagen: "/cocteles/Long Aisland.jpeg",
  },
  {
    nombre: "Gin Tonic",
    precio: 28,
    descripcion: "Ginebra premium, tónica y botánicos. Elegancia líquida.",
    imagen: "/cocteles/Gin tonic.jpeg",
  },
  {
    nombre: "Blue Russian",
    precio: 32,
    descripcion: "Vodka, licor de café y un giro azul que enamora.",
    imagen: "/cocteles/Blue Russian.jpeg",
  },
  {
    nombre: "Blue Berry Whiskey",
    precio: 34,
    descripcion: "Whisky, arándanos y notas dulces. Suave y profundo.",
    imagen: "/cocteles/Blue berry whiskey.jpeg",
  },
  {
    nombre: "Auld Land Kiwi",
    precio: 32,
    descripcion: "Whisky, kiwi fresco y burbujas. Fresco y atrevido.",
    imagen: "/cocteles/Auld land kiwi.jpeg",
  },
  {
    nombre: "Caffelato",
    precio: 30,
    descripcion: "Café, licor cremoso y un final aterciopelado.",
    imagen: "/cocteles/Caffelato.jpeg",
  },
  {
    nombre: "Ciervo de Mora",
    precio: 32,
    descripcion: "Mora andina con licor noble. Intenso y elegante.",
    imagen: "/cocteles/Ciervo de mora.jpeg",
  },
  {
    nombre: "Polvo de Media Noche",
    precio: 34,
    descripcion: "Un trago oscuro, hipnótico y de carácter.",
    imagen: "/cocteles/Polvo de media noche.jpeg",
  },
  {
    nombre: "Jaguar Boom",
    precio: 35,
    descripcion: "Explosión de licores con actitud salvaje.",
    imagen: "/cocteles/Jaguar Boom.jpeg",
  },
  {
    nombre: "Passion It About You",
    precio: 32,
    descripcion: "Maracuyá, vodka y un toque seductor. La firma del bar.",
    imagen: "/cocteles/passion it about you .jpeg",
  },
  {
    nombre: "Electrofusión",
    precio: 30,
    descripcion: "Mezcla eléctrica con notas cítricas y energía pura.",
    imagen: "/cocteles/Electro fusion .jpeg",
  },
  {
    nombre: "Electrofusión de Maracuyá",
    precio: 32,
    descripcion: "La electrofusión clásica con explosión de maracuyá.",
    imagen: "/cocteles/Electrofusion de maracuya .jpeg",
  },
  {
    nombre: "Electrofusión de Mora",
    precio: 32,
    descripcion: "Electrofusión con mora andina. Color y carácter.",
    imagen: "/cocteles/Electrofusion de mora.jpeg",
  },
  {
    nombre: "Soda de Maracuyá",
    precio: 22,
    descripcion: "Refrescante, burbujeante y dulce a la vez.",
    imagen: "/cocteles/soda de maracuya.jpeg",
  },
];

// ─── CERVEZAS ────────────────────────────────────────────────
const cervezas = [
  { nombre: "Corona", precio: 15, color: "#e6c25a", imagen: "/cervezas/corona.jpg" },
  { nombre: "Budweiser", precio: 10, color: "#b71c1c", imagen: "/cervezas/budweiser.jpg" },
  { nombre: "Club Dorada", precio: 12, color: "#d4a45a" },
  { nombre: "Stella Artois", precio: 15, color: "#c8954c", imagen: "/cervezas/stella-artois.jpg" },
  { nombre: "Smirnoff Ice", precio: 20, color: "#5a8cc8", imagen: "/cervezas/smirnoff-ice.jpg" },
];

// ─── LICORES NACIONALES ──────────────────────────────────────
const nacionales = [
  {
    nombre: "Aguardiente Nacional",
    precio: 150,
    descripcion: "Botella",
    color: "#a8e6cf",
  },
  {
    nombre: "Aguardiente Nariño",
    precio: 150,
    descripcion: "Botella",
    color: "#7fd8a4",
  },
  {
    nombre: "Aguardiente Amarillo",
    precio: 150,
    descripcion: "Botella",
    color: "#f6d96a",
  },
  {
    nombre: "Aguardiente Tamarindo",
    precio: 150,
    descripcion: "Botella",
    color: "#d6883a",
  },
  { nombre: "Ron", precio: 140, descripcion: "Botella", color: "#8c4a1e" },
  {
    nombre: "Ron 8 Años",
    precio: 220,
    descripcion: "Botella · Añejo premium",
    color: "#5e2f12",
  },
  {
    nombre: "Bacardí Limón",
    precio: 150,
    descripcion: "Botella",
    color: "#cfe06a",
    imagen: "/nacionales/bacardi.jpg",
  },
  {
    nombre: "Smirnoff Lulo",
    precio: 150,
    descripcion: "Botella",
    color: "#d4e36a",
    imagen: "/nacionales/smirnoff.jpg",
  },
  {
    nombre: "Aguardiente Antioqueño",
    precio: 150,
    descripcion: "Botella",
    color: "#9bdfb5",
    imagen: "/nacionales/aguardiente-antioqueno.jpg",
  },
  {
    nombre: "Media (cualquier nacional)",
    precio: 90,
    descripcion: "Media botella",
    color: "#b89b6a",
  },
];

// ─── WHISKY ──────────────────────────────────────────────────
const whisky = [
  {
    nombre: "Red Label",
    precio: 180,
    descripcion: "Botella",
    color: "#a8333a",
    imagen: "/whisky/red-label.jpg",
  },
  {
    nombre: "Something Special",
    precio: 180,
    descripcion: "Botella",
    color: "#b07a3c",
  },
  {
    nombre: "Something Special · Media",
    precio: 100,
    descripcion: "Media botella",
    color: "#b07a3c",
  },
  {
    nombre: "Ballantine's",
    precio: 180,
    descripcion: "Botella",
    color: "#c89a4a",
    imagen: "/whisky/ballantines.jpg",
  },
  {
    nombre: "Ballantine's · Media",
    precio: 100,
    descripcion: "Media botella",
    color: "#c89a4a",
    imagen: "/whisky/ballantines.jpg",
  },
  {
    nombre: "Chivas Regal",
    precio: 320,
    descripcion: "Botella",
    color: "#8a5a1f",
    imagen: "/whisky/chivas-regal.jpg",
  },
  {
    nombre: "Chivas · Media",
    precio: 200,
    descripcion: "Media botella",
    color: "#8a5a1f",
    imagen: "/whisky/chivas-regal.jpg",
  },
  {
    nombre: "Jack Daniel's",
    precio: 320,
    descripcion: "Botella · Tennessee",
    color: "#3a1f0a",
    imagen: "/whisky/jack-daniels.jpg",
  },
  {
    nombre: "Jack Daniel's · Media",
    precio: 170,
    descripcion: "Media botella",
    color: "#3a1f0a",
    imagen: "/whisky/jack-daniels.jpg",
  },
  {
    nombre: "Buchanan's 12",
    precio: 340,
    descripcion: "Botella",
    color: "#1a2540",
  },
  {
    nombre: "Buchanan's · Media",
    precio: 210,
    descripcion: "Media botella",
    color: "#1a2540",
  },
  {
    nombre: "Buchanan Master",
    precio: 400,
    descripcion: "Botella · Premium",
    color: "#0e1730",
  },
  {
    nombre: "Old Parr",
    precio: 380,
    descripcion: "Botella · 12 años",
    color: "#2e3a52",
    imagen: "/whisky/old-parr.jpg",
  },
  {
    nombre: "Old Parr · Media",
    precio: 190,
    descripcion: "Media botella",
    color: "#2e3a52",
    imagen: "/whisky/old-parr.jpg",
  },
];

// ─── TEQUILA ─────────────────────────────────────────────────
const tequila = [
  {
    nombre: "Olmeca",
    precio: 180,
    descripcion: "Botella",
    color: "#d6b46a",
    imagen: "/tequila/olmeca.jpg",
  },
  {
    nombre: "Olmeca · Media",
    precio: 110,
    descripcion: "Media botella",
    color: "#d6b46a",
    imagen: "/tequila/olmeca.jpg",
  },
  {
    nombre: "José Cuervo",
    precio: 190,
    descripcion: "Botella",
    color: "#c89a4a",
    imagen: "/tequila/jose-cuervo.jpg",
  },
  {
    nombre: "José Cuervo · Media",
    precio: 120,
    descripcion: "Media botella",
    color: "#c89a4a",
    imagen: "/tequila/jose-cuervo.jpg",
  },
  { nombre: "Jimador", precio: 250, descripcion: "Botella", color: "#b07a3c" },
  {
    nombre: "Jimador · Media",
    precio: 160,
    descripcion: "Media botella",
    color: "#b07a3c",
  },
  {
    nombre: "Don Julio",
    precio: 560,
    descripcion: "Botella · Premium",
    color: "#8a5a1f",
    imagen: "/tequila/don-julio.jpg",
  },
  {
    nombre: "1800",
    precio: 580,
    descripcion: "Botella · Reserva",
    color: "#6a3f12",
  },
];

// ─── OTROS / MEZCLADORES ─────────────────────────────────────
const otros = [
  { nombre: "Coca-Cola", precio: 10, color: "#3a1010", imagen: "/otros/coca-cola.jpg" },
  { nombre: "Soda", precio: 10, color: "#4a6f8a" },
  { nombre: "Bonfiest", precio: 10, color: "#7a3a1f" },
  { nombre: "Agua", precio: 6, color: "#5fb1d4" },
  { nombre: "Gatorade", precio: 12, color: "#3a8a3a", imagen: "/otros/gatorade.jpg" },
  { nombre: "Bomba", precio: 20, color: "#1a3a7a" },
  { nombre: "Red Bull", precio: 18, color: "#1a3a7a", imagen: "/otros/red-bull.jpg" },
  { nombre: "Electrolit", precio: 18, color: "#d4683a" },
];

// Construye id y categoría automáticamente para cada producto
const conMeta = (categoriaId, items) =>
  items.map((p, i) => ({
    id: `${categoriaId}-${i}`,
    categoria: categoriaId,
    ...p,
  }));

export const productos = [
  ...conMeta("cocteles", cocteles),
  ...conMeta("cervezas", cervezas),
  ...conMeta("nacionales", nacionales),
  ...conMeta("whisky", whisky),
  ...conMeta("tequila", tequila),
  ...conMeta("otros", otros),
];

export const formatearPrecio = (precio) => {
  if (precio == null || precio === "") return "";
  // Convierte 180 -> "$180.000"
  return `$${precio.toLocaleString("es-CO")}.000`;
};
