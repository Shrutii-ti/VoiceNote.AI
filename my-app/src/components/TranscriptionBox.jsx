import { motion } from "framer-motion";
import React from "react";

export default function TranscriptionCard({ text, listening }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl min-h-[100px] bg-white/50 dark:bg-[#1e293b]/60 backdrop-blur-md rounded-2xl shadow-lg border border-[#38bdf8]/20 p-8 text-lg font-medium text-gray-900 dark:text-gray-100 transition-all mx-auto mt-6"
    >
      {listening && (
        <span className="text-[#10b981] animate-pulse">Listening...</span>
      )}
      {!listening && !text && (
        <span className="text-gray-400 animate-pulse">
          Your transcription will appear here...
        </span>
      )}
      {text && <TypingText text={text} />}
    </motion.div>
  );
}

// Typing animation for placeholder/text
function TypingText({ text }) {
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
  return <span>{displayed}</span>;
}