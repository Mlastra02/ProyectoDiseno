// src/components/BusquedaInsumos.js
import { useState } from 'react';

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

export default function BusquedaInsumos({ language = 'es' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [items] = useState([
    { id: 1, name: "Arroz", price: "$1.00", description: "Arroz blanco de grano largo" },
    { id: 2, name: "Frijoles", price: "$1.50", description: "Frijoles negros" },
    { id: 3, name: "Aceite de Oliva", price: "$5.00", description: "Aceite de oliva extra virgen" },
    { id: 4, name: "Azúcar", price: "$0.80", description: "Azúcar blanca refinada" },
    { id: 5, name: "Leche", price: "$1.20", description: "Leche entera en polvo" },
  ]);

  const t = translations[language];

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    if (query) {
      setFilteredItems(items.filter(item => item.name.toLowerCase().includes(query)));
    } else {
      setFilteredItems([]);
    }
  };

  return (
    <section className="w-full max-w-5xl text-center py-8 px-4 bg-gradient-to-b from-blue-900 to-blue-700 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-blue-100">
        {t.title}
      </h2>
      <div className="mb-8">
        <input
          type="text"
          placeholder={t.placeholder}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md p-3 border border-blue-300 bg-blue-50 text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-5">
        {(filteredItems.length > 0 ? filteredItems : items).map((item) => (
          <div key={item.id} className="p-4 bg-blue-800 bg-opacity-90 rounded-lg shadow-md text-left">
            <h3 className="text-xl font-semibold text-blue-100">{item.name}</h3>
            <p className="text-md text-blue-200">{item.description}</p>
            <p className="text-lg font-bold text-blue-300 mt-2">{item.price}</p>
          </div>
        ))}
      </div>
      {filteredItems.length === 0 && searchTerm && (
        <p className="text-md text-red-400 mt-4">{t.noResults} "{searchTerm}"</p>
      )}
    </section>
  );
}
