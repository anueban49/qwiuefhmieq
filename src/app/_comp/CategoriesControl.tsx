"use client";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const API = "http://localhost:5000/api";

type Category = { id: string; name: string; type: string };

export function CategoriesControl() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", type: "" });
  const card = " -200 shadow-gray-400";
  const input = "inset-shadow-gray-300";
  const inner = "bg-white";

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setForm({ name: "", type: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`p-5 rounded shadow-md ${card}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="font-semibold">Add Category</h1>
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              required
              className={`inset-shadow-2xs mt-1 w-full rounded-md px-3 py-2 bg-background ${input}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              required
              className="mt-1 w-full rounded-md px-3 py-2 bg-background cursor-pointer focus:outline-none"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="instrument">Instrument</option>
              <option value="reagent">Reagent</option>
            </select>
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

      {categories.length > 0 && (
        <div className={`p-4 rounded shadow-md ${card}`}>
          <h2 className="text-sm font-semibold mb-3">
            Categories ({categories.length})
          </h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center justify-between p-2 rounded ${inner}`}
              >
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs opacity-60 capitalize">{cat.type}</p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
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
