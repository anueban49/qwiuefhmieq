"use client";
import { ChevronRight, ShieldCog } from "lucide-react";
import { useState } from "react";
import { Shield } from "lucide-react";
import { fetchWithAuth } from "./lib/api";
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [btndisabled, setBtndisabled] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("send payload:", form);
    try {
      setBtndisabled(true);
      setLoading(true);
      fetchWithAuth(`/auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((r) => r.json())
        .then((data) =>
          localStorage.setItem("accessToken", data.access_token as any),
        )
        .catch(console.error)
        .finally(() => setLoading(false));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col justify-center items-center transition-all duration-300">
      <div className="flex flex-col w-fit h-fit gap-3 rounded-xl bg-white p-5">
        <div className="w-full h-fit flex flex-col gap-3 items-center">
          {" "}
          <div className="flex justify-center bg-tg-green/10 items-center rounded-md aspect-square p-2 w-12">
            <ShieldCog color={"#00A89F"} size={30} strokeWidth={1.5} />
          </div>
          <p className="text-tg-green text-2xl font-bold">BioSystems Admin</p>
          <p className="text-zinc-500">
            Log in to access to gain access to webpage control
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 rounded-xl p-5 shadow-gray-300">
          <form className="flex flex-col gap-3" onSubmit={handleClick}>
            <label>Username</label>
            <input
              className=" px-2 py-1 rounded border-tg-green border"
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <label>Password</label>
            <input
              className=" px-2 py-1 rounded border-tg-green border "
              placeholder="password"
              value={form.password}
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl p-2 flex gap-2 items-center justify-center bg-tg-green text-white ease-in-out duration-300 hover:bg-tg-green-light"
            >
              Proceed <ChevronRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
