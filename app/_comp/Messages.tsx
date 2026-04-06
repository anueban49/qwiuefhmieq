"use client";
import { useEffect, useState } from "react";
import { useData, Contact } from "./context/DataProvider";
export const Messages = () => {
  const { messages } = useData();
  const [msgs, setMsgs] = useState<Contact[]>([]);
  useEffect(() => {
    setMsgs(messages);
    console.log(messages);
  }, [messages]);
  return (
    <div className="w-full h-full p-2 flex flex-col gap-2 ">
      <h1 className="text-xl font-semibold p-3">
        Message requests ({messages.length})
      </h1>
      <div className="w-full p-2 grid grid-cols-5 text-lg font-bold text-tg-blue-dark">
        <span className="col-span-1">Sender</span>
        <span className="col-span-1">Name</span>
        <span className="col-span-1">Name</span>
        <span className="col-span-1">Name</span>
      </div>
      {msgs.map((m, i) => (
        <div key={i} className="w-full p-2 grid grid-cols-5">
          <div className="col-span-1 flex flex-col gap-2 p-2">
            <span>{m.name}</span>
            <span>{m.email}</span>
          </div>
          <div className="col-span-1">{m.email}</div>
        </div>
      ))}
    </div>
  );
};
