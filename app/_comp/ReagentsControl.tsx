"use client";
import { useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { ReagentsListItem } from "./ReagentsListItem";
import AddReagent from "./AddReagent";
import { useData } from "./context/DataProvider";
import { Methodology } from "./AddReagent";
import { useContent } from "./context/ContentProvider";
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
  const { reagents, loading: dataloading } = useData();
  const { lang } = useContent();
  const cats = useMemo(
    () => [
      ...new Set<string>(
        reagents
          .map((d) => d.categoryId?.trim())
          .filter((c): c is string => !!c),
      ),
    ],
    [reagents],
  );

  const methods: Methodology[] = useMemo(() => {
    const seen = new Set<string>();
    return reagents.reduce<Methodology[]>((acc, d) => {
      const key = `${d.methodology_en}|${d.methodology_mn}`;
      if (!seen.has(key) && d.methodology_en) {
        seen.add(key);
        acc.push({
          methodology_en: d.methodology_en,
          methodology_mn: d.methodology_mn ?? "",
        });
      }
      return acc;
    }, []);
  }, [reagents]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex justify-between p-2`}>
        <h2 className="text-xl font-semibold p-3">
          {lang === "EN" ? <>Reagents</> : <>Урвалж</>} ({reagents.length})
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
          {lang === "EN" ? <>Loading...</> : <>Ачаалж байна...</>}
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
                <div className="col-span-3">
                  {lang === "EN" ? <>Name</> : <>Нэр</>}
                </div>
                <div className="col-span-2">
                  {lang === "EN" ? <>Category</> : <>Категори</>}
                </div>
                <div className="col-span-2">
                  {lang === "EN" ? <>Catalog No.</> : <>Каталог дугаар</>}
                </div>
                <div className="col-span-3">
                  {lang === "EN" ? <>Methodology</> : <>Метолог</>}
                </div>
                <div className="col-span-2">
                  {lang === "EN" ? <>Package Size</> : <>Савлагаа</>}
                </div>
                <div className="col-span-1 w-full h-full flex justify-end">
                  {lang === "EN" ? <>Actions</> : <>Категори</>}
                </div>
              </div>
              <div className="p-4 rounded shadow-md max-h-full overflow-y-scroll">
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
