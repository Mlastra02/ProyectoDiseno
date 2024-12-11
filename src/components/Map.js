import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Cargar componentes de react-leaflet dinámicamente sin SSR
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((mod) => mod.Polyline), { ssr: false });

import 'leaflet/dist/leaflet.css';

export default function Map({ onNearbyLocal, selectedOption }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locales, setLocales] = useState([]);
  const [route, setRoute] = useState([]);
  const [notFoundItems, setNotFoundItems] = useState([]);
  const mapRef = useRef(null);
  const [userLocationIcon, setUserLocationIcon] = useState(null);
  const [businessIcon, setBusinessIcon] = useState(null);
  const [highlightedIcon, setHighlightedIcon] = useState(null);

  // Cargar íconos personalizados
  useEffect(() => {
    const loadIcons = async () => {
      const L = (await import('leaflet')).default;

      const userIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const businessIcon = new L.Icon({
        iconUrl: '/locales/tienda.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const highlightedIcon = new L.DivIcon({
        className: 'highlighted-icon',
        html: `
          <div style="transform: scale(1.4); filter: hue-rotate(180deg) brightness(1.2);">
            <img src="/locales/tienda.png" style="width: 40px; height: 40px;" />
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      setUserLocationIcon(userIcon);
      setBusinessIcon(businessIcon);
      setHighlightedIcon(highlightedIcon);
    };

    loadIcons();
  }, []);

  // Cargar locales
  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const response = await fetch('/locales/locales.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar locales.json');
        }
        const data = await response.json();
        setLocales(data);
      } catch (error) {
        console.error('Error al cargar locales:', error);
      }
    };

    fetchLocales();
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);

          if (mapRef.current) {
            mapRef.current.setView(location, 13);
          }

          if (onNearbyLocal) {
            onNearbyLocal(location);
          }
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [onNearbyLocal]);

  // Filtrar ítems no encontrados y generar la ruta caminando
  useEffect(() => {
    if (selectedOption && selectedOption.items?.length > 0 && userLocation) {
      const validItems = [];
      const notFound = [];

      selectedOption.items.forEach((item) => {
        if (item && item.store) {
          const local = locales.find((l) => l.name === item.store);
          if (local) {
            validItems.push(item);
          } else {
            notFound.push(item.name || 'Producto desconocido');
          }
        } else {
          notFound.push('Producto desconocido');
        }
      });

      setNotFoundItems(notFound);

      if (validItems.length > 0) {
        const coordinates = [
          [userLocation.lng, userLocation.lat],
          ...validItems
            .map((item) => {
              const local = locales.find((l) => l.name === item.store);
              return local ? [local.longitude, local.latitude] : null;
            })
            .filter(Boolean),
        ];

        const waypoints = coordinates.map((coord) => coord.join(',')).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/foot/${waypoints}?geometries=geojson`;

        fetch(osrmUrl)
          .then((res) => res.json())
          .then((data) => {
            if (data.routes && data.routes.length > 0) {
              setRoute(data.routes[0].geometry.coordinates);
            }
          })
          .catch((err) => console.error('Error al obtener ruta caminando:', err));
      } else {
        setRoute([]);
      }
    } else {
      setRoute([]);
    }
  }, [selectedOption, locales, userLocation]);

  if (!selectedOption) {
    return <p className="text-center text-gray-500">Selecciona una opción para mostrar el mapa.</p>;
  }

  if (!userLocation || !userLocationIcon || !businessIcon || !highlightedIcon) {
    return <p className="text-center text-gray-500">Cargando mapa...</p>;
  }

  return (
    <div className="map-container" style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>Tu ubicación</Popup>
        </Marker>

        {locales.map((local, index) =>
          local.latitude && local.longitude ? (
            <Marker
              key={index}
              position={[local.latitude, local.longitude]}
              icon={
                selectedOption.items?.some((item) => item?.store === local.name)
                  ? highlightedIcon
                  : businessIcon
              }
            >
              <Popup>{local.name}</Popup>
            </Marker>
          ) : null
        )}

        {route.length > 1 && (
          <Polyline
            positions={route.map((coord) => [coord[1], coord[0]])}
            color="blue"
            weight={4}
            opacity={0.7}
            dashArray="5,5"
          />
        )}
      </MapContainer>

      {notFoundItems.length > 0 && (
        <div className="mt-4 text-center text-red-500">
          <h3 className="text-md font-semibold mb-2">Ítems no encontrados:</h3>
          <ul>
            {notFoundItems.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
