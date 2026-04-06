"use client";
import { Minus } from "lucide-react";
import { useRef, useEffect, useState, ReactNode, MouseEvent } from "react";
import { fetchWithAuth } from "@/lib/api";
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

interface ReagentForm {
  catalogNo: string;
  categoryId: string;
  name_en: string;
  name_mn?: string;
  id: string;
  methodology_en: string;
  methodology_mn?: string;
  packageSize: string;
}

const emptyForm: ReagentForm = {
  catalogNo: "",
  categoryId: "",
  name_en: "",
  name_mn: "",
  id: "",
  methodology_en: "",
  methodology_mn: "",
  packageSize: "",
};

import { card, input } from "./AddCategory";
import { useData } from "./context/DataProvider";
import { Reagent } from "./ReagentsControl";
import { useContent } from "./context/ContentProvider";

const formFields = [
  { key: "catalogNo", label: "Catalog No" },
  { key: "name", label: "Name" },
  { key: "id", label: "ID" },
  { key: "packageSize", label: "Package Size" },
];

interface ReagentFormDialogProps {
  open: boolean;
  onClose: () => void;
  categoryId?: string[];
  methodology?: Methodology[];
}

export type Methodology = {
  methodology_en: string;
  methodology_mn: string;
};
export function ReagentFormDialog({
  open,
  onClose,
  categoryId,
  methodology,
}: ReagentFormDialogProps) {
  const [form, setForm] = useState<ReagentForm>(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/reagents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await res.json();
      setForm(emptyForm);
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-gray-900">Add Reagent</h1>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Basic fields */}
        {formFields.map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              required
              type="text"
              className={`mt-1 w-full rounded-md px-3 py-2 bg-white ${input}`}
              value={form[key as keyof ReagentForm]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          </div>
        ))}

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            required
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white cursor-pointer ${input}`}
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, categoryId: e.target.value }))
            }
          >
            <option value="">Select Category</option>
            {categoryId?.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Methodology
          </label>
          <select
            required
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white cursor-pointer ${input}`}
            value={form.methodology_en}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, methodology_en: e.target.value }))
            }
          >
            <option value="">Select Methodology</option>
            {methodology?.map((c, i) => (
              <option key={i} value={c.methodology_en}>
                {c.methodology_mn} / {c.methodology_en}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-4 py-2.5 font-medium transition-all disabled:opacity-50 ${card}`}
        >
          {loading ? "Adding..." : "Add Reagent"}
        </button>
      </form>
    </Dialog>
  );
}
// ─────────────────────────────────────────────────────────────
// Edit Reagent Dialog
// ─────────────────────────────────────────────────────────────

interface EditReagentDialogProps {
  open: boolean;
  onClose: () => void;
  reagent: Reagent;
}

export function EditReagentDialog({
  open,
  onClose,
  reagent,
}: EditReagentDialogProps) {
  const { updateReagent } = useData();
  const { lang } = useContent();
  const [form, setForm] = useState<ReagentForm>({
    catalogNo: reagent.catalogNo,
    categoryId: reagent.categoryId,
    name_en: reagent.name_en,
    name_mn: reagent.name_mn ?? "",
    id: reagent.id,
    methodology_en: reagent.methodology_en ?? "",
    methodology_mn: reagent.methodology_mn ?? "",
    packageSize: reagent.packageSize,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateReagent(reagent.id, form);
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
          <h1 className="font-semibold text-gray-900">Edit Reagent</h1>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {formFields.map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              required
              type="text"
              className={`mt-1 w-full rounded-md px-3 py-2 bg-white ${input}`}
              value={form[key as keyof ReagentForm]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <input
            required
            type="text"
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white ${input}`}
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, categoryId: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Methodology (EN)
          </label>
          <input
            type="text"
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white ${input}`}
            value={form.methodology_en}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, methodology_en: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Methodology (MN)
          </label>
          <input
            type="text"
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white ${input}`}
            value={form.methodology_mn}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, methodology_mn: e.target.value }))
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-4 py-2.5 font-medium transition-all disabled:opacity-50 ${card}`}
        >
          {lang === "EN" ? (
            <> {loading ? "Saving..." : "Save Changes"}</>
          ) : (
            <>{loading ? "Хадгалж байна..." : "Хадгалах"}</>
          )}
        </button>
      </form>
    </Dialog>
  );
}

interface AddReagentProps {
  categoryId?: string[];
  methodology?: Methodology[];
}
export default function AddReagent({
  categoryId,
  methodology,
}: AddReagentProps) {
  const [open, setOpen] = useState(false);
  const { lang } = useContent();

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-tg-green hover:bg-tg-blue text-white font-medium rounded-lg shadow-lg transition-all duration-300"
      >
        {lang === "EN" ? <>Add Reagent</> : <>Урвалж нэмэх</>}
      </button>

      <ReagentFormDialog
        open={open}
        onClose={() => setOpen(false)}
        categoryId={categoryId}
        methodology={methodology}
      />
    </div>
  );
}
