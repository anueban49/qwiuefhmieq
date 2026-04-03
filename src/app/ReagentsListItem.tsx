"use client";
import { Trash2, Pen } from "lucide-react";
export type Reagent = {
  catalogNo: string;
  id: string;
  categoryId: string;
  name: string;
  methodology: string;
  packageSize: string;
};
const API = "http://localhost:5000/api";
export const card = " shadow-gray-400";
export const input = "inset-shadow-gray-300";
export const inner = "bg-white";
export const ReagentsListItem = ({ prop }: { prop: Reagent }) => {
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/reagents/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div key={prop.id} className={`grid grid-cols-13 p-2 rounded ${inner}`}>
        <div className="col-span-3 flex items-center gap-3 min-w-1/3">
          <p className="font-medium text-sm">{prop.name}</p>
        </div>
        <div className="col-span-2">{prop.categoryId}</div>
        <div className="col-span-2">{prop.catalogNo}</div>
        <div className="col-span-3">{prop.methodology}</div>
        <div className="col-span-2">{prop.packageSize}</div>
        <div className="w-full flex justify-end col-span-1">
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
    </>
  );
};
