"use client";
import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
export type ActiveBtn = "Categories" | "Instruments" | "Regeants" | "Messages";
export type LangType = "EN" | "MN";
interface ContentType {
  switchContent: (tab: ActiveBtn) => void;
  active: "Categories" | "Instruments" | "Regeants" | "Messages";
  lang: LangType;
  switchLang: () => void;
}
export type UserType = {
  displayName: string;
  id: string;
  username: string;
};
const ContentContext = createContext({} as ContentType);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState<ActiveBtn>("Categories");
  const [lang, setLang] = useState<"EN" | "MN">("EN");
  const router = useRouter();
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/");
        } else {
          router.push("/main");
        }
      } catch (e) {
        console.log("conten provider:", e);
      }
    };
    getUser();
    const getLang = () => {
      const savedLang = localStorage.getItem("lang");
      if (!savedLang) {
        localStorage.setItem("lang", lang);
      }
    };
    getLang();
  }, []);
  const switchLang = () => {
    setLang((prev) => prev === "EN" ? "MN" : "EN");
  };
  const switchContent = (tab: ActiveBtn) => {
    setActive(tab);
    console.log(active);
  };

  return (
    <ContentContext.Provider
      value={{ switchContent, active, lang, switchLang }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within the designated Provider");
  }
  return context;
};
