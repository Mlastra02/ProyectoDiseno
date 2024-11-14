import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es");

  const value = {
    language,
    setLanguage,
    translations: {
      es: {
        nombrePagina: "Proyecto de Diseño",
        tituloBusquedaAlimentos: "Búsqueda de Insumos Alimentarios",
        placeholderBusquedaAlimentos: "Buscar insumo (ej. Arroz, Frijoles)",
        sinResultados: "No hay resultados",
      },
      en: {
        nombrePagina: "Design Project",
        tituloBusquedaAlimentos: "Food Supplies Search",
        placeholderBusquedaAlimentos: "Search for supply (e.g., Rice, Beans)",
        sinResultados: "No results",
      },
    },
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
