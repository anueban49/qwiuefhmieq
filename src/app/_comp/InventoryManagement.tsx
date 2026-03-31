"use client";
import { useState } from "react";
import InstrumentsControl from "./InstrumentsControl";
import { RegeantsControl } from "./RegeantsControl";
import { useTheme } from "./context/ThemeContext";
export type Active = "Regeant" | "Instrument";
export const InventoryManagement = () => {
  const [active, setActive] = useState<Active>("Instrument");
  const { theme } = useTheme();
  const switchBtns = [
    { label: "Instrument", action: "Instrument" as Active },
    { label: "Regeant", action: "Regeant" as Active },
  ];
  return (
    <div className="no-scrollbar w-full flex flex-col gap-2 p-2">
      <div
        className={`w-full rounded shadow-sm p-2 flex justify-around items-center gap-5 ${theme === "dark" ? "bg-zinc-700" : ""}`}
      >
        {switchBtns.map((b, i) => (
          <button
            className={`w-full rounded inset-shadow-sm ease-in-out duration-300 p-1
              ${active === b.label && `${theme === "dark" ? "inset-shadow-black" : "inset-shadow-zinc-500"}`}`}
            key={i}
            onClick={() => {
              setActive(b.action);
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {active === "Regeant" && <RegeantsControl />}
      {active === "Instrument" && <InstrumentsControl />}
    </div>
  );
};
