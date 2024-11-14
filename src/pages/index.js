import Head from "next/head";
import BusquedaInsumos from "../components/BusquedaInsumos";
import FormularioContacto from "../components/FormularioContacto";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [language, setLanguage] = useState("es");
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      // Cargar el idioma almacenado en localStorage
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }

    // Limpiar el token al cerrar la pestaña o la ventana
    const handleBeforeUnload = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("language");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  // Función para cerrar sesión manualmente
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("language");
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>
          {language === "es"
            ? "Búsqueda de Insumos Alimentarios"
            : "Food Supplies Search"}
        </title>
        <meta
          name="description"
          content={
            language === "es"
              ? "Encuentra insumos alimentarios de supermercado o negocio."
              : "Find food supplies from the supermarket or store."
          }
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100 flex flex-col">
        <header className="bg-green-600 p-4 text-white shadow-md">
          <div className="mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold">Proyecto diseño</h1>
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
        <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-6">
          <BusquedaInsumos language={language} />

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="mt-8 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
          >
            {language === "es" ? "Cerrar sesión" : "Logout"}
          </button>
        </main>
      </div>
    </>
  );
}
