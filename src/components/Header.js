import React from "react";
import { useLanguage } from "@/context/LenguageContext";

function Header() {
  const { language, setLanguage, translations } = useLanguage();
  const translate = translations[language].header;
  return (
    <header className="bg-green-600 p-4 text-white shadow-md">
      <div className="mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">{translate.nombrePagina}</h1>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-green-700 hover:bg-green-800 text-sm rounded-lg focus:ring-blue-500 block p-2.5 "
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
    </header>
  );
}

export default Header;
