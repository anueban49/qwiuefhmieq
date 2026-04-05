"use client";
import { Minus } from "lucide-react";
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
// Category Form
// ─────────────────────────────────────────────────────────────

interface CategoryForm {
  name: string;
  type: string;
}

const emptyForm: CategoryForm = {
  name: "",
  type: "",
};

const input =
  "border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const card = "bg-indigo-600 text-white hover:bg-indigo-700";

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CategoryFormDialog({ open, onClose }: CategoryFormDialogProps) {
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [loading, setLoading] = useState(false);

  const API =  process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/categories`, {
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
          <h1 className="font-semibold text-gray-900">Add Category</h1>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            required
            type="text"
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white ${input}`}
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select
            required
            className={`mt-1 w-full rounded-md px-3 py-2 bg-white cursor-pointer ${input}`}
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="">Select Type</option>
            <option value="instrument">Instrument</option>
            <option value="reagent">Reagent</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-4 py-2.5 font-medium transition-all disabled:opacity-50 ${card}`}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </Dialog>
  );
}

export default function AddCategory() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all"
      >
        Add Category
      </button>

      <CategoryFormDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
