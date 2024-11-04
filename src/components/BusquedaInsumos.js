// src/components/BusquedaInsumos.js
import { useState } from "react";

const translations = {
  es: {
    title: "Búsqueda de Insumos Alimentarios",
    placeholder: "Buscar insumo (ej. Arroz, Frijoles)",
    noResults: "No se encontraron resultados para",
  },
  en: {
    title: "Food Supplies Search",
    placeholder: "Search for supply (e.g., Rice, Beans)",
    noResults: "No results found for",
  },
};

export default function BusquedaInsumos({ language = "es" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [items] = useState([
    {
      id: 1,
      name: "Arroz",
      price: "$2.000",
      description: "Arroz blanco de grano largo",
    },
    {
      id: 2,
      name: "Frijoles",
      price: "$1.500",
      description: "Frijoles negros",
    },
    {
      id: 3,
      name: "Aceite de Oliva",
      price: "$15.000",
      description: "Aceite de oliva extra virgen de 1L",
    },
    {
      id: 4,
      name: "Azúcar",
      price: "$1.500",
      description: "Azúcar blanca refinada",
    },
    {
      id: 5,
      name: "Leche",
      price: "$1.000",
      description: "Leche entera en polvo",
    },
  ]);

  const t = translations[language];

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    if (query) {
      setFilteredItems(
        items.filter((item) => item.name.toLowerCase().includes(query))
      );
    } else {
      setFilteredItems([]);
    }
  };

  return (
    <section className="w-full max-w-4xl p-8 px-4 text-center backdrop-blur-sm bg-white/70 rounded-xl shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">
        {t.title}
      </h2>
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder={t.placeholder}
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 py-2 w-full border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-5">
        {(filteredItems.length > 0 ? filteredItems : items).map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white bg-opacity-90 rounded-lg shadow-md text-left hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-semibold text-green-700">
              {item.name}
            </h3>
            <p className="text-md text-gray-600">{item.description}</p>
            <p className="text-lg font-bold text-green-600 mt-5">
              {item.price}
            </p>
          </div>
        ))}
      </div>
      {filteredItems.length === 0 && searchTerm && (
        <p className="text-md text-red-400 mt-4">
          {t.noResults} "{searchTerm}"
        </p>
      )}
    </section>
  );
}
