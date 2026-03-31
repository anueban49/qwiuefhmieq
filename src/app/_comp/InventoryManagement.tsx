"use client";
import { useState } from "react";
import InstrumentsControl from "./InstrumentsControl";
import { RegeantsControl } from "./RegeantsControl";
export type Active = "Regeant" | "Instrument";
export const InventoryManagement = () => {
  const [active, setActive] = useState<Active>("Instrument");
  const switchBtns = [
    { label: "Instrument", action: "Instrument" as Active },
    { label: "Regeant", action: "Regeant" as Active },
  ];
  return (
    <div className="no-scrollbar w-full flex flex-col gap-2 p-2">
      <div
        className={`w-full rounded shadow-sm p-2 flex justify-around items-center gap-5`}
      >
        {switchBtns.map((b, i) => (
          <button
            className={`w-full rounded  ease-in-out duration-300 p-1 hover:bg-tg-green-light/30
              ${active === b.label && "bg-tg-green-light text-white"}`}
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
