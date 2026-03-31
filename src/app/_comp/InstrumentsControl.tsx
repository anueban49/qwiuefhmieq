"use client";
import { useState, useEffect } from "react";
import { Image, X, Trash2, Pen, Search, Plus, Minus } from "lucide-react";

const API = "http://localhost:5000/api";

type Instrument = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

const InstrumentsControl = () => {
  const [loading, setLoading] = useState(false);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [preview, setPreview] = useState<string>("");
  const [dataloading, setDataloading] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const card = "bg-tg-subgreen shadow-gray-400";
  const input = "inset-shadow-gray-300";
  const inner = "bg-white";

  useEffect(() => {
    setDataloading(true);
    fetch(`${API}/instruments`)
      .then((r) => r.json())
      .then((data) => setInstruments(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setDataloading(false));
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API}/instruments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl: preview || form.imageUrl }),
      });
      const created = await res.json();
      setInstruments((prev) => [...prev, created]);
      setForm({
        categoryId: "",
        name: "",
        description: "",
        price: "",
        imageUrl: "",
      });
      setPreview("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/instruments/${id}`, { method: "DELETE" });
      setInstruments((prev) => prev.filter((i) => i.id !== id));
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
      <div className={`flex justify-between p-2`}>
        <h2 className="text-sm font-semibold p-3">
          Instruments ({instruments.length})
        </h2>
        <div className="flex items-center gap-2 ease-in-out duration-300">
          <input placeholder="Search" className="p-2 rounded" />
          <button
            className="p-2 aspect-square rounded-full shadow-sm hover:shadow-zinc-300"
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
          {instruments.length > 0 && (
            <div className={`${card}`}>
              <div
                className={`w-full px-8 grid grid-cols-10 p-2 rounded text-bold z-99 shadow-sm shadow-zinc-300 ${inner}`}
              >
                <div className="col-span-3">Title</div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2"></div>
              </div>
              <div className={`p-4 rounded shadow-md max-h-[50vh] overflow-y-scroll`}>
                <div className="flex flex-col gap-2">
                  {instruments.map((inst) => (
                    <div
                      key={inst.id}
                      className={`grid grid-cols-10 p-2 rounded ${inner}`}
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        {inst.imageUrl && (
                          <img
                            src={inst.imageUrl}
                            alt={inst.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{inst.name}</p>
                          <p className="text-xs opacity-60">ID: {inst.id}</p>
                        </div>
                      </div>
                      <div className="col-span-3 flex items-center">{inst.description}</div>
                      <div className="col-span-2 flex items-center">${inst.price}</div>
                      <div className="col-span-2 w-full flex justify-end items-center">
                        <button
                          onClick={() => handleDelete(inst.id)}
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
              <div className="flex justify-between items-center">
                <h1 className="font-semibold">Add Instrument</h1>
                <button type="button" onClick={() => setCollapse(false)}>
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
                      className="aspect-square rounded-full p-2 flex items-center justify-center absolute z-10 bg-white"
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
                    className="w-full aspect-5/2 rounded inset-shadow-xs relative inset-shadow-gray-300 bg-white"
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
        ) : (
          <div
            className={`h-fit px-5 py-4 flex justify-between items-center rounded shadow-md ${card}`}
          >
            <h1 className="font-semibold">Add Instrument</h1>
            <button onClick={() => setCollapse(true)}>
              <Plus />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentsControl;
