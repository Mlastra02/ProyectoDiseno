import { useLanguage } from "@/context/LenguageContext";
import { useState } from "react";
import insumosData from "@/data/insumosData.json";
import Card from "./Card/Card";
import CardHeader from "./Card/CardHeader";
import CardContent from "./Card/CardContent";

function BusquedaInsumos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const { language, translations } = useLanguage();

  const insumos = insumosData[language];

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    if (query) {
      setFilteredItems(
        insumos.filter((item) => item.name.toLowerCase().includes(query))
      );
    } else {
      setFilteredItems([]);
    }
  };

  return (
    <section className="w-full max-w-4xl p-8 px-4 text-center backdrop-blur-sm bg-white/70 rounded-xl shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">
        {translations[language].tituloBusquedaAlimentos}
      </h2>
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder={translations[language].placeholderBusquedaAlimentos}
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 py-2 w-full border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-5">
        {(filteredItems.length > 0 ? filteredItems : insumos).map((item) => (
          <Card
            key={item.id}
            className="p-4 bg-white bg-opacity-90 rounded-lg shadow-md text-left hover:shadow-lg transition duration-300"
          >
            <CardHeader className="text-xl font-semibold text-green-700">
              {item.name}
            </CardHeader>
            <CardContent className="text-md text-gray-600">
              {item.description}
            </CardContent>
            <CardContent className="text-lg font-bold text-green-600 mt-5">
              {item.price}
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredItems.length === 0 && searchTerm && (
        <p className="text-md text-red-400 mt-4">
          {translations[language].sinResultados} "{searchTerm}"
        </p>
      )}
    </section>
  );
}

export default BusquedaInsumos;
