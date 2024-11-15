import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Cargar componentes de react-leaflet dinámicamente sin SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import 'leaflet/dist/leaflet.css';

export default function Map({ onNearbyLocal }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locales, setLocales] = useState([]);
  const mapRef = useRef(null);
  const [isCentered, setIsCentered] = useState(true);
  const [userLocationIcon, setUserLocationIcon] = useState(null);
  const [businessIcon, setBusinessIcon] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import('leaflet').then(L => {
        const userIcon = new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        const businessIcon = new L.Icon({
          iconUrl: '/locales/tienda.png', // Cambia la ruta para que coincida con `public/locales/tienda.png`
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });

        setUserLocationIcon(userIcon);
        setBusinessIcon(businessIcon);
      });
    }
  }, []);

  useEffect(() => {
    // Cargar los locales desde `public/locales/locales.json`
    const fetchLocales = async () => {
      try {
        const response = await fetch('/locales/locales.json'); // Ruta correcta si locales.json está en la carpeta `public/locales`
        if (!response.ok) {
          throw new Error("No se pudo cargar locales.json");
        }
        const data = await response.json();
        setLocales(data);
      } catch (error) {
        console.error("Error al cargar locales:", error);
      }
    };

    fetchLocales();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);

          if (mapRef.current && isCentered) {
            mapRef.current.setView(location, 13);
          }

          if (onNearbyLocal) {
            onNearbyLocal(location);
          }
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isCentered, onNearbyLocal]);

  const handleCenterMap = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView(userLocation, 13);
      setIsCentered(true);
    }
  };

  const handleUserMarkerDragEnd = (event) => {
    const newLatLng = event.target.getLatLng();
    setUserLocation({ lat: newLatLng.lat, lng: newLatLng.lng });
    
    if (mapRef.current) {
      mapRef.current.setView(newLatLng, mapRef.current.getZoom());
    }

    if (onNearbyLocal) {
      onNearbyLocal({ lat: newLatLng.lat, lng: newLatLng.lng });
    }
  };

  if (!userLocation || !userLocationIcon || !businessIcon) {
    return <p>Cargando mapa...</p>;
  }

  return (
    <div className="map-container" style={{ height: "400px", width: "100%", position: 'relative' }}>
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => { mapRef.current = mapInstance }}
        eventHandlers={{
          dragstart: () => setIsCentered(false),
          zoomstart: () => setIsCentered(false),
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcador de la ubicación del usuario */}
        <Marker
          position={userLocation}
          icon={userLocationIcon}
          draggable={true}
          eventHandlers={{
            dragend: handleUserMarkerDragEnd,
          }}
        >
          <Popup>Tu ubicación</Popup>
        </Marker>

        {/* Marcadores para los locales */}
        {locales.map((local, index) => (
          local.latitude && local.longitude && (
            <Marker
              key={index}
              position={[local.latitude, local.longitude]}
              icon={businessIcon}
            >
              <Popup>{local.name}</Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Botón para centrar el mapa en la ubicación del usuario */}
      {!isCentered && (
        <button
          onClick={handleCenterMap}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Centrar en mi ubicación
        </button>
      )}
    </div>
  );
}
