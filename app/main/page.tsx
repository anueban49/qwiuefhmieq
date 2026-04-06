"use client";

import { CategoriesControl } from "../_comp/CategoriesControl";
import { Sidebar } from "../_comp/Sidebar";
import { useContent } from "../_comp/context/ContentProvider";
import { Messages } from "../_comp/Messages";
import { InstrumentsControl } from "../_comp/InstrumentsControl";
import { ReagentsControl } from "../_comp/ReagentsControl";
function RenderContent({ active }: { active: string }) {
  switch (active) {
    case "Categories":
      return <CategoriesControl />;
    case "Instruments":
      return <InstrumentsControl />;
    case "Regeants":
      return <ReagentsControl />;
    case "Messages":
      return <Messages />;
    default:
      return <CategoriesControl />;
  }
}

export default function Page() {
  const { active } = useContent();

  return (
    <div className="flex gap-2 w-full h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4">
        <RenderContent active={active} />
      </div>
    </div>
  );
}
