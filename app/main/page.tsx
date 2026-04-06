"use client";

import { CategoriesControl } from "../_comp/CategoriesControl";
import { Sidebar } from "../_comp/Sidebar";
import { useContent } from "../_comp/context/ContentProvider";
import { SettingsPanel } from "../_comp/SettingsPanel";
import InstrumentsControl from "../_comp/InstrumentsControl";
import { ReagentsControl } from "../_comp/ReagentsControl";
const RenderContent = () => {
  const { active } = useContent();
  switch (active) {
    case "Categories":
      return <CategoriesControl />;
    case "Instruments":
      return <InstrumentsControl />;
    case "Regeants":
      return <ReagentsControl />;
    case "Settings":
      return <SettingsPanel />;
    default:
      return <CategoriesControl />;
  }
};
export default function Page() {
  return (
    <div className="flex gap-2 w-full h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4">
        <RenderContent />
      </div>
    </div>
  );
}
