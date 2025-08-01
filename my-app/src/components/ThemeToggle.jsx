import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      className="rounded-full p-2 bg-white/40 dark:bg-[#1e293b]/40 shadow transition-all duration-300 hover:scale-110"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
    >
      <span className="flex items-center transition-all duration-300">
        <span
          className={`inline-block transition-transform duration-300 ${
            dark ? "rotate-0" : "rotate-180"
          }`}
        >
          {dark ? (
            <Sun className="text-yellow-400" size={20} />
          ) : (
            <Moon className="text-blue-400" size={20} />
          )}
        </span>
      </span>
    </button>
  );
}