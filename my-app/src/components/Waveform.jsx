import { motion } from "framer-motion";

export default function Waveform({ active }) {
  return (
    <div className="flex gap-1 h-8 items-end">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="w-3 rounded bg-[#38bdf8] shadow-lg"
          animate={active ? { height: ["1rem", "2.5rem", "1rem"] } : { height: "1rem" }}
          transition={{
            repeat: active ? Infinity : 0,
            duration: 1 + i * 0.1,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}