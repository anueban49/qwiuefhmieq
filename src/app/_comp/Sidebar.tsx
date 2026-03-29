"use client";
import { useState } from "react";
import { useTheme } from "./context/ThemeContext";
import { useRouter } from "next/navigation";
import {
  TestTubes,
  ChartBarStackedIcon,
  Monitor,
  Newspaper,
  Moon,
  Eclipse,
} from "lucide-react";

// Define your nav items in one place — easy to add more later
const navItems = [
  { icon: Newspaper, label: "Regeant", action: "regeant" },
  { icon: TestTubes, label: "Instrument", action: "instrument" },
  { icon: ChartBarStackedIcon, label: "Category", action: "category" },
  { icon: Monitor, label: "Web", action: "webcontent" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { toggleTheme, theme } = useTheme();
  const router = useRouter();

  const handleClick = (action: string) => {
    if (action === "theme") return toggleTheme();
    router.push(`/${action}`);
  };

  return (
    <div
      className={`h-screen  flex flex-col gap-2 overflow-hidden p-2
        transition-all duration-300 ease-in-out shadow-md
        ${open ? "w-48" : "w-10"} ${theme === "dark" ? "bg-zinc-700 shadow-black" : "bg-gray-200 shadow-zinc-400"}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => toggleTheme()}
        className="flex items-center gap-3 w-fit aspect-square text-left p-1 rounded hover:bg-gray-400"
      >
        {theme === "dark" ? (
          <Eclipse size={20} className="shrink-0" />
        ) : (
          <Moon size={20} className="shrink-0" />
        )}
      </button>
      {navItems.map(({ icon: Icon, label, action }) => (
        <button
          key={action}
          onClick={() => handleClick(action)}
          className="flex items-center gap-3 w-full text-left p-1 rounded hover:bg-gray-400"
        >
          <Icon size={20} className="shrink-0" />

          <span
            className={`whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
              ${open ? "w-full opacity-100" : "w-0 opacity-0"}`}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
