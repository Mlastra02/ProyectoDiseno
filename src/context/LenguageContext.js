import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es"); // español por defecto

  const value = {
    language,
    setLanguage,
    translations: {
      es: {
        pageName: "Proyecto de Diseño",
      },
      en: {
        pageName: "Design Project",
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
