"use client";
import { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext";
import { TestTubes, FlaskConical, Tag, LayoutTemplate } from "lucide-react";

const API = "http://localhost:5000/api";

type Pillar = { id: string; title: string; description?: string };

type StatCard = { label: string; count: number; icon: React.ElementType };

export function DashboardView() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({ instruments: 0, reagents: 0, categories: 0 });
  const [pillars, setPillars] = useState<Pillar[]>([]);

  const card =
    theme === "dark"
      ? "bg-zinc-700 shadow-black"
      : "bg-gray-200 shadow-gray-400";
  const inner = theme === "dark" ? "bg-zinc-600" : "bg-white";

  useEffect(() => {
    Promise.all([
      fetch(`${API}/instruments`).then((r) => r.json()),
      fetch(`${API}/reagents`).then((r) => r.json()),
      fetch(`${API}/categories`).then((r) => r.json()),
      fetch(`${API}/pillars`).then((r) => r.json()),
    ])
      .then(([instruments, reagents, categories, pillars]) => {
        setStats({
          instruments: Array.isArray(instruments) ? instruments.length : 0,
          reagents: Array.isArray(reagents) ? reagents.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
        });
        setPillars(Array.isArray(pillars) ? pillars : []);
      })
      .catch(console.error);
  }, []);

  const statCards: StatCard[] = [
    { label: "Instruments", count: stats.instruments, icon: TestTubes },
    { label: "Reagents", count: stats.reagents, icon: FlaskConical },
    { label: "Categories", count: stats.categories, icon: Tag },
  ];

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="grid grid-cols-3 gap-3">
        {statCards.map(({ label, count, icon: Icon }) => (
          <div
            key={label}
            className={`p-4 rounded shadow-md flex items-center gap-3 ${card}`}
          >
            <Icon size={28} className="opacity-60 shrink-0" />
            <div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs opacity-60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded shadow-md ${card}`}>
        <div className="flex items-center gap-2 mb-3">
          <LayoutTemplate size={16} className="opacity-60" />
          <h2 className="text-sm font-semibold">Home Page Pillars</h2>
        </div>
        {pillars.length === 0 ? (
          <p className="text-xs opacity-50">No pillars found.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className={`p-3 rounded ${inner}`}
              >
                <p className="font-medium text-sm">{pillar.title ?? pillar.id}</p>
                {pillar.description && (
                  <p className="text-xs opacity-60 mt-0.5">{pillar.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
