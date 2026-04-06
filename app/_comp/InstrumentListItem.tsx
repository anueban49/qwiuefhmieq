"use client";
import {
  Trash2,
  Pen,
  ChevronRight,
  ChevronDown,
  Image,
} from "lucide-react";
import { useState } from "react";
import { useData } from "./context/DataProvider";
import { EditInstrumentDialog } from "./AddInstrument";
export type Feature = { title: string; description: string };
export type Spec = { parameter: string; value: string };
import { Instrument } from "./InstrumentsControl";
const inner = "bg-white";
export type LangType = "EN" | "MN";
export const InstrumentListItem = ({ props }: { props: Instrument }) => {
  const { deleteInstrument } = useData();
  const [lang, setLang] = useState("EN");
  const [expand, setExpand] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const switchLang = () => {
    setLang((prev) => (prev === "EN" ? "MN" : "EN"));
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
          <div className="col-span-3 flex justify-center text-sm flex-col gap-2">
            <p>{props.name_en}</p>
            <p>{props.name_mn}</p>
          </div>
          <div className="col-span-2 flex items-center text-sm">
            <p className="rounded-xl px-2 py-1 bg-green-100 text-green-800 text-sm font-bold ">
              {props.categoryId}
            </p>
          </div>

          <div className="col-span-1 w-full flex justify-end items-center">
            <button
              onClick={() => deleteInstrument(props.id)}
              className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              <Trash2 size={16} />
            </button>
            <button onClick={() => setEditOpen(true)} className="p-1 rounded hover:bg-cyan-500 hover:text-white transition-colors duration-200">
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
            <div className="flex gap-2 p-2 relative">
              <button
                onClick={() => {
                  switchLang();
                }}
                className="absolute top-3 right-4 p-1 text-xs font-bold text-white bg-tg-blue-dark shrink-0 rounded-2xl w-8 aspect-square"
              >
                {lang === "EN" ? "MN" : "EN"}
              </button>
              {props.imageData ? (
                <>
                  <img
                    src={`data:${props.imageData.type};base64,${btoa(String.fromCharCode(...props.imageData.data))}`}
                    alt={props.name_en}
                    className="rounded w-1/4 aspect-square bg-white shadow-xs shadow-tg-subgreen"
                  />
                </>
              ) : (
                <div className="bg-blue-300/50 rounded flex justify-center items-center">
                  <Image />
                </div>
              )}
              {/*  */}
              {lang === "EN" ? (
                <>
                  
                  <div className="w-3/8 flex flex-col text-sm rounded bg-white p-2 shadow-xs shadow-tg-subgreen ">
                    <p className="font-bold">Features</p>
                    {props?.features_en.map((f, i) => (
                      <div className="w-full flex flex-col p-2 gap-2" key={i}>
                        <p className="text-xs font-bold text-tg-blue">
                          -{f.title}
                        </p>
                        {f.description}
                      </div>
                    ))}
                  </div>
                  <div className="w-3/8 flex flex-col text-sm rounded bg-white p-2 shadow-xs shadow-tg-subgreen">
                    <p className="font-bold">Specifications</p>
                    {props?.specs_en.map((s, i) => (
                      <div key={i} className="w-full flex flex-col p-2 gap-2">
                        <p className="text-xs font-bold text-tg-blue">
                          -{s.parameter}
                        </p>
                        {s.value}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-3/8 flex flex-col text-sm rounded bg-white p-2 shadow-xs shadow-tg-subgreen ">
                    <p className="font-bold">Features</p>
                    {props?.features_mn?.map((f, i) => (
                      <div className="w-full flex flex-col p-2 gap-2" key={i}>
                        <p className="text-xs font-bold text-tg-blue">
                          -{f.title}
                        </p>
                        {f.description}
                      </div>
                    ))}
                  </div>
                  <div className="w-3/8 flex flex-col text-sm rounded bg-white p-2 shadow-xs shadow-tg-subgreen">
                    <p className="font-bold">Specifications</p>
                    {props?.specs_mn?.map((s, i) => (
                      <div key={i} className="w-full flex flex-col p-2 gap-2">
                        <p className="text-xs font-bold text-tg-blue">
                          -{s.parameter}
                        </p>
                        {s.value}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <EditInstrumentDialog open={editOpen} onClose={() => setEditOpen(false)} instrument={props} />
    </>
  );
};
