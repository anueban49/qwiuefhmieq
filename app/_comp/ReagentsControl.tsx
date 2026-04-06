"use client";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { ReagentsListItem } from "./ReagentsListItem";
import AddReagent from "./AddReagent";
import { fetchWithAuth } from "@/lib/api";
import { Methodology } from "./AddReagent";
const API = process.env.NEXT_PUBLIC_BASE_URL;
console.log(API);

export type Reagent = {
  catalogNo: string;
  id: string;
  categoryId: string;
  name_en: string;
  name_mn?: string;
  methodology_mn?: string;
  methodology_en?: string;
  packageSize: string;
};
export type SortType = "Methodology" | "A-Z" | "Category";
export const card = " shadow-gray-400";
export const input = "inset-shadow-gray-300";
export const inner = "bg-white";
export function ReagentsControl() {
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [dataloading, setDataloading] = useState(false);
  const [cats, setCats] = useState<string[]>([]);
  const [methods, setMethods] = useState<Methodology[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setDataloading(true);
    fetchWithAuth(`/reagents`)
      .then((r) => r.json())
      .then((data) => {
        setReagents(Array.isArray(data) ? data : []);
        setCats([
          ...new Set<string>(
            data
              .map((d: Reagent) => d.categoryId?.trim()) 
              .filter((c: string): c is string => !!c),
          ),
        ]);
        setMethods([
          ...new Set<Methodology>(
            data.map((d: Reagent) => ({
              methodology_en: d.methodology_en,
              methodology_mn: d.methodology_mn,
            })),
          ),
        ]);
      })
      .catch(console.error)
      .finally(() => setDataloading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex justify-between p-2`}>
        <h2 className="text-xl font-semibold p-3">
          Reagents ({reagents.length})
        </h2>
        <div className="flex items-center gap-2 ease-in-out duration-300">
          <input placeholder="Search" className="p-2 rounded" />
          <button className="p-2 aspect-square rounded-full shadow-sm hover:shadow-zinc-300">
            <Search size={16} />
          </button>
          <AddReagent categoryId={cats as string[]} methodology={methods} />
        </div>
      </div>

      {dataloading ? (
        <div className="aspect-5/2 w-full flex items-center justify-center">
          Loading
        </div>
      ) : (
        <>
          <div className="w-full flex items-end">
            <button
              onClick={() => {}}
              className="flex gap-2 items-center justify-center text-sm ease-in-out duration-300 rounded-full p-2 aspect-square"
            >
              <Filter size={16} />
            </button>
          </div>
          {reagents.length > 0 && (
            <div className={`${card}`}>
              <div
                className={`w-full px-8 grid grid-cols-13 p-2 font-semibold text-tg-blue-dark rounded text-bold z-99 shadow-sm shadow-zinc-300 ${inner}`}
              >
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Catalog No.</div>
                <div className="col-span-3">Methodology</div>
                <div className="col-span-2">Package Size</div>
                <div className="col-span-1 w-full h-full flex justify-end">
                  Actions
                </div>
              </div>
              <div className="p-4 rounded shadow-md max-h-fulloverflow-y-scroll">
                <div className="flex flex-col gap-2">
                  {reagents.map((reagent, i) => (
                    <ReagentsListItem key={i} prop={reagent} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
