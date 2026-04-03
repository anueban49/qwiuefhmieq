"use client";
import { useState } from "react";
import { Layers, Globe, Settings, Beaker, LayoutDashboard } from "lucide-react";
import { useContent } from "./context/ContentProvider";
import { ActiveBtn } from "./context/ContentProvider";
import { LOGO } from "./Logo";
type LangType = "EN" | "MN";
const navItems: {
  icon: React.ElementType;
  label: string;
  action: ActiveBtn;
}[] = [
  { icon: Layers, label: "Category", action: "Categories" },
  { icon: Beaker, label: "Regeants", action: "Regeants" },
  { icon: LayoutDashboard, label: "Instruments", action: "Instruments" },
  { icon: Settings, label: "Settings", action: "Settings" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { switchContent, active } = useContent();
  const [lang, setLang] = useState<LangType>("EN");
  const switchLang = () => {
    setLang((prev) => (prev === "EN" ? "MN" : "EN"));
  };
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div
      className={`h-screen flex flex-col gap-2 overflow-hidden px-2 py-5
        transition-all duration-300 ease-in-out shadow-md
        ${open ? "w-48" : "w-12"} bg-white shadow-zinc-400 text-zinc-600`}
      onClick={() => {
        toggleOpen();
      }}
    >
      <div className="flex items-center gap-3 py-5">
        <LOGO />
        <div
          className={`whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
              ${open ? "w-full opacity-100" : "w-0 opacity-0"}`}
        >
          <img src={`/BIOSYSTITLELOGO.png`} />
        </div>
      </div>
      <p
        className={`text-zinc-500 text-xs font-semibold px-2 whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
              ${open ? "w-full opacity-100" : "w-0 opacity-0"}`}
      >
        CATALOG
      </p>
      <button
        onClick={() => {
          switchLang();
        }}
        className="flex items-center gap-3 w-fit aspect-square text-left p-1 rounded hover:bg--500 ease-in-out duration-300 hover:bg-tg-subgreen"
      >
        <Globe size={20} className="shrink-0" />
      </button>
      {navItems.map(({ icon: Icon, label, action }) => (
        <button
          key={action}
          onClick={() => switchContent(action)}
          className="flex items-center gap-3 w-full text-left p-1 rounded hover:bg--500 ease-in-out duration-300 hover:text-tg-blue hover:bg-tg-blue/10"
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
      <div
        className={`mt-auto flex flex-col gap-3 whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
              ${open ? "w-full opacity-100" : "w-0 opacity-0"}`}
      >
        {" "}
        <button className="p-2 rounded ">ADMIN PROFILE</button>
        <button className="p-2 rounded">GARAH</button>
      </div>
    </div>
  );
}
