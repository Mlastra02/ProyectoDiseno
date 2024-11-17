// src/pages/api/getWalkingRoute.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método no permitido' });
    }
  
    const { userLocation, destinations } = req.body;
  
    if (!userLocation || !destinations || destinations.length === 0) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
  
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
    try {
      const coordinates = [userLocation, ...destinations].map(
        (loc) => `${loc.longitude},${loc.latitude}`
      );
  
      const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates.join(
        ';'
      )}?geometries=geojson&access_token=${accessToken}`;
  
      const response = await fetch(routeUrl);
      if (!response.ok) {
        throw new Error('Error al obtener la ruta');
      }
  
      const data = await response.json();
      const route = data.routes[0]?.geometry;
  
      if (!route) {
        return res.status(404).json({ message: 'No se pudo calcular la ruta' });
      }
  
      res.status(200).json({ route });
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  