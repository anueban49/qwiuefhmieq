"use client";
import { useState, createContext, useContext, ReactNode } from "react";
export type ActiveBtn = "Dashboard" | "Products" | "Web";
interface ContentType {
  switchContent: (tab: ActiveBtn) => void;
  active: "Dashboard" | "Products" | "Web";
}
const ContentContext = createContext({} as ContentType);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState<ActiveBtn>("Dashboard");

  const switchContent = (tab: ActiveBtn) => {
    setActive(tab);
    console.log(active);
  };

  return (
    <ContentContext.Provider value={{ switchContent, active }}>
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
