"use client";
import { Trash2, Pen } from "lucide-react";
import { Reagent } from "./ReagentsControl";
import { fetchWithAuth } from "@/lib/api";
const API = process.env.NEXT_PUBLIC_BASE_URL;
export const card = " shadow-gray-400";
export const input = "inset-shadow-gray-300";
export const inner = "bg-white";
export const ReagentsListItem = ({ prop }: { prop: Reagent }) => {
  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`/reagents/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div key={prop.id} className={`grid grid-cols-13 p-2 rounded ${inner}`}>
        <div className="col-span-3 flex min-w-1/3 flex-col gap-2">
          <p className="font-medium text-sm">{prop.name_en}</p>
          <p className="font-medium text-sm">{prop.name_mn}</p>
        </div>
        <div className="col-span-2">{prop.categoryId}</div>
        <div className="col-span-2">{prop.catalogNo}</div>
        <div className="col-span-3  flex flex-col gap-2 text-sm font-semibold">
          <p className="text-blue-500 px-1 rounded-xl bg-blue-100 w-fit">{prop.methodology_en}</p>
          <p className="text-tg-green px-1 rounded-xl bg-green-100 w-fit">{prop.methodology_mn}</p>
        </div>
        <div className="col-span-2">{prop.packageSize}</div>
        <div className="w-full flex justify-end col-span-1">
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={() => handleDelete(prop.id)}
              className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              <Trash2 size={16} />
            </button>
            <button className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200">
              <Pen size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
