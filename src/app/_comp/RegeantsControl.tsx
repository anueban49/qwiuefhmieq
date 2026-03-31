"use client";
import { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext";
import { Image, X, Trash2, Pen, Search, Plus, Minus } from "lucide-react";

const API = "http://localhost:5000/api";

export type Reagent = {
  catalogNo: string;
  id: string;
  categoryId: string;
  name: string;
  methodology: string;
  packageSize: string;
};

export function RegeantsControl() {
  const [loading, setLoading] = useState(false);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [dataloading, setDataloading] = useState(false);
  const { theme } = useTheme();
  const [collapse, setCollapse] = useState(false);

  const [form, setForm] = useState({
    catalogNo: "",
    categoryId: "",
    name: "",
    id: "",
    methodology: "",
    packageSize: "",
  });

  const card =
    theme === "dark"
      ? "bg-zinc-700 shadow-black"
      : "bg-gray-200 shadow-gray-400";
  const input =
    theme === "dark" ? "inset-shadow-black" : "inset-shadow-gray-300";
  const inner = theme === "dark" ? "bg-zinc-600" : "bg-white";

  useEffect(() => {
    setDataloading(true);
    fetch(`${API}/reagents`)
      .then((r) => r.json())
      .then((data) => setReagents(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setDataloading(false));
  }, []);
  console.log("dataloading", dataloading);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API}/reagents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      setReagents((prev) => [...prev, created]);
      setForm({
        catalogNo: "",
        categoryId: "",
        name: "",
        id: "",
        methodology: "",
        packageSize: "",
      });
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

  const formFields = [
    { key: "catalogNo", label: "Catalog No", type: "text" },
    { key: "categoryId", label: "Category", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "id", label: "id", type: "text" },
    { key: "methodology", label: "Methology", type: "text" },
    { key: "packageSize", label: "Package Size", type: "text" },
  ];

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex justify-between p-2`}>
        <h2 className="text-sm font-semibold  p-3">
          Reagents ({reagents.length})
        </h2>
        <div className="flex items-center gap-2 ease-in-out duration-300">
          <input placeholder="Search" className="p-2 rounded" />
          <button
            className={`p-2 aspect-square rounded-full shadow-sm ${theme === "dark" ? "hover:shadow-zinc-900" : "hover:shadow-zinc-300"}`}
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {dataloading ? (
        <div className="aspect-5/2 w-full flex items-center justify-center">
          Loading
        </div>
      ) : (
        <>
          {reagents.length > 0 && (
            <div className={`${card}`}>
              <div
                className={`w-full px-8 grid grid-cols-10 p-2 rounded text-bold  z-99 shadow-sm ${inner} ${theme === "dark" ? "shadow-black" : "shadow-zinc-300"}`}
              >
                <div className="col-span-3 ">Title</div>
                <div className="col-span-2 ">Catalog Number</div>
                <div className="col-span-3 ">Methodology</div>
                <div className="col-span-2 ">Package Size</div>
              </div>
              <div
                className={`p-4 rounded shadow-md max-h-[50vh] overflow-y-scroll`}
              >
                <div className="flex flex-col gap-2">
                  {reagents.map((reagent) => (
                    <div
                      key={reagent.id}
                      className={`grid grid-cols-10 p-2 rounded ${inner}`}
                    >
                      <div className="col-span-3 flex items-center gap-3 min-w-1/3">
                        <div>
                          <p className="font-medium text-sm">{reagent.name}</p>
                          <p className="text-xs opacity-60">ID: {reagent.id}</p>
                        </div>
                      </div>
                      <div className="col-span-2">{reagent.catalogNo}</div>
                      <div className="col-span-3">{reagent.methodology}</div>
                      <div>{reagent.packageSize}</div>
                      <div className="w-full flex justify-end">
                        <button
                          onClick={() => handleDelete(reagent.id)}
                          className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors duration-200">
                          <Pen size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div className={`ease-in-out duration-500`}>
        {collapse ? (
          <div
            className={`h-fit px-5 py-2 flex flex-col gap-2 rounded shadow-md ease-in-out duration-500 ${card}`}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center ">
                <h1 className="font-semibold">Add Reagent</h1>
                <button
                  onClick={() => {
                    setCollapse(false);
                  }}
                >
                  <Minus />
                </button>
              </div>

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
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
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
        ) : (
          <>
            <div
              onClick={() => setCollapse(true)}
              className={`h-16 ease-in-out duration-500 w-full rounded flex justify-between py-2 px-5 shadow-md ${card}`}
            >
              <h2 className="font-bold">Add Reagent</h2>
              <button>
                <Plus />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
