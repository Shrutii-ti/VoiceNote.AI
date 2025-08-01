import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Mic } from "lucide-react";

const navLinks = [
	{ to: "/", label: "Home" },
	{ to: "/notes", label: "Notes" },
	{ to: "/settings", label: "Settings" },
];

export default function Navbar() {
	const location = useLocation();
	return (
		<nav className="sticky top-0 z-40 w-full bg-white/40 dark:bg-[#1e293b]/40 backdrop-blur-md shadow-lg border-b border-[#38bdf8]/10">
			<div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
				{/* Left: Logo + App Name */}
				<Link
					to="/"
					className="flex items-center gap-2 font-bold text-2xl text-[#38bdf8]"
				>
					<Mic size={28} className="drop-shadow-glow" />
					<span className="tracking-tight font-poppins">
						VoiceNote
						<span className="text-[#10b981]">AI</span>
					</span>
				</Link>
				{/* Center: Nav Links */}
				<div className="hidden md:flex flex-1 justify-center gap-x-8">
					{navLinks.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className={`px-3 py-2 rounded-xl font-medium transition-all duration-200
                hover:bg-[#38bdf8]/10 dark:hover:bg-[#10b981]/10
                ${
									location.pathname === link.to
										? "bg-[#38bdf8]/20 dark:bg-[#10b981]/20 text-[#10b981] dark:text-[#38bdf8]"
										: "text-gray-700 dark:text-gray-200"
								}
              `}
						>
							{link.label}
						</Link>
					))}
				</div>
				{/* Right: Theme Toggle + Profile */}
				<div className="flex items-center gap-4">
					<ThemeToggle />
					<img
						src="https://i.pravatar.cc/40"
						alt="profile"
						className="w-8 h-8 rounded-full border-2 border-[#38bdf8] shadow"
					/>
				</div>
			</div>
		</nav>
	);
}