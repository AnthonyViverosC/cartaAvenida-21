// Valores por defecto de la configuración del negocio.
// Coinciden con el diseño actual, para que la web nunca se vea vacía aunque
// falte el backend o algún campo.
export const CONFIG_DEFAULT = {
  nombre_negocio: 'Avenida 21',
  eslogan: 'Dónde la magia empieza',
  logo_url: '/logo/logo2.jpeg',
  portada_url: '/cocteles/Polvo de media noche.jpeg',
  direccion: 'Cra. 32A #19-47',
  barrio: 'B/ Palermo Subterráneo',
  telefonos: '313 787 7263',
  whatsapp: '573137877263',
  maps_url: '',
  info_contacto:
    'La diversión responsable es la mejor diversión. Prohibido el expendio de bebidas embriagantes a menores de edad.',
  colores: { primario: '#e6b656', secundario: '#b8854a' },
  redes: { instagram: 'https://www.instagram.com/avenidaa_21/', facebook: '', tiktok: '' },
};

// Construye el enlace de WhatsApp con un mensaje predeterminado.
export function construirWhatsapp(numero, nombreNegocio = 'Avenida 21') {
  const limpio = (numero || '').replace(/\D/g, '');
  const mensaje = `¡Hola! Quiero hacer una *reserva* en *${nombreNegocio}*`;
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`;
}

// Enlace a Google Maps: usa maps_url si existe, o busca por dirección.
export function construirMapa(config) {
  if (config.maps_url) return config.maps_url;
  const q = [config.direccion, config.barrio].filter(Boolean).join(' ');
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
}
