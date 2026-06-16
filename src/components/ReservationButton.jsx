import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '573137877263';
const WHATSAPP_MESSAGE = '¡Hola! Quiero hacer una *reserva* en *Avenida 21*';

export const whatsappLink = () =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export default function ReservationButton() {
  return (
    <motion.a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.6 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-50
                 w-14 h-14 md:w-16 md:h-16 grid place-items-center rounded-full
                 bg-gradient-to-br from-[#25d366] to-[#128c7e] text-white
                 shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)]
                 ring-1 ring-white/20
                 transition-shadow hover:shadow-[0_15px_35px_-10px_rgba(37,211,102,0.9)]"
      aria-label="Reservar por WhatsApp"
    >
      <MessageCircle size={26} />
    </motion.a>
  );
}
