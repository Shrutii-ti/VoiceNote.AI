import Navbar from "../components/Navbar";
import MicButton from "../components/MicButton";
import TranscriptionCard from "../components/TranscriptionCard";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Dummy transcription simulation
  const handleMicClick = () => {
    setListening(true);
    setTranscript("");
    setTimeout(() => {
      setTranscript("Hello! This is a live transcription demo for VoiceNote AI. 🚀");
      setListening(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex flex-col font-poppins">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="flex flex-col items-center justify-center min-h-[80vh] gap-y-8 px-4 py-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg text-center">VoiceNote AI</h1>
        <p className="text-lg md:text-xl text-[#38bdf8] mb-6 font-medium text-center">Transcribe your voice in real-time.</p>
        <MicButton onClick={handleMicClick} listening={listening} />
        <TranscriptionCard text={transcript} listening={listening} />
      </motion.main>
    </div>
  );
}