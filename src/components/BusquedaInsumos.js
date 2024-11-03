import { useState } from 'react';

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
        <section className="text-center py-8 px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-b from-blue-900 to-blue-700 text-white min-h-screen flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-100">
                Búsqueda de Insumos Alimentarios
            </h2>
            <div className="mb-8 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Buscar insumo (ej. Arroz, Frijoles)"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-5 w-full max-w-5xl">
                {(filteredItems.length > 0 ? filteredItems : items).map((item) => (
                    <div key={item.id} className="p-4 bg-blue-800 bg-opacity-80 rounded-lg shadow-lg text-left">
                        <h3 className="text-xl font-semibold text-blue-100">{item.name}</h3>
                        <p className="text-md text-blue-200">{item.description}</p>
                        <p className="text-lg font-bold text-blue-300 mt-2">{item.price}</p>
                    </div>
                ))}
            </div>
            {filteredItems.length === 0 && searchTerm && (
                <p className="text-md text-red-400 mt-4">No se encontraron resultados para "{searchTerm}"</p>
            )}
        </section>
    );
}
