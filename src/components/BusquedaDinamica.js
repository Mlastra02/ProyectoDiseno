import { useState, useEffect } from "react";

export default function BusquedaDinamica({ language = "es" }) {
  const [productName, setProductName] = useState(""); // Producto buscado
  const [userLocation, setUserLocation] = useState(null); // Ubicación del usuario
  const [results, setResults] = useState([]); // Resultados de la búsqueda
  const [loading, setLoading] = useState(false); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

  // Obtener la ubicación del usuario al cargar el componente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error obteniendo ubicación del usuario:", err);
          setError(
            language === "es"
              ? "No se pudo obtener la ubicación del usuario."
              : "Failed to get user location."
          );
        }
      );
    }
  }, [language]);

  // Manejar la búsqueda del producto
  const handleSearch = async () => {
    if (!productName.trim()) {
      alert(
        language === "es"
          ? "Por favor, ingrese el nombre de un producto."
          : "Please enter a product name."
      );
      return;
    }

    if (!userLocation) {
      alert(
        language === "es"
          ? "No se pudo obtener la ubicación. Por favor, habilite la ubicación en su dispositivo."
          : "Could not get location. Please enable location on your device."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/getBestPrices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shoppingList: [{ name: productName.trim() }], // Formato esperado por la API
          userLocation: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(
          language === "es"
            ? "Error al buscar los productos."
            : "Error searching for products."
        );
      }

      const data = await response.json();

      // Ordenar productos por precio (de menor a mayor)
      const sortedProducts = data.combinations[0]?.items?.sort((a, b) => a.price - b.price) || [];
      setResults(sortedProducts);
    } catch (err) {
      console.error("Error al buscar productos:", err);
      setError(
        language === "es"
          ? "Hubo un error al realizar la búsqueda."
          : "There was an error performing the search."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-green-200 via-green-300 to-green-100 text-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-green-800 mb-4 text-center">
        {language === "es" ? "Búsqueda de Productos" : "Product Search"}
      </h2>

      {/* Campo de búsqueda */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder={
            language === "es"
              ? "Ingrese el nombre del producto"
              : "Enter product name"
          }
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="flex-1 p-3 border border-green-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          {language === "es" ? "Buscar" : "Search"}
        </button>
      </div>

      {/* Resultados */}
      {loading && (
        <p className="text-center text-gray-500">
          {language === "es" ? "Cargando resultados..." : "Loading results..."}
        </p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">
            {language === "es" ? "Resultados (por precio):" : "Results (by price):"}
          </h3>
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-green-100 p-4 rounded-lg shadow-md"
            >
              <p className="text-sm font-semibold text-green-800">
                {language === "es" ? "Producto:" : "Product:"} {result.name}
              </p>
              <p className="text-sm text-gray-700">
                {language === "es" ? "Precio:" : "Price:"} ${result.price}
              </p>
              <p className="text-sm text-gray-700">
                {language === "es" ? "Tienda:" : "Store:"} {result.store}
              </p>
              <p className="text-sm text-gray-700">
                {language === "es" ? "Distancia:" : "Distance:"}{" "}
                {result.distance.toFixed(2)} km {/* Redondeo a 2 decimales */}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <p className="text-center text-gray-500">
          {language === "es"
            ? "No se encontraron productos."
            : "No products found."}
        </p>
      )}
    </div>
  );
}
