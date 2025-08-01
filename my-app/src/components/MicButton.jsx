import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export default function MicButton({ onClick, listening }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: "0 0 24px #38bdf8" }}
      whileTap={{ scale: 0.95 }}
      className={`w-28 h-28 rounded-full bg-white/30 dark:bg-[#1e293b]/40 backdrop-blur-md shadow-2xl border-2 border-[#38bdf8] flex items-center justify-center transition-all duration-200
        ${listening ? "ring-4 ring-[#10b981]/60 animate-pulse" : ""}
      `}
      onClick={onClick}
      aria-label="Start voice note"
    >
      <Mic size={56} className="text-[#38bdf8] drop-shadow-glow font-bold" />
    </motion.button>
  );
}