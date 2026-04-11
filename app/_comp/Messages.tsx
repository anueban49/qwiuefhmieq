"use client";
import { useEffect, useState } from "react";
import { useData, Contact } from "./context/DataProvider";
import { useContent } from "./context/ContentProvider";
import {  Copy, Trash2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
export const Messages = () => {
  const { messages } = useData();
  const [msgs, setMsgs] = useState<Contact[]>([]);
  const { lang } = useContent();
  useEffect(() => {
    setMsgs(messages);
    console.log(messages);
  }, [messages]);

  const handleDelete = async (id: string) => {
    try {
      const res = fetchWithAuth(`/contact${id}`, {
        method: "DELETE",
      });
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="w-full h-full p-2 flex flex-col gap-2 rounded shadow-sm shadow-gray-300 ">
      <h1 className="text-xl font-semibold p-3">
        {lang === "EN" ? <>Message requests</> : <>Хүсэлтүүд</>} (
        {messages.length})
      </h1>
      <div className="w-full p-3 grid grid-cols-5 text-lg font-bold text-tg-blue-dark shadow-sm shadow-zinc-300 rounded">
        <span className="col-span-1">
          {lang === "EN" ? <>Sender</> : <>Илгээгч</>}
        </span>
        <span className="col-span-1">
          {lang === "EN" ? <>Organization</> : <>Байгууллага</>}
        </span>
        <span className="col-span-1">
          {lang === "EN" ? <>Message</> : <>Мессеж</>}
        </span>
        <span className="col-span-1">
          {lang === "EN" ? <>Date</> : <>Огноо</>}
        </span>
        <span className="col-span-1 w-full flex justify-end px-5">
          {lang === "EN" ? <>Actions</> : <>Үйлдэл</>}
        </span>
      </div>
      {msgs.map((m, i) => (
        <div
          key={i}
          className="w-full p-2 grid grid-cols-5 shadow-sm shadow-zinc-300 rounded"
        >
          <div className="col-span-1 flex flex-col gap-2 p-2">
            <span className="flex items-center gap-1">
              <p className="text-xs text-gray-400">
                {lang === "EN" ? <>Name</> : <>Нэр</>}
              </p>
              {m.name}
            </span>
            <span className="flex items-center gap-1">
              <p className="text-xs text-gray-400">
                {lang === "EN" ? <>Email</> : <>Мэйл хаяг</>}
              </p>
              {m.email}
            </span>
          </div>
          <div className="col-span-1">{m.organization}</div>
          <div className="col-span-1">{m.message}</div>
          <div className="col-span-1">{m.createdAt.toString()}</div>
          <div className="col-span-1 w-full flex justify-end p-2 gap-2">
            <button
              onClick={() => handleDelete(m.id)}
              className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              <Trash2 size={16} />
            </button>
            <button className="aspect-square rounded hover:text-gray-300">
              <Copy size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
