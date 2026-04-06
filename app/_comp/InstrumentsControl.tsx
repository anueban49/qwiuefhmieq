"use client";
import { Search, Filter } from "lucide-react";
import { InstrumentListItem } from "./InstrumentListItem";
import AddInstrument from "./AddInstrument";
import { useData } from "./context/DataProvider";
import { useContent } from "./context/ContentProvider";

export const InstrumentsControl = () => {
  const { instruments, loading: dataloading } = useData();
  const { lang } = useContent();
  const card = "shadow-gray-300";
  const inner = "bg-white";

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex justify-between p-2`}>
        <h2 className="text-xl font-semibold p-3">
          {lang === "EN" ? <>Instruments</> : <>Төхөөрөмжүүд</>} (
          {instruments.length})
        </h2>
        <div className="flex items-center gap-2 ease-in-out duration-300">
          <input placeholder="Search" className="p-2 rounded" />
          <button className="p-2 aspect-square rounded-full shadow-sm hover:shadow-zinc-300">
            <Search size={16} />
          </button>
          <AddInstrument />
        </div>
      </div>

      {dataloading ? (
        <div className="aspect-5/2 w-full flex items-center justify-center">
          {lang === "EN" ? <></> : <>Ачаалж байна...</>}
        </div>
      ) : (
        <>
          <div className="w-full flex items-end">
            <button
              onClick={() => {}}
              className=" flex gap-2 items-center justify-center text-sm ease-in-out duration-300 rounded-full p-2 aspect-square"
            >
              <Filter size={16} />
            </button>
          </div>
          {instruments.length > 0 && (
            <div className={`${card}`}>
              <div
                className={`w-full px-8 grid grid-cols-7 p-2 rounded font-bold text-tg-blue-dark z-99 shadow-sm shadow-zinc-300 ${inner}`}
              >
                <div className="col-span-1">
                  {lang === "EN" ? <>ID</> : <>ID</>}
                </div>
                <div className="col-span-3">
                  {lang === "EN" ? <>Name</> : <>Нэр</>}
                </div>
                <div className="col-span-2">
                  {lang === "EN" ? <>Category</> : <>Категори</>}
                </div>


                <div className="col-span-1">
                  <div className="w-full flex justify-end">
                    {lang === "EN" ? <>Actions</> : <>Үйлдэл</>}
                  </div>
                </div>
              </div>
              <div className="p-4 rounded shadow-md max-h-full overflow-y-scroll">
                <div className="flex flex-col gap-2">
                  {instruments.map((inst, i) => (
                    <InstrumentListItem props={inst} key={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
