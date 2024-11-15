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
          textoPregunta: "¿No tienes una cuenta?",
          link: "Regístrate",
        },
        register: {
          tituloRegistro: "Registro",
          placeholderNombreUsuario: "Nombre de usuario",
          placeholderContrasena: "Contraseña",
          registroBoton: "Registrarse",
          textoPregunta: "¿Ya tienes una cuenta?",
          link: "Iniciar Sesión",
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
          textoPregunta: "Don't have an account?",
          link: "Sign up",
        },
        register: {
          tituloRegistro: "Register",
          placeholderNombreUsuario: "Username",
          placeholderContrasena: "Password",
          registroBoton: "Register",
          textoPregunta: "Already have an account?",
          link: "Login",
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
