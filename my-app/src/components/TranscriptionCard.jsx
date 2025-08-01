import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import React from "react";

export default function TranscriptionCard({ text, listening }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="relative w-full max-w-xl mx-auto min-h-[120px] bg-white/40 dark:bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#38bdf8]/30 p-8 flex items-center justify-center"
    >
      {/* Animated gradient border glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-0 border-2 border-transparent bg-gradient-to-br from-[#38bdf8]/40 via-[#10b981]/30 to-[#38bdf8]/40 animate-pulse opacity-40"></div>
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {!listening && !text && (
          <div className="flex flex-col items-center gap-2">
            <FileText className="text-[#38bdf8] opacity-70" size={32} />
            <TypingText
              text="Your transcription will appear here..."
              className="text-gray-400 text-base md:text-lg"
            />
          </div>
        )}
        {listening && (
          <TypingText
            text="Listening... Transcribing your voice in real-time."
            className="text-[#10b981] text-lg md:text-xl font-semibold animate-pulse"
          />
        )}
        {text && (
          <TypingText
            text={text}
            className="text-gray-900 dark:text-gray-100 text-lg md:text-xl font-medium"
          />
        )}
      </div>
    </motion.div>
  );
}

// Typing animation for placeholder/text
function TypingText({ text, className }) {
  const [displayed, setDisplayed] = React.useState("");
  React.useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);
  return <span className={className}>{displayed}</span>;
}