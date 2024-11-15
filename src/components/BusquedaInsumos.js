import { useState, useEffect } from 'react';
import MejoresPrecios from './MejoresPrecios';

export default function BusquedaInsumos({ language = 'es', shoppingList }) {
  const [bestPrices, setBestPrices] = useState({});
  const [error, setError] = useState(null);
  const [notFoundItems, setNotFoundItems] = useState([]);
  const [maxDistance, setMaxDistance] = useState(5); // Distancia en km por defecto
  const [userLocation, setUserLocation] = useState(null);

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
          console.error("Error obteniendo ubicación del usuario:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchBestPrices = async () => {
      if (!userLocation) return;

      try {
        const response = await fetch('/api/getBestPrices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shoppingList, maxDistance, userLocation }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener los mejores precios');
        }

        const data = await response.json();
        setBestPrices(data.bestPrices);
        setNotFoundItems(data.notFoundItems);
        setError(null);
      } catch (err) {
        console.error("Error al obtener los mejores precios:", err);
        setError('No se pudo cargar los mejores precios');
      }
    };

    if (shoppingList.length > 0) {
      fetchBestPrices();
    }
  }, [shoppingList, maxDistance, userLocation]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <div className="mb-6">
        <label htmlFor="distance" className="block mb-2 text-gray-700">
          {language === 'es' ? 'Distancia máxima (km)' : 'Maximum distance (km)'}
        </label>
        <input
          type="number"
          id="distance"
          min="1"
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <MejoresPrecios bestPrices={bestPrices} notFoundItems={notFoundItems} language={language} />
      )}
    </div>
  );
}
