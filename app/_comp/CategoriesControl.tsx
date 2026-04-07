"use client";
import { Trash2, Search, Filter } from "lucide-react";
import AddCategory from "./AddCategory";
import { useData } from "./context/DataProvider";
import { useContent } from "./context/ContentProvider";
import { useMemo, useState } from "react";
const card = " shadow-gray-400";
export const inner = "bg-white";

export function CategoriesControl() {
  const { categories, loading: dataloading, deleteCategory } = useData();
  const { lang } = useContent();
  const [searchvalue, setSearchValue] = useState("");

  const filtered = useMemo(() => {
    const lowerQuery = searchvalue.trim().toLowerCase();
    if (!lowerQuery) {
      return categories;
    }
    return categories.filter(
      (c) =>
        c.title_en.toLowerCase().includes(lowerQuery) ||
        c.title_mn.toLowerCase().includes(lowerQuery) ||
        c.id.toLowerCase().includes(lowerQuery),
    );
  }, [searchvalue, categories]);
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex justify-between p-2`}>
        <h2 className="text-xl font-semibold p-3">
          {lang === "EN" ? <>Categories</> : <>Категори</>} ({categories.length}
          )
        </h2>
        <div className="flex items-center gap-2 ease-in-out duration-300">
          <input
            placeholder={lang === "EN" ? "Search" : "Хайх"}
            className="p-2 rounded"
            value={searchvalue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <AddCategory />
        </div>
      </div>

      {dataloading ? (
        <div className="aspect-5/2 w-full flex items-center justify-center">
          {lang === "EN" ? <>Loading...</> : <>Ачаалж байна...</>}
        </div>
      ) : (
        <>
          <div className="w-full flex items-end"></div>
          {filtered.length > 0 && (
            <div className={`${card}`}>
              <div
                className={`w-full px-8 grid grid-cols-4 p-2 font-semibold text-tg-blue-dark rounded z-99 shadow-sm shadow-zinc-300 ${inner}`}
              >
                <div className="col-span-1">
                  {lang === "EN" ? <>ID</> : <>ID</>}
                </div>
                <div className="col-span-1">
                  {lang === "EN" ? <>Name</> : <>Нэр</>}
                </div>
                <div className="col-span-1">
                  {lang === "EN" ? <>Bullets</> : <>Дэд Сэдэв</>}
                </div>
                <div className="col-span-1 w-full h-full flex justify-end">
                  {lang === "EN" ? <>Actions</> : <>Үйлдэл</>}
                </div>
              </div>
              <div className="p-4 rounded shadow-md h-full overflow-y-scroll">
                <div className="flex flex-col gap-2">
                  {filtered.map((cat) => (
                    <div
                      key={cat.id}
                      className={`w-full px-8 grid grid-cols-4 p-2 rounded items-center ${inner}`}
                    >
                      <div className="w-full col-span-1 font-medium text-sm">
                        {cat.id}
                      </div>
                      <div className="col-span-1 text-sm flex flex-col gap-2">
                        <p> {cat.title_en}</p>
                        <p>{cat.title_mn}</p>
                      </div>
                      <div className="col-span-1 text-sm opacity-60 flex flex-col gap-2">
                        {(lang === "MN" ? cat.bullets_mn : cat.bullets_en)?.map(
                          (b) => <p key={b}>{b}</p>,
                        ) ?? <>-:-</>}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
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
