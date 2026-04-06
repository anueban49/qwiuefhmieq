"use client";
import { useState } from "react";
import {
  Layers,
  Globe,
  Mails,
  Beaker,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";
import { useContent } from "./context/ContentProvider";
import { ActiveBtn } from "./context/ContentProvider";
import { LOGO } from "./Logo";
const navItems: {
  icon: React.ElementType;
  label: string;
  action: ActiveBtn;
  mongolian: string;
}[] = [
  {
    icon: Layers,
    label: "Category",
    action: "Categories",
    mongolian: "Категори",
  },
  { icon: Beaker, label: "Regeants", action: "Regeants", mongolian: "Урвалж" },
  {
    icon: LayoutDashboard,
    label: "Instruments",
    action: "Instruments",
    mongolian: "Төхөөрөмж",
  },
  {
    icon: Mails,
    label: "Messages",
    action: "Messages",
    mongolian: "Хүсэлтүүд",
  },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { switchContent, lang, switchLang } = useContent();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/BIOSYSTITLELOGO.png`} alt="BioSystems logo" />
        </div>
      </div>
      <div
        className={`text-zinc-500 text-xs font-semibold px-2 whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
              ${open ? "w-full opacity-100" : "w-0 opacity-0"}`}
      >
        {lang === "EN" ? <p>CATALOG</p> : <p>КАТАЛОГ</p>}
      </div>
      <button
        onClick={() => {
          switchLang();
        }}
        className="flex items-center gap-3 w-fit text-left p-1 rounded hover:bg--500 ease-in-out duration-300 hover:bg-tg-subgreen"
      >
        <Globe size={20} className="shrink-0" />
        <div className={`${open ? "w-full opacity-100" : "w-0 opacity-0"}`}>
          {lang === "EN" ? <p>English</p> : <p>Монгол</p>}
        </div>
      </button>
      {navItems.map(({ icon: Icon, label, action, mongolian }) => (
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
            {lang === "EN" ? label : mongolian}
          </span>
        </button>
      ))}
      <div
        className={`mt-auto flex flex-col gap-3 whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
              ${open ? "w-full opacity-100" : "w-0 opacity-0"}`}
      >
        <button className="p-2 rounded ">ADMIN PROFILE</button>
        <button className="p-2 rounded flex items-center gap-2 font-semibold hover:bg-red-100 hover:text-red-700 duration">
          <LogOutIcon /> Log Out{" "}
        </button>
      </div>
    </div>
  );
}
