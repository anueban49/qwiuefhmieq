"use client";
import { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext";
import { Image, X, Trash2 } from "lucide-react";

const API = "http://localhost:5000/api";

type Reagent = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

export function RegeantsControl() {
  const [loading, setLoading] = useState(false);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [preview, setPreview] = useState<string>("");
  const { theme } = useTheme();
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const card =
    theme === "dark"
      ? "bg-zinc-700 shadow-black"
      : "bg-gray-200 shadow-gray-400";
  const input =
    theme === "dark" ? "inset-shadow-black" : "inset-shadow-gray-300";
  const inner = theme === "dark" ? "bg-zinc-600" : "bg-white";

  useEffect(() => {
    fetch(`${API}/reagents`)
      .then((r) => r.json())
      .then((data) => setReagents(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API}/reagents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl: preview || form.imageUrl }),
      });
      const created = await res.json();
      setReagents((prev) => [...prev, created]);
      setForm({ categoryId: "", name: "", description: "", price: "", imageUrl: "" });
      setPreview("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/reagents/${id}`, { method: "DELETE" });
      setReagents((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const formFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "price", label: "Price", type: "number" },
  ];

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`p-5 flex flex-col gap-2 rounded shadow-md ${card}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="font-semibold">Add Reagent</h1>
          {formFields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium">{field.label}</label>
              <input
                required
                type={field.type}
                className={`inset-shadow-2xs mt-1 w-full rounded-md px-3 py-2 bg-background ${input}`}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              required
              className="mt-1 w-full rounded-md px-3 py-2 bg-background cursor-pointer focus:outline-none"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="instrument">Instrument</option>
              <option value="reagent">Reagent</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Image</label>
            {preview ? (
              <div className="w-full rounded aspect-5/2 relative">
                <button
                  type="button"
                  onClick={() => setPreview("")}
                  className={`aspect-square rounded-full p-2 flex items-center justify-center absolute z-10 ${theme === "dark" ? "" : "bg-white"}`}
                >
                  <X size={16} />
                </button>
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 w-full object-cover rounded-md"
                />
              </div>
            ) : (
              <div
                className={`w-full aspect-5/2 rounded inset-shadow-xs relative ${theme === "dark" ? "inset-shadow-black bg-zinc-700" : "inset-shadow-gray-300 bg-white"}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 m-auto w-fit h-fit pointer-events-none">
                  <Image color="gray" />
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md px-4 py-2 font-medium shadow-sm hover:shadow-none ease-in-out duration-300 ${card}`}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {reagents.length > 0 && (
        <div className={`p-4 rounded shadow-md ${card}`}>
          <h2 className="text-sm font-semibold mb-3">
            Reagents ({reagents.length})
          </h2>
          <div className="flex flex-col gap-2">
            {reagents.map((reagent) => (
              <div
                key={reagent.id}
                className={`flex items-center justify-between p-2 rounded ${inner}`}
              >
                <div className="flex items-center gap-3">
                  {reagent.imageUrl && (
                    <img
                      src={reagent.imageUrl}
                      alt={reagent.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-sm">{reagent.name}</p>
                    <p className="text-xs opacity-60">
                      {reagent.description} · ${reagent.price}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(reagent.id)}
                  className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
