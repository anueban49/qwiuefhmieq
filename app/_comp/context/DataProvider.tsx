"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Reagent } from "../ReagentsControl";
import { fetchWithAuth } from "@/lib/api";
export type Feature = { title: string; description: string };
export type Spec = { parameter: string; value: string };
export type Instrument = {
  id: string;
  categoryId: string;
  name_en: string;
  name_mn: string;
  description_en: string;
  description_mn?: string;
  imageData?: { data: number[]; type: string };
  imageMimeType?: string;
  fullDescription_en: string;
  fullDescription_mn?: string;
  features_en: Feature[];
  features_mn?: Feature[];
  specs_mn?: Spec[];
  specs_en: Spec[];
};
export type Category = {
  id: string;
  title_en: string;
  title_mn: string;
  bullets_en: string[];
  bullets_mn: string[];
};
export type Contact = {
  id: string;
  name: string;
  email: string;
  organization: string;
  reason:
    | "Product Inquiry"
    | "Technical Support"
    | "Distribution Partnership"
    | "Clinical Collaboration"
    | "Media & Press"
    | "Other";
  message: string;
  lang?: "EN" | "MN";
  createdAt: Date;
};
interface DataContextType {
  categories: Category[];
  instruments: Instrument[];
  reagents: Reagent[];
  messages: Contact[];
  loading: boolean;
  deleteReagent: (id: string) => Promise<void>;
  deleteInstrument: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  addReagent: (reagent: Omit<Reagent, "id">) => Promise<void>;
  addInstrument: (instrument: Omit<Instrument, "id">) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  updateInstrument: (id: string, data: Partial<Instrument>) => Promise<void>;
  updateReagent: (id: string, data: Partial<Reagent>) => Promise<void>;
  refetch: () => Promise<void>;
}

export const DataContext = createContext({} as DataContextType);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const [catRes, reagentRes, instrumentRes, messagesRes] =
        await Promise.all([
          fetchWithAuth("/categories"),
          fetchWithAuth("/reagents"),
          fetchWithAuth("/instruments"),
          fetchWithAuth("/contact"),
        ]);

      const [catData, reagentData, instrumentData, messagesData] =
        await Promise.all([
          catRes.json(),
          reagentRes.json(),
          instrumentRes.json(),
          messagesRes.json(),
        ]);

      setCategories(Array.isArray(catData) ? catData : []);
      setReagents(Array.isArray(reagentData) ? reagentData : []);
      setInstruments(Array.isArray(instrumentData) ? instrumentData : []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deleteReagent = async (id: string) => {
    await fetchWithAuth(`/reagents/${id}`, { method: "DELETE" });
    setReagents((prev) => prev.filter((r) => r.id !== id));
  };

  const deleteInstrument = async (id: string) => {
    await fetchWithAuth(`/instruments/${id}`, { method: "DELETE" });
    setInstruments((prev) => prev.filter((i) => i.id !== id));
  };

  const deleteCategory = async (id: string) => {
    await fetchWithAuth(`/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteMessage = async (id: string) => {
    await fetchWithAuth(`/contact/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((c) => c.id !== id));
  };
  const addReagent = async (reagent: Omit<Reagent, "id">) => {
    const res = await fetchWithAuth("/reagents", {
      method: "POST",
      body: JSON.stringify(reagent),
    });
    const newReagent = await res.json();
    setReagents((prev) => [...prev, newReagent]);
  };

  const addInstrument = async (instrument: Omit<Instrument, "id">) => {
    const res = await fetchWithAuth("/instruments", {
      method: "POST",
      body: JSON.stringify(instrument),
    });
    const newInstrument = await res.json();
    setInstruments((prev) => [...prev, newInstrument]);
  };

  const addCategory = async (category: Omit<Category, "id">) => {
    const res = await fetchWithAuth("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
    const newCategory = await res.json();
    setCategories((prev) => [...prev, newCategory]);
  };
  const updateCategory = async (id: string, data: Partial<Category>) => {
    await fetchWithAuth(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const updateInstrument = async (id: string, data: Partial<Instrument>) => {
    await fetchWithAuth(`/instruments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setInstruments((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data } : i))
    );
  };

  const updateReagent = async (id: string, data: Partial<Reagent>) => {
    await fetchWithAuth(`/reagents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setReagents((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        instruments,
        reagents,
        messages,
        loading,
        deleteReagent,
        deleteInstrument,
        deleteCategory,
        deleteMessage,
        addReagent,
        addInstrument,
        addCategory,
        updateCategory,
        updateInstrument,
        updateReagent,
        refetch: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
