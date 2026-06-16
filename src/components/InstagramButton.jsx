import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/avenidaa_21/";

export default function InstagramButton() {
  return (
    <motion.a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.8 }}
      whileHover={{ scale: 1.08, rotate: -4 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50
                 w-14 h-14 md:w-16 md:h-16 rounded-full
                 bg-gradient-to-tr from-[#feda77] via-[#f58529] via-50% to-[#dd2a7b]
                 shadow-[0_10px_30px_-10px_rgba(221,42,123,0.6)] animate-glow
                 flex items-center justify-center text-white
                 ring-1 ring-white/20"
      aria-label="Instagram Avenida 21"
    >
      <Instagram size={26} />
    </motion.a>
  );
}
