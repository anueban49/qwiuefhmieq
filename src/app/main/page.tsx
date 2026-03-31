"use client";

import { CategoriesControl } from "../_comp/CategoriesControl";
import { DashboardView } from "../_comp/DashboardView";
import { InventoryManagement } from "../_comp/InventoryManagement";
import { Sidebar } from "../_comp/Sidebar";
import { useContent } from "../_comp/context/ContentProvider";

export default function Page() {
  const { active } = useContent();

  const RenderContent = () => {
    switch (active) {
      case "Dashboard":
        return <DashboardView />;
      case "Products":
        return <InventoryManagement />;
      case "Web":
        return <CategoriesControl />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex gap-2 w-full h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4">
        <RenderContent />
      </div>
    </div>
  );
}
