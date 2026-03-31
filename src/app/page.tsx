"use client";
import { useTheme } from "./_comp/context/ThemeContext";
import { useState } from "react";
export default function Page() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    password: "",
  });

  const handleClick = async () => {
    try {
      setLoading(true);
      localStorage.setItem("savedEIUfbiu", JSON.stringify(form));
      console.log(form);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full h-screen  flex flex-col justify-center items-center">
      <div
        className={`flex flex-col gap-3 rounded-xl shadow-md p-5 ${theme === "dark" ? "shadow-black" : "shadow-gray-300"}`}
      >
        <h1 className={`text-2xl font-bold `}>Welcome back!</h1>
        <p className={`text-zinc-500`}>
          Log in to access to gain access to webpage control
        </p>
        <div
          className={`w-full flex flex-col gap-3 rounded-xl shadow-md p-5 ${theme === "dark" ? "shadow-black" : "shadow-gray-300"}`}
        >
          <form className={`flex flex-col gap-3`} onSubmit={handleClick}>
            <input
              placeholder="id"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
            <input
              placeholder="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" disabled={loading}>
              proceed
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
