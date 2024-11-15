import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es");

  const value = {
    language,
    setLanguage,
    translations: {
      es: {
        header: {
          nombrePagina: "Proyecto de Diseño",
        },
        homePage: {
          tituloBusquedaAlimentos: "Búsqueda de Insumos Alimentarios",
          placeholderBusquedaAlimentos: "Buscar insumo (ej. Arroz, Frijoles)",
          cerrarSesionBoton: "Cerrar Sesión",
          sinResultados: "No hay resultados",
        },
        login: {
          tituloIniciarSesion: "Iniciar Sesión",
          placeholderNombreUsuario: "Nombre de usuario",
          placeholderContrasena: "Contraseña",
          iniciarSesionBoton: "Iniciar Sesión",
        },
        register: {
          tituloRegistro: "Registro",
          placeholderNombreUsuario: "Nombre de usuario",
          placeholderContrasena: "Contraseña",
          registroBoton: "Registrarse",
        },
      },
      en: {
        header: {
          nombrePagina: "Design Project",
        },
        homePage: {
          tituloBusquedaAlimentos: "Food Supplies Search",
          placeholderBusquedaAlimentos: "Search for supply (e.g., Rice, Beans)",
          cerrarSesionBoton: "Logout",
          sinResultados: "No results",
        },
        login: {
          tituloIniciarSesion: "Login",
          placeholderNombreUsuario: "Username",
          placeholderContrasena: "Password",
          iniciarSesionBoton: "Login",
        },
        register: {
          tituloRegistro: "Register",
          placeholderNombreUsuario: "Username",
          placeholderContrasena: "Password",
          registroBoton: "Register",
        },
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
