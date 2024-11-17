import fs from 'fs';
import path from 'path';

const cacheFilePath = path.join(process.cwd(), 'routesCache.json');

// Leer rutas almacenadas
export function readRoutesCache() {
  if (!fs.existsSync(cacheFilePath)) {
    fs.writeFileSync(cacheFilePath, JSON.stringify({}));
  }
  const data = fs.readFileSync(cacheFilePath, 'utf-8');
  return JSON.parse(data);
}

// Guardar rutas en caché
export function writeRoutesCache(cache) {
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
}

// Obtener una ruta específica de la caché
export function getRouteFromCache(start, end) {
  const cache = readRoutesCache();
  const key = `${start.lat},${start.lng}-${end.lat},${end.lng}`;
  return cache[key];
}

// Guardar una nueva ruta en la caché
export function saveRouteToCache(start, end, routeData) {
  const cache = readRoutesCache();
  const key = `${start.lat},${start.lng}-${end.lat},${end.lng}`;
  cache[key] = routeData;
  writeRoutesCache(cache);
}
