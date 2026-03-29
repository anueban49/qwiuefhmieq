"use client";
import { useState } from "react";
import { useTheme } from "./context/ThemeContext";
const InstrumentsControl = () => {
  const [form, setForm] = useState({
    id: "",
    categoryId: "",
    name: "",
    description: "",
    imageUrl: "",
  });
  return (
    <div className={``}>The section to create/read/update/delete products</div>
  );
};

export default InstrumentsControl;
