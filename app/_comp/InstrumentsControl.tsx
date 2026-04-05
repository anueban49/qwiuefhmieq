"use client";
import { useState, useEffect } from "react";
import { Image, X, Search, Plus, Minus, Filter } from "lucide-react";
import { InstrumentListItem } from "./InstrumentListItem";
const API = process.env.NEXT_PUBLIC_BASE_URL;
import AddInstrument from "./AddInstrument";
import { fetchWithAuth } from "@/lib/api";
type Feature = { title: string; description: string };
type Spec = { parameter: string; value: string };

type Instrument = {
  id: string;
  categoryId: string;
  methodTag: string;
  name: string;
  description: string;
  imageUrl: string;
  fullDescription: string;
  features: Feature[];
  specs: Spec[];
};

const emptyForm = {
  categoryId: "",
  methodTag: "",
  name: "",
  description: "",
  imageUrl: "",
  fullDescription: "",
  features: [{ title: "", description: "" }] as Feature[],
  specs: [{ parameter: "", value: "" }] as Spec[],
};

const InstrumentsControl = () => {
  const [loading, setLoading] = useState(false);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [preview, setPreview] = useState<string>("");
  const [dataloading, setDataloading] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const card = "shadow-gray-300";
  const input = "inset-shadow-gray-300";
  const inner = "bg-white";

  useEffect(() => {
    setDataloading(true);
    fetchWithAuth(`/instruments`)
      .then((r) => r.json())
      .then((data) => setInstruments(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setDataloading(false));
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetchWithAuth(`/instruments`, {
        method: "POST",
        body: JSON.stringify({ ...form, imageUrl: preview || form.imageUrl }),
      });
      const created = await res.json();
      setInstruments((prev) => [...prev, created]);
      setForm(emptyForm);
      setPreview("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`/instruments/${id}`, { method: "DELETE" });
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

  const setFeature = (index: number, key: keyof Feature, value: string) => {
    setForm((prev) => {
      const features = prev.features.map((f, i) =>
        i === index ? { ...f, [key]: value } : f,
      );
      return { ...prev, features };
    });
  };

  const addFeature = () =>
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }],
    }));

  const removeFeature = (index: number) =>
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));

  const setSpec = (index: number, key: keyof Spec, value: string) => {
    setForm((prev) => {
      const specs = prev.specs.map((s, i) =>
        i === index ? { ...s, [key]: value } : s,
      );
      return { ...prev, specs };
    });
  };

  const addSpec = () =>
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { parameter: "", value: "" }],
    }));

  const removeSpec = (index: number) =>
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex justify-between p-2`}>
        <h2 className="text-xl font-semibold p-3">
          Instruments ({instruments.length})
        </h2>
        <div className="flex items-center gap-2 ease-in-out duration-300">
          <input placeholder="Search" className="p-2 rounded" />
          <button className="p-2 aspect-square rounded-full shadow-sm hover:shadow-zinc-300">
            <Search size={16} />
          </button>
          <AddInstrument />
        </div>
      </div>

      {dataloading ? (
        <div className="aspect-5/2 w-full flex items-center justify-center">
          Loading
        </div>
      ) : (
        <>
          {" "}
          <div className="w-full flex items-end">
            <button
              onClick={() => {}}
              className=" flex gap-2 items-center justify-center text-sm ease-in-out duration-300 rounded-full p-2 aspect-square"
            >
              <Filter size={16} />
            </button>
          </div>
          {instruments.length > 0 && (
            <div className={`${card}`}>
              <div
                className={`w-full px-8 grid grid-cols-7 p-2 rounded font-bold text-tg-blue-dark z-99 shadow-sm shadow-zinc-300 ${inner}`}
              >
                <div className="col-span-1">ID</div>
                <div className="col-span-2">Name</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Method</div>

                <div className="col-span-1">
                  <div className="w-full flex justify-end">Actions</div>
                </div>
              </div>
              <div className="p-4 rounded shadow-md max-h-[50vh] overflow-y-scroll">
                <div className="flex flex-col gap-2">
                  {instruments.map((inst, i) => (
                    <InstrumentListItem props={inst} key={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstrumentsControl;
