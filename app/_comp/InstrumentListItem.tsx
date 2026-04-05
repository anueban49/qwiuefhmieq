"use client";
//unit item for list -> that expands to show detailed infos and such.
import {
  Filter,
  Trash2,
  BadgeInfoIcon,
  Pen,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
export type Feature = { title: string; description: string };
export type Spec = { parameter: string; value: string };
export type Instrument = {
  id: string;
  categoryId: string;
  methodTag: string;
  name: string;
  description: string;
  imageUrl: string;
  fullDescription: string;
  features: Feature[];
  specs: Spec[];
};
const card = "bg-tg-subgreen shadow-gray-400";
const input = "inset-shadow-gray-300";
const inner = "bg-white";
const API =  process.env.NEXT_PUBLIC_BASE_URL;

export const InstrumentListItem = ({ props }: { props: Instrument }) => {
  const [expand, setExpand] = useState(false);
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/instruments/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };
  const toggleExpand = () => {
    setExpand((prev) => !prev);
  };
  return (
    <>
      <div className="flex flex-col gap-2 transition-all ease-in-out duration-300 bg-white rounded">
        <div key={props.id} className={`grid grid-cols-7 p-2 rounded ${inner}`}>
          <div className="col-span-1 flex items-center gap-3">
            <p className="font-medium text-sm">{props.id}</p>
          </div>
          <div className="col-span-2 flex items-center text-sm">
            {props.name}
          </div>
          <div className="col-span-2 flex items-center text-sm">
            {props.categoryId}
          </div>
          <div className="col-span-1 flex items-center text-sm">
            {props.methodTag}
          </div>

          <div className="col-span-1 w-full flex justify-end items-center">
            <button
              onClick={() => handleDelete(props.id)}
              className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              <Trash2 size={16} />
            </button>
            <button className="p-1 rounded hover:bg-cyan-500 hover:text-white transition-colors duration-200">
              <Pen size={16} />
            </button>

            <button
              className="p-1 rounded hover:bg-tg-subgreen hover:text-white transition-all ease-in-out duration-200"
              onClick={() => {
                toggleExpand();
              }}
            >
              {expand ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
        {expand && (
          <>
            <div className="flex gap-2 p-2">
              <img
                src={props.imageUrl}
                alt={props.name}
                className="rounded w-1/4 aspect-square bg-white shadow-xs shadow-tg-subgreen"
              />
              <div className="w-3/8 flex flex-col text-sm rounded bg-white p-2 shadow-xs shadow-tg-subgreen ">
                <p className="font-bold">Features</p>
                {props?.features.map((f, i) => (
                  <div className="w-full flex flex-col p-2 gap-2" key={i}>
                    <p className="text-xs font-bold text-tg-blue">-{f.title}</p>
                    {f.description}
                  </div>
                ))}
              </div>
              <div className="w-3/8 flex flex-col text-sm rounded bg-white p-2 shadow-xs shadow-tg-subgreen">
                <p className="font-bold">Specifications</p>
                {props?.specs.map((s, i) => (
                  <div key={i} className="w-full flex flex-col p-2 gap-2">
                    <p className="text-xs font-bold text-tg-blue">
                      -{s.parameter}
                    </p>
                    {s.value}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
