import Head from "next/head";
import { useRouter } from "next/router";
import BusquedaDinamica from "../components/BusquedaDinamica";

export default function BusquedaDinamicaPage() {
  const router = useRouter();
  const language = "es";

  return (
    <>
      <Head>
        <title>
          {language === "es" ? "Búsqueda Dinámica" : "Dynamic Search"}
        </title>
        <meta
          name="description"
          content={
            language === "es"
              ? "Busca productos al mejor precio cerca de ti."
              : "Find products at the best price near you."
          }
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100 flex flex-col">
        <header className="bg-green-600 p-4 text-white shadow-md">
          <div className="mx-auto flex justify-between items-center max-w-7xl px-6">
            <h1 className="text-3xl font-bold">
              {language === "es" ? "Tu Lista Económica" : "Your Economic List"}
            </h1>
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

        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <BusquedaDinamica language={language} />
        </main>
      </div>
    </>
  );
}


