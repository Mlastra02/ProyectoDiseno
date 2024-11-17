import Head from 'next/head';
import BusquedaInsumos from "../components/BusquedaInsumos";
import ShoppingList from "../components/ShoppingList";
import Map from "../components/Map"; // Importa el componente Map
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function Home() {
  const [language, setLanguage] = useState("es");
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState('local1');
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

  const handleSelectList = (list, local) => {
    setShoppingList(list);
    setSelectedLocal(local);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("language");
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>{language === 'es' ? 'Búsqueda de Insumos Alimentarios' : 'Food Supplies Search'}</title>
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
          <div className="mx-auto flex justify-between items-center max-w-7xl px-6">
            <h1 className="text-3xl font-bold">
              {language === "es" ? "Proyecto diseño" : "Project Design"}
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-green-700 hover:bg-green-800 text-sm rounded-lg focus:ring-blue-500 block p-2.5"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
              >
                {language === "es" ? "Cerrar sesión" : "Logout"}
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Columna izquierda: Lista de Compras */}
            <div>
              <ShoppingList language={language} onSelectList={handleSelectList} />
            </div>

            {/* Columna derecha: Mejores Precios */}
            <div>
              <BusquedaInsumos language={language} selectedLocal={selectedLocal} shoppingList={shoppingList} />
            </div>
          </div>

          {/* Mapa de locales y ubicación del usuario */}
          <div className="w-full mt-8">
            <Map onNearbyLocal={(location) => console.log("User location:", location)} />
          </div>
        </main>
      </div>
    </>
  );
}
