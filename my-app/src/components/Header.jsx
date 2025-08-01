import { Link, useLocation } from "react-router-dom";
import { Mic, Notebook, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { to: "/", label: "Home", icon: <Mic size={20} className="mr-2" /> },
  { to: "/notes", label: "Notes", icon: <Notebook size={20} className="mr-2" /> },
  { to: "/settings", label: "Settings", icon: <Settings size={20} className="mr-2" /> },
];

export default function Header() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-30 bg-white/60 dark:bg-[#1e293b]/60 backdrop-blur-md shadow-lg border-b border-[#38bdf8]/10">
      {/* <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-[#38bdf8]">
          <Mic size={28} className="drop-shadow-glow" />
          <span className="tracking-tight font-poppins">VoiceNote.<span className="text-[#10b981]">AI</span></span>
        </Link>
        <nav className="flex gap-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 gap-2 font-medium
                hover:bg-[#38bdf8]/10 dark:hover:bg-[#10b981]/10
                ${location.pathname === link.to ? "bg-[#38bdf8]/20 dark:bg-[#10b981]/20 text-[#10b981] dark:text-[#38bdf8]" : "text-gray-700 dark:text-gray-200"}
              `}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-[#38bdf8] shadow"
          />
        </div>
      </div> */}
    </header>
  );
}