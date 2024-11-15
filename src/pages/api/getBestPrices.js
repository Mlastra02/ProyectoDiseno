import path from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function handler(req, res) {
  const { shoppingList, maxDistance, userLocation } = req.body;

  if (!shoppingList || !Array.isArray(shoppingList) || !userLocation) {
    return res.status(400).json({ message: 'Datos de entrada no válidos' });
  }

  try {
    // Cargar locales.json desde la carpeta `public/locales`
    const localesPath = path.join(process.cwd(), 'public', 'locales', 'locales.json');
    const localesData = JSON.parse(fs.readFileSync(localesPath, 'utf-8'));

    const bestPrices = {};
    const notFoundItems = new Set(shoppingList.map(item => item.name.toLowerCase()));

    for (const local of localesData) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        local.latitude,
        local.longitude
      );

      if (distance > maxDistance) continue; // Filtrar locales fuera del rango

      // Cargar el archivo CSV específico de cada local desde `public/locales`
      const filePath = path.join(process.cwd(), 'public', 'locales', local.csvFile);
      const results = [];

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            shoppingList.forEach((item) => {
              const normalizedItemName = item.name.trim().toLowerCase();
              const product = results.find(
                (p) => p.name && p.name.trim().toLowerCase() === normalizedItemName
              );
              if (product) {
                const price = parseFloat(product.price);
                if (
                  !bestPrices[item.name] ||
                  bestPrices[item.name].price > price
                ) {
                  bestPrices[item.name] = {
                    price,
                    store: local.name,
                    description: product.description,
                  };
                }
                notFoundItems.delete(normalizedItemName);
              }
            });
            resolve();
          })
          .on('error', (error) => reject(error));
      });
    }

    res.status(200).json({ bestPrices, notFoundItems: Array.from(notFoundItems) });
  } catch (error) {
    console.error("Error al procesar archivos CSV:", error);
    res.status(500).json({ message: 'Error al procesar los archivos de locales' });
  }
}
