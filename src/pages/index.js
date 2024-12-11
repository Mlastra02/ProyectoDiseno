import Head from "next/head";
import Script from "next/script";
import BusquedaInsumos from "../components/BusquedaInsumos";
import ShoppingList from "../components/ShoppingList";
import Map from "../components/Map";
import BotpressChat from "../components/BotpressChat";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [language, setLanguage] = useState("es");
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState("local1");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);

      let storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        storedUserId = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem("userId", storedUserId);
      }
      setUserId(storedUserId);

      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("language");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    router.push("/login");
    window.location.reload();
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

      <Script
        src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"
        strategy="lazyOnload"
        onLoad={() => console.log("Botpress Webchat script loaded")}
        onError={(e) => console.error("Botpress script failed to load", e)}
      />

      <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100 flex flex-col">
        <header className="bg-green-600 p-4 text-white shadow-md">
          <div className="mx-auto flex justify-between items-center max-w-7xl px-6">
            <h1 className="text-3xl font-bold">
              {language === "es" ? "Tu Lista Económica" : "Your Economic List"}
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

        <nav className="bg-green-600 text-white shadow-lg rounded-b-lg py-3">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => router.push("/")}
              className="text-lg font-semibold hover:text-gray-200 transition"
            >
              {language === "es" ? "Inicio" : "Home"}
            </button>
            <button
              onClick={() => router.push("/busqueda-dinamica")}
              className="text-lg font-semibold hover:text-gray-200 transition"
            >
              {language === "es" ? "Búsqueda Dinámica" : "Dynamic Search"}
            </button>
          </div>
        </nav>

        <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <ShoppingList
                language={language}
                onSelectList={setShoppingList}
                sessionId={
                  typeof window !== "undefined"
                    ? localStorage.getItem("sessionId")
                    : ""
                }
              />
            </div>
            <div>
              <BusquedaInsumos
                language={language}
                selectedLocal={selectedLocal}
                shoppingList={shoppingList}
              />
            </div>
          </div>
          <div className="w-full mt-8">
            <Map />
          </div>
        </main>
      </div>

      {isAuthenticated && <BotpressChat />}
    </>
  );
}
