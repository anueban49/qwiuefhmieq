"use client";
import { Minus, Plus, X, Image as ImageIcon } from "lucide-react";
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
  categoryId: string;
  methodTag?: string;
  name_en: string;
  name_mn: string;
  description_en: string;
  description_mn?: string;
  fullDescription_en: string;
  fullDescription_mn?: string;
  features_en: Feature[];
  features_mn: Feature[];
  specs_en: Spec[];
  specs_mn: Spec[];
}

const emptyForm: InstrumentForm = {
  categoryId: "",
  methodTag: "",
  name_en: "",
  name_mn: "",
  description_en: "",
  description_mn: "",
  fullDescription_en: "",
  fullDescription_mn: "",
  features_en: [{ title: "", description: "" }],
  features_mn: [{ title: "", description: "" }],
  specs_en: [{ parameter: "", value: "" }],
  specs_mn: [{ parameter: "", value: "" }],
};

import { card, input } from "./AddCategory";
import { inner } from "./CategoriesControl";
import { useData } from "./context/DataProvider";

interface InstrumentFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InstrumentFormDialog({
  open,
  onClose,
}: InstrumentFormDialogProps) {
  const { addInstrument } = useData();
  const [form, setForm] = useState<InstrumentForm>(emptyForm);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Feature handlers
  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features_en: [...prev.features_en, { title: "", description: "" }],
      features_mn: [...prev.features_mn, { title: "", description: "" }],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features_en: prev.features_en.filter((_, i) => i !== index),
      features_mn: prev.features_mn.filter((_, i) => i !== index),
    }));
  };

  const setFeature = (index: number, lang: "en" | "mn", key: keyof Feature, value: string) => {
    const field = `features_${lang}` as const;
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((f, i) =>
        i === index ? { ...f, [key]: value } : f,
      ),
    }));
  };

  // Spec handlers
  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specs_en: [...prev.specs_en, { parameter: "", value: "" }],
      specs_mn: [...prev.specs_mn, { parameter: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specs_en: prev.specs_en.filter((_, i) => i !== index),
      specs_mn: prev.specs_mn.filter((_, i) => i !== index),
    }));
  };

  const setSpec = (index: number, lang: "en" | "mn", key: keyof Spec, value: string) => {
    const field = `specs_${lang}` as const;
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((s, i) =>
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
    try {
      await addInstrument(form);
      setForm(emptyForm);
      setPreview("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
            { key: "name_en", label: "Name (EN)" },
            { key: "name_mn", label: "Name (MN)" },
            { key: "description_en", label: "Short Description (EN)" },
            { key: "description_mn", label: "Short Description (MN)" },
            { key: "methodTag", label: "Method Tag" },
          ] as { key: keyof InstrumentForm; label: string }[]
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
            Full Description (EN)
          </label>
          <textarea
            rows={3}
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white  resize-none ${input}`}
            value={form.fullDescription_en}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                fullDescription_en: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 ">
            Full Description (MN)
          </label>
          <textarea
            rows={3}
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white  resize-none ${input}`}
            value={form.fullDescription_mn}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                fullDescription_mn: e.target.value,
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
            {form.features_en.map((feat, i) => (
              <div
                key={i}
                className={`rounded-md p-2 flex flex-col gap-1 `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">#{i + 1}</span>
                  {form.features_en.length > 1 && (
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
                  placeholder="Title (EN)"
                  className={`w-full rounded px-2 py-1 text-sm bg-white  ${input}`}
                  value={feat.title}
                  onChange={(e) => setFeature(i, "en", "title", e.target.value)}
                />
                <input
                  placeholder="Description (EN)"
                  className={`w-full rounded px-2 py-1 text-sm bg-white  ${input}`}
                  value={feat.description}
                  onChange={(e) => setFeature(i, "en", "description", e.target.value)}
                />
                <input
                  placeholder="Title (MN)"
                  className={`w-full rounded px-2 py-1 text-sm bg-white  ${input}`}
                  value={form.features_mn[i]?.title ?? ""}
                  onChange={(e) => setFeature(i, "mn", "title", e.target.value)}
                />
                <input
                  placeholder="Description (MN)"
                  className={`w-full rounded px-2 py-1 text-sm bg-white  ${input}`}
                  value={form.features_mn[i]?.description ?? ""}
                  onChange={(e) => setFeature(i, "mn", "description", e.target.value)}
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
              className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
            >
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {form.specs_en.map((spec, i) => (
              <div
                key={i}
                className={`rounded-md p-2 flex flex-col gap-1 ${inner}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">#{i + 1}</span>
                  {form.specs_en.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="Parameter (EN)"
                    className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`}
                    value={spec.parameter}
                    onChange={(e) => setSpec(i, "en", "parameter", e.target.value)}
                  />
                  <input
                    placeholder="Value (EN)"
                    className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`}
                    value={spec.value}
                    onChange={(e) => setSpec(i, "en", "value", e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="Parameter (MN)"
                    className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`}
                    value={form.specs_mn[i]?.parameter ?? ""}
                    onChange={(e) => setSpec(i, "mn", "parameter", e.target.value)}
                  />
                  <input
                    placeholder="Value (MN)"
                    className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`}
                    value={form.specs_mn[i]?.value ?? ""}
                    onChange={(e) => setSpec(i, "mn", "value", e.target.value)}
                  />
                </div>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Instrument preview"
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
                <ImageIcon aria-hidden className="w-8 h-8 text-gray-400" />
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

// ─────────────────────────────────────────────────────────────
// Edit Instrument Dialog
// ─────────────────────────────────────────────────────────────

import { Instrument } from "./InstrumentsControl";

interface EditInstrumentDialogProps {
  open: boolean;
  onClose: () => void;
  instrument: Instrument;
}

export function EditInstrumentDialog({
  open,
  onClose,
  instrument,
}: EditInstrumentDialogProps) {
  const { updateInstrument } = useData();
  const [form, setForm] = useState<InstrumentForm>({
    categoryId: instrument.categoryId,
    methodTag: instrument.methodTag,
    name_en: instrument.name_en,
    name_mn: instrument.name_mn,
    description_en: instrument.description_en,
    description_mn: instrument.description_mn ?? "",
    fullDescription_en: instrument.fullDescription_en,
    fullDescription_mn: instrument.fullDescription_mn ?? "",
    features_en: instrument.features_en.length > 0 ? instrument.features_en : [{ title: "", description: "" }],
    features_mn: instrument.features_mn?.length ? instrument.features_mn : [{ title: "", description: "" }],
    specs_en: instrument.specs_en.length > 0 ? instrument.specs_en : [{ parameter: "", value: "" }],
    specs_mn: instrument.specs_mn?.length ? instrument.specs_mn : [{ parameter: "", value: "" }],
  });
  const [loading, setLoading] = useState(false);

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features_en: [...prev.features_en, { title: "", description: "" }],
      features_mn: [...prev.features_mn, { title: "", description: "" }],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features_en: prev.features_en.filter((_, i) => i !== index),
      features_mn: prev.features_mn.filter((_, i) => i !== index),
    }));
  };

  const setFeature = (index: number, lang: "en" | "mn", key: keyof Feature, value: string) => {
    const field = `features_${lang}` as const;
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((f, i) => (i === index ? { ...f, [key]: value } : f)),
    }));
  };

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specs_en: [...prev.specs_en, { parameter: "", value: "" }],
      specs_mn: [...prev.specs_mn, { parameter: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specs_en: prev.specs_en.filter((_, i) => i !== index),
      specs_mn: prev.specs_mn.filter((_, i) => i !== index),
    }));
  };

  const setSpec = (index: number, lang: "en" | "mn", key: keyof Spec, value: string) => {
    const field = `specs_${lang}` as const;
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateInstrument(instrument.id, form);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-gray-900">Edit Instrument</h1>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {(
          [
            { key: "name_en", label: "Name (EN)" },
            { key: "name_mn", label: "Name (MN)" },
            { key: "description_en", label: "Short Description (EN)" },
            { key: "description_mn", label: "Short Description (MN)" },
            { key: "methodTag", label: "Method Tag" },
          ] as { key: keyof InstrumentForm; label: string }[]
        ).map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              required
              type="text"
              className={`mt-1 w-full rounded-md px-3 py-2 bg-white ${input}`}
              value={form[key] as string}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700">Full Description (EN)</label>
          <textarea
            rows={3}
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white resize-none ${input}`}
            value={form.fullDescription_en}
            onChange={(e) => setForm((prev) => ({ ...prev, fullDescription_en: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Full Description (MN)</label>
          <textarea
            rows={3}
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white resize-none ${input}`}
            value={form.fullDescription_mn}
            onChange={(e) => setForm((prev) => ({ ...prev, fullDescription_mn: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            required
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white cursor-pointer ${input}`}
            value={form.categoryId}
            onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
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
            <label className="text-sm font-medium text-gray-700">Features</label>
            <button type="button" onClick={addFeature} className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700">
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {form.features_en.map((feat, i) => (
              <div key={i} className="rounded-md p-2 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">#{i + 1}</span>
                  {form.features_en.length > 1 && (
                    <button type="button" onClick={() => removeFeature(i)} className="text-gray-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  )}
                </div>
                <input placeholder="Title (EN)" className={`w-full rounded px-2 py-1 text-sm bg-white ${input}`} value={feat.title} onChange={(e) => setFeature(i, "en", "title", e.target.value)} />
                <input placeholder="Description (EN)" className={`w-full rounded px-2 py-1 text-sm bg-white ${input}`} value={feat.description} onChange={(e) => setFeature(i, "en", "description", e.target.value)} />
                <input placeholder="Title (MN)" className={`w-full rounded px-2 py-1 text-sm bg-white ${input}`} value={form.features_mn[i]?.title ?? ""} onChange={(e) => setFeature(i, "mn", "title", e.target.value)} />
                <input placeholder="Description (MN)" className={`w-full rounded px-2 py-1 text-sm bg-white ${input}`} value={form.features_mn[i]?.description ?? ""} onChange={(e) => setFeature(i, "mn", "description", e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">Specs</label>
            <button type="button" onClick={addSpec} className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700">
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {form.specs_en.map((spec, i) => (
              <div key={i} className={`rounded-md p-2 flex flex-col gap-1 ${inner}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">#{i + 1}</span>
                  {form.specs_en.length > 1 && (
                    <button type="button" onClick={() => removeSpec(i)} className="text-gray-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input placeholder="Parameter (EN)" className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`} value={spec.parameter} onChange={(e) => setSpec(i, "en", "parameter", e.target.value)} />
                  <input placeholder="Value (EN)" className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`} value={spec.value} onChange={(e) => setSpec(i, "en", "value", e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <input placeholder="Parameter (MN)" className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`} value={form.specs_mn[i]?.parameter ?? ""} onChange={(e) => setSpec(i, "mn", "parameter", e.target.value)} />
                  <input placeholder="Value (MN)" className={`flex-1 rounded px-2 py-1 text-sm bg-white ${input}`} value={form.specs_mn[i]?.value ?? ""} onChange={(e) => setSpec(i, "mn", "value", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-4 py-2.5 font-medium transition-all disabled:opacity-50 ${card}`}
        >
          {loading ? "Saving..." : "Save Changes"}
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
