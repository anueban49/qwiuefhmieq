"use client";
import { ChevronRight, Eclipse, Moon } from "lucide-react";
import { useTheme } from "./_comp/context/ThemeContext";
import { useState } from "react";
export default function Page() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [btndisabled, setBtndisabled] = useState(true);
  const [form, setForm] = useState({
    id: "",
    password: "",
  });

  const handleClick = async () => {
    try {
      setBtndisabled(true);

      setLoading(true);

      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={` ${theme === "dark" ? "bg-zinc-700" : "bg-gray-100"} w-full h-screen  flex flex-col justify-center items-center transition-all duration-300`}
    >
      <div
        className={`flex flex-col w-fit h-fit gap-3 rounded-xl shadow-sm p-5 ${theme === "dark" ? "shadow-black" : "shadow-gray-300"}`}
      >
        <div className={`flex gap-2 justify-between items-center`}>
          <div className="flex gap-2 items-center">
            <img src="/icon.ico" className={`max-w-5 aspect-square max-h-5`} />
            <p className={`text-2xl font-bold text-green-500`}>
              Admin Interface
            </p>
          </div>
          <button
            onClick={() => {
              toggleTheme();
            }}
            className={`rounded-full aspect-square p-2 shadow-sm ${theme === "dark" ? "shadow-black" : "shadow-zinc-300"}`}
          >
            {theme === "dark" ? <Eclipse /> : <Moon />}
          </button>
        </div>
        <div className={``}>
          <h1 className={`text-2xl font-bold `}>Welcome back!</h1>
          <p className={`text-zinc-500`}>
            Log in to access to gain access to webpage control
          </p>
        </div>

        <div
          className={`w-full flex flex-col gap-3 rounded-xl p-5 ${theme === "dark" ? "shadow-black" : "shadow-gray-300"}`}
        >
          <form className={`flex flex-col gap-3`} onSubmit={handleClick}>
            <input
              className={`inset-shadow-xs  px-2 py-1 rounded ${theme === "dark" ? "bg-zinc-600 inset-shadow-black" : "bg-zinc-300 inset-shadow-zinc-500"}`}
              placeholder="email"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
            <input
              className={`inset-shadow-xs px-2 py-1 rounded ${theme === "dark" ? "bg-zinc-600 inset-shadow-black" : "bg-zinc-300 inset-shadow-zinc-500"}`}
              placeholder="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className={`rounded-2xl p-2 flex gap-2 items-center justify-center ${theme === "dark" ? "bg-zinc-400 " : "bg-gray-200"}`}
            >
              Proceed <ChevronRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
