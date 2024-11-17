import { useState, useEffect } from 'react';
import MejoresPrecios from '../components/MejoresPrecios';
import Map from '../components/Map';

export default function BusquedaInsumos({ language = 'es', shoppingList }) {
  const [combinations, setCombinations] = useState([]);
  const [filteredCombinations, setFilteredCombinations] = useState([]);
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [itemsNotFound, setItemsNotFound] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación del usuario:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchCombinations = async () => {
      if (!userLocation || shoppingList.length === 0) return;

      try {
        const response = await fetch('/api/getBestPrices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shoppingList, userLocation }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener las combinaciones de precios');
        }

        const data = await response.json();
        setCombinations(data.combinations || []);
        setItemsNotFound(data.itemsNotFound || []);
        setError(null);
      } catch (err) {
        console.error('Error al obtener las combinaciones de precios:', err);
        setError('No se pudo cargar las combinaciones de precios');
      }
    };

    fetchCombinations();
  }, [shoppingList, userLocation]);

  useEffect(() => {
    // Filtrar combinaciones que no cumplen con la condición de ser dominadas
    const filterDominatedCombinations = (combinations) => {
      return combinations.filter((combA, indexA) => {
        return !combinations.some(
          (combB, indexB) =>
            indexA !== indexB &&
            combB.totalCost <= combA.totalCost &&
            combB.totalDistance <= combA.totalDistance &&
            (combB.totalCost < combA.totalCost || combB.totalDistance < combA.totalDistance)
        );
      });
    };

    setFilteredCombinations(filterDominatedCombinations(combinations));
  }, [combinations]);

  const handleNextOption = () => {
    setCurrentOptionIndex((prevIndex) =>
      prevIndex < filteredCombinations.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePreviousOption = () => {
    setCurrentOptionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const currentCombination = filteredCombinations[currentOptionIndex] || {};

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 space-y-8">
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredCombinations.length > 0 ? (
        <>
          <div className="relative flex items-center justify-center">
            {/* Botón anterior */}
            <button
              onClick={handlePreviousOption}
              disabled={currentOptionIndex === 0}
              className={`absolute left-4 p-3 rounded-full shadow-md transform transition-all ${
                currentOptionIndex === 0
                  ? 'bg-gray-300 cursor-not-allowed opacity-50'
                  : 'bg-green-600 hover:bg-green-700 hover:scale-110 text-white'
              }`}
            >
              &#8592;
            </button>

            {/* Opción actual */}
            <div
              className="p-6 bg-gradient-to-b from-green-200 via-green-300 to-green-100 text-gray-900 rounded-lg shadow-md w-full max-w-md flex flex-col transition-all"
            >
              <h3 className="text-lg font-semibold mb-2 text-center">
                {language === 'es'
                  ? `Opción ${currentOptionIndex + 1}`
                  : `Option ${currentOptionIndex + 1}`}
              </h3>
              <p className="text-sm text-center">
                {language === 'es' ? 'Distancia total a caminar' : 'Total Walking Distance'}:{' '}
                {currentCombination.totalDistance
                  ? `${currentCombination.totalDistance} km`
                  : '-'}
              </p>
              <p className="text-sm text-center mb-4">
                {language === 'es' ? 'Costo Total' : 'Total Cost'}: $
                {currentCombination.totalCost || '-'}
              </p>
              <MejoresPrecios
                items={currentCombination.items || []}
                notFoundItems={itemsNotFound}
                language={language}
              />
            </div>

            {/* Botón siguiente */}
            <button
              onClick={handleNextOption}
              disabled={currentOptionIndex === filteredCombinations.length - 1}
              className={`absolute right-4 p-3 rounded-full shadow-md transform transition-all ${
                currentOptionIndex === filteredCombinations.length - 1
                  ? 'bg-gray-300 cursor-not-allowed opacity-50'
                  : 'bg-green-600 hover:bg-green-700 hover:scale-110 text-white'
              }`}
            >
              &#8594;
            </button>
          </div>

          {/* Mapa dinámico */}
          <Map selectedOption={currentCombination} />
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-gray-500">
            {language === 'es' ? 'No se encontraron opciones.' : 'No options found.'}
          </p>
          {itemsNotFound.length > 0 && (
            <div className="mt-4 text-center text-red-500">
              <h3 className="text-md font-semibold mb-2">
                {language === 'es'
                  ? 'Productos no encontrados en locales cercanos:'
                  : 'Items not found in nearby stores:'}
              </h3>
              <ul>
                {itemsNotFound.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
