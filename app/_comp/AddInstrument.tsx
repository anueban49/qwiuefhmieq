"use client";
import { Minus, Plus, X, Image } from "lucide-react";
import { useRef, useEffect, useState, ReactNode, MouseEvent } from "react";
// ─────────────────────────────────────────────────────────────
// Dialog Component
// ─────────────────────────────────────────────────────────────

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Dialog({ open, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleCancel = (e: Event) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={handleCancel as unknown as React.ReactEventHandler}
      className="rounded-xl p-0 backdrop:bg-black/10 backdrop:backdrop-blur-sm
                 shadow-2xl border border-gray-200
                 bg-white w-full max-w-lg max-h-[85vh]
                 overflow-hidden m-auto"
    >
      <div className="overflow-y-auto max-h-[85vh] p-6">{children}</div>
    </dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Instrument Form
// ─────────────────────────────────────────────────────────────

interface Feature {
  title: string;
  description: string;
}

interface Spec {
  parameter: string;
  value: string;
}

interface InstrumentForm {
  name: string;
  description: string;
  methodTag: string;
  fullDescription: string;
  categoryId: string;
  features: Feature[];
  specs: Spec[];
}

const emptyForm: InstrumentForm = {
  name: "",
  description: "",
  methodTag: "",
  fullDescription: "",
  categoryId: "",
  features: [{ title: "", description: "" }],
  specs: [{ parameter: "", value: "" }],
};

// Tailwind class presets (adjust to match your theme)
import { card, input } from "./AddCategory";
import { inner } from "./CategoriesControl";

interface InstrumentFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InstrumentFormDialog({
  open,
  onClose,
}: InstrumentFormDialogProps) {
  const [form, setForm] = useState<InstrumentForm>(emptyForm);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Feature handlers
  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const setFeature = (index: number, key: keyof Feature, value: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((f, i) =>
        i === index ? { ...f, [key]: value } : f,
      ),
    }));
  };

  // Spec handlers
  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { parameter: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const setSpec = (index: number, key: keyof Spec, value: string) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.map((s, i) =>
        i === index ? { ...s, [key]: value } : s,
      ),
    }));
  };

  // Image handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Submitted:", form);
    setLoading(false);
    setForm(emptyForm);
    setPreview("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-gray-900">Add Instrument</h1>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100  transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Basic fields */}
        {(
          [
            { key: "name", label: "Name" },
            { key: "description", label: "Short Description" },
            { key: "methodTag", label: "Method Tag" },
          ] as { key: keyof typeof emptyForm; label: string }[]
        ).map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              required
              type="text"
              className={`mt-1 w-full rounded-md px-3 py-2 bg-white  ${input}`}
              value={form[key] as string}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700 ">
            Full Description
          </label>
          <textarea
            rows={3}
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white  resize-none ${input}`}
            value={form.fullDescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                fullDescription: e.target.value,
              }))
            }
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            required
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white  cursor-pointer ${input}`}
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, categoryId: e.target.value }))
            }
          >
            <option value="">Select Category</option>
            <option value="instrument-biochemistry">Biochemistry</option>
            <option value="instrument-hematology">Hematology</option>
            <option value="instrument-immunology">Immunology</option>
            <option value="instrument-urinalysis">Urinalysis</option>
          </select>
        </div>

        {/* Features */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">
              Features
            </label>
            <button
              type="button"
              onClick={addFeature}
              className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 "
            >
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {form.features.map((feat, i) => (
              <div
                key={i}
                className={`rounded-md p-2 flex flex-col gap-1 `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">#{i + 1}</span>
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                <input
                  placeholder="Title"
                  className={`w-full rounded px-2 py-1 text-sm bg-white  ${input}`}
                  value={feat.title}
                  onChange={(e) => setFeature(i, "title", e.target.value)}
                />
                <input
                  placeholder="Description"
                  className={`w-full rounded px-2 py-1 text-sm bg-white  ${input}`}
                  value={feat.description}
                  onChange={(e) => setFeature(i, "description", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 ">Specs</label>
            <button
              type="button"
              onClick={addSpec}
              className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:hover:text-blue-500"
            >
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {form.specs.map((spec, i) => (
              <div
                key={i}
                className={`rounded-md p-2 flex gap-2 items-center ${inner}`}
              >
                <input
                  placeholder="Parameter"
                  className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`}
                  value={spec.parameter}
                  onChange={(e) => setSpec(i, "parameter", e.target.value)}
                />
                <input
                  placeholder="Value"
                  className={`flex-1 rounded px-2 py-1 text-sm bg-white  ${input}`}
                  value={spec.value}
                  onChange={(e) => setSpec(i, "value", e.target.value)}
                />
                {form.specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          {preview ? (
            <div className="mt-2 w-full rounded aspect-[5/2] relative">
              <button
                type="button"
                onClick={() => setPreview("")}
                className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-100"
              >
                <X size={14} />
              </button>
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="mt-2 w-full aspect-[5/2] rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 relative hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 m-auto w-fit h-fit pointer-events-none">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-4 py-2.5 font-medium transition-all disabled:opacity-50 ${card}`}
        >
          {loading ? "Adding..." : "Add Instrument"}
        </button>
      </form>
    </Dialog>
  );
}

export default function AddInstrument() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-tg-green hover:bg-tg-blue text-white font-medium rounded-lg shadow-lg transition-all duration-300"
      >
        Add Instrument
      </button>

      <InstrumentFormDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
