import { Instagram, MapPin, Phone, MessageCircle } from "lucide-react";
import { whatsappLink } from "./ReservationButton.jsx";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Cra 32A #19-47 Palermo Subterráneo");

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-bronze-700/30 bg-night-950/60 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gold-line" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-bronze-600/50">
              <img
                src="/logo/logo2.jpeg"
                alt="Avenida 21"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-display text-xl gradient-text">Avenida 21</p>
            </div>
          </div>
          <p className="font-script text-2xl text-bronze-400 leading-none">
            Dónde la magia empieza
          </p>
        </div>

        <div>
          <p className="font-display text-bronze-400 mb-3">Visítanos</p>
          <ul className="space-y-3 text-white/75">
            <li>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-bronze-400 transition"
              >
                <MapPin size={16} className="mt-0.5 text-bronze-500 shrink-0" />
                <span>
                  Cra. 32A #19-47
                  <br />
                  <span className="text-white/55 text-xs tracking-wider uppercase">
                    B/ Palermo Subterráneo
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="tel:+573137877263"
                className="flex items-center gap-2 hover:text-bronze-400 transition"
              >
                <Phone size={16} className="text-bronze-500 shrink-0" />
                <span>313 787 7263</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-bronze-400 mb-3">Reservas y redes</p>
          <div className="flex items-center gap-3">
            <a
              href={whatsappLink()}
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
            <a
              href="https://www.instagram.com/avenidaa_21/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 grid place-items-center rounded-full border border-white/15 text-white/85 hover:border-bronze-500 hover:text-bronze-400 transition-all"
            >
              <Instagram size={20} />
            </a>
          </div>
          <p className="mt-4 text-xs text-white/45 leading-relaxed">
            La diversión responsable es la mejor diversión. Prohibido el
            expendio de bebidas embriagantes a menores de edad.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Avenida 21 · Todos los derechos reservados
      </div>
    </footer>
  );
}
