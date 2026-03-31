"use client";
import { useState } from "react";
import {
  ChartBarStackedIcon,
  Monitor,
  Newspaper,
} from "lucide-react";
import { useContent } from "./context/ContentProvider";
import { ActiveBtn } from "./context/ContentProvider";

const navItems: { icon: React.ElementType; label: string; action: ActiveBtn }[] = [
  { icon: Newspaper, label: "Inventory", action: "Products" },
  { icon: Monitor, label: "Web", action: "Web" },
  { icon: ChartBarStackedIcon, label: "Dashboard", action: "Dashboard" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { switchContent, active } = useContent();

  return (
    <div
      className={`h-screen flex flex-col gap-2 overflow-hidden px-2 py-5
        transition-all duration-300 ease-in-out shadow-md
        ${open ? "w-48" : "w-12"} bg-tg-green shadow-zinc-400 text-white`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
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
