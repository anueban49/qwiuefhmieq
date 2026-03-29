"use client";
import { useState } from "react";
import { useTheme } from "./context/ThemeContext";
const InstrumentsControl = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const { theme } = useTheme();
  const [form, setForm] = useState({
    id: "",
    categoryId: "",
    name: "",
    description: "",
    price: undefined,
    imageUrl: "",
  });

  const handleClick = async () => {
    try {
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const formFields = [
    { key: "name", label: "Product Name", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "price", label: "price", type: "number" },
  ];
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={`w-fit p-5 flex flex-col gap-2 ${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`}
    >
      <form onSubmit={handleClick} className="space-y-4">
        <h1>Product addition</h1>
        {formFields.map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium">{field.label}</label>
            <input
              required
              className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
              value={form[field.key as keyof typeof form]}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            required
            className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="[categoryid1]">Instument</option>
            <option value="[categoryid2]">Regeant</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Image</label>
          <div
            className={`w-full aspect-5/1 rounded-2xl inset-shadow-sm ${theme === "dark" ? "inset-shadow-black" : "inset-shadow-gray-500"}`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 w-full opacity-0"
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 h-32 w-32 object-cover rounded-md"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium disabled:opacity-50 ${theme === "dark" ? "bg-zinc-700" : "bg-gray-300"}`}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default InstrumentsControl;
