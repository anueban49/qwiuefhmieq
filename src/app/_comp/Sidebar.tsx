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
import { useContent } from "./context/ContentProvider";
import { ActiveBtn } from "./context/ContentProvider";
// Define your nav items in one place — easy to add more later
const navItems: { icon: React.ElementType; label: string; action: ActiveBtn }[] = [
  { icon: Newspaper, label: "Inventory", action: "Products" },
  { icon: Monitor, label: "Web", action: "Web" },
  { icon: ChartBarStackedIcon, label: "Dashboard", action: "Dashboard" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { toggleTheme, theme } = useTheme();
  const router = useRouter();
  const { switchContent, active } = useContent();

  const handleClick = (action: string) => {
    if (action === "theme") return toggleTheme();
    router.push(`/${action}`);
  };

  return (
    <div
      className={`h-screen flex flex-col gap-2 overflow-hidden px-2 py-5
        transition-all duration-300 ease-in-out shadow-md
        ${open ? "w-48" : "w-12"} ${theme === "dark" ? "bg-zinc-700 shadow-black" : "bg-gray-200 shadow-zinc-400"}`}
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
          onClick={() => switchContent(action)}
          className="flex items-center gap-3 w-full text-left p-1 rounded hover:bg-gray-500 ease-in-out duration-300"
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
