import { Instagram, MapPin, Phone, MessageCircle, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useConfig } from "../context/ConfigContext.jsx";
import { construirWhatsapp, construirMapa } from "../config/defaults.js";

export default function Footer() {
  const { config } = useConfig();
  const telLimpio = (config.telefonos || "").replace(/\s/g, "");

  return (
    <footer className="relative mt-20 border-t border-bronze-700/30 bg-night-950/60 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gold-line" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-bronze-600/50">
              <img
                src={config.logo_url}
                alt={config.nombre_negocio}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-display text-xl gradient-text">{config.nombre_negocio}</p>
            </div>
          </div>
          <p className="font-script text-2xl text-bronze-400 leading-none">
            {config.eslogan}
          </p>
        </div>

        <div>
          <p className="font-display text-bronze-400 mb-3">Visítanos</p>
          <ul className="space-y-3 text-white/75">
            {config.direccion && (
              <li>
                <a
                  href={construirMapa(config)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-bronze-400 transition"
                >
                  <MapPin size={16} className="mt-0.5 text-bronze-500 shrink-0" />
                  <span>
                    {config.direccion}
                    {config.barrio && (
                      <>
                        <br />
                        <span className="text-white/55 text-xs tracking-wider uppercase">
                          {config.barrio}
                        </span>
                      </>
                    )}
                  </span>
                </a>
              </li>
            )}
            {config.telefonos && (
              <li>
                <a
                  href={`tel:${telLimpio}`}
                  className="flex items-center gap-2 hover:text-bronze-400 transition"
                >
                  <Phone size={16} className="text-bronze-500 shrink-0" />
                  <span>{config.telefonos}</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="font-display text-bronze-400 mb-3">Reservas y redes</p>
          <div className="flex items-center gap-3">
            {config.whatsapp && (
              <a
                href={construirWhatsapp(config.whatsapp, config.nombre_negocio)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reservar por WhatsApp"
                className="w-11 h-11 grid place-items-center rounded-full
                           bg-gradient-to-br from-[#25d366] to-[#128c7e] text-white
                           shadow-[0_10px_30px_-10px_rgba(37,211,102,0.55)]
                           hover:-translate-y-0.5 transition-all duration-300"
              >
                <MessageCircle size={20} />
              </a>
            )}
            {config.redes?.instagram && (
              <a
                href={config.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 grid place-items-center rounded-full border border-white/15 text-white/85 hover:border-bronze-500 hover:text-bronze-400 transition-all"
              >
                <Instagram size={20} />
              </a>
            )}
          </div>
          {config.info_contacto && (
            <p className="mt-4 text-xs text-white/45 leading-relaxed">
              {config.info_contacto}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/5 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-white/40">
        <span>© {new Date().getFullYear()} {config.nombre_negocio} · Todos los derechos reservados</span>
        <span className="hidden sm:inline text-white/15">|</span>
        {/* Acceso discreto al panel de administración */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-white/35 hover:text-bronze-400 transition"
        >
          <Lock size={12} /> Acceso administrador
        </Link>
      </div>
    </footer>
  );
}
