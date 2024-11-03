import Head from 'next/head';
import BusquedaInsumos from "../components/BusquedaInsumos";
import FormularioContacto from "../components/FormularioContacto";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function Home() {
  const [language, setLanguage] = useState("es");
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token");

    if (!token) {
      // Si no hay token, redirigir al login
      router.push('/login');
    } else {
      // Cargar el idioma almacenado en localStorage
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Búsqueda de Insumos Alimentarios</title>
        <meta name="description" content="Encuentra insumos alimentarios de supermercado o negocio." />
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="w-full max-w-4xl p-10 bg-blue-800 bg-opacity-90 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-semibold text-center mb-8">Búsqueda de Insumos Alimentarios</h1>
          <p className="text-center text-gray-300 mb-8">
            Encuentra insumos alimentarios para tu supermercado o negocio de manera fácil y rápida.
          </p>
          <div className="space-y-6">
            <BusquedaInsumos language={language} />
          </div>
        </div>
      </div>
    </>
  );
}
