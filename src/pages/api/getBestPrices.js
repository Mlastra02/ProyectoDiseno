import path from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';

const EARTH_RADIUS_KM = 6371;

// Calcular la distancia en línea recta (Haversine)
function calculateHaversineDistance(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const toRad = (value) => (value * Math.PI) / 180;

  const deltaLat = toRad(lat2 - lat1);
  const deltaLon = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizeString(str) {
  return str
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export default async function handler(req, res) {
  const { shoppingList, userLocation } = req.body;

  if (!shoppingList || !Array.isArray(shoppingList) || !userLocation) {
    return res.status(400).json({ message: 'Datos de entrada no válidos' });
  }

  try {
    const localesPath = path.join(process.cwd(), 'public', 'locales', 'locales.json');
    const localesData = JSON.parse(fs.readFileSync(localesPath, 'utf-8'));

    const nearbyLocales = localesData.filter((local) => {
      const distance = calculateHaversineDistance(
        [userLocation.longitude, userLocation.latitude],
        [local.longitude, local.latitude]
      );
      return distance <= 2;
    });

    if (nearbyLocales.length === 0) {
      return res.status(200).json({
        message: 'No se encontraron locales dentro de 2 km.',
        combinations: [],
        itemsNotFound: shoppingList.map((item) => item.name),
      });
    }

    const itemOptions = {};
    const itemsNotFound = [];

    await Promise.all(
      shoppingList.map(async (item) => {
        const options = [];

        for (const local of nearbyLocales) {
          const filePath = path.join(process.cwd(), 'public', 'locales', local.csvFile);
          const products = await readCSV(filePath);

          const product = products.find(
            (p) => normalizeString(p.name) === normalizeString(item.name)
          );

          if (product) {
            const price = parseFloat(product.price);
            const distance = calculateHaversineDistance(
              [userLocation.longitude, userLocation.latitude],
              [local.longitude, local.latitude]
            );

            options.push({
              name: product.name,
              store: local.name,
              price,
              description: product.description || 'Descripción no disponible',
              distance,
            });
          }
        }

        if (options.length > 0) {
          itemOptions[item.name] = options;
        } else {
          itemsNotFound.push(item.name);
        }
      })
    );

    const combinations = [];
    function generateCombinations(index, combination, totalCost, totalDistance) {
      if (index === shoppingList.length) {
        combinations.push({
          totalCost: parseFloat(totalCost.toFixed(2)),
          totalDistance: parseFloat(totalDistance.toFixed(2)),
          items: combination,
        });
        return;
      }

      const itemName = shoppingList[index].name;
      const options = itemOptions[itemName] || [];
      if (options.length === 0) {
        generateCombinations(index + 1, [...combination, null], totalCost, totalDistance);
      } else {
        options.forEach((option) => {
          generateCombinations(
            index + 1,
            [...combination, option],
            totalCost + option.price,
            totalDistance + option.distance
          );
        });
      }
    }

    generateCombinations(0, [], 0, 0);

    // Seleccionar las tres combinaciones principales
    const lowestCostOption = combinations.reduce((a, b) => (a.totalCost < b.totalCost ? a : b));
    const shortestDistanceOption = combinations.reduce((a, b) =>
      a.totalDistance < b.totalDistance ? a : b
    );
    const balancedOption = combinations.reduce((a, b) =>
      a.totalCost + a.totalDistance < b.totalCost + b.totalDistance ? a : b
    );

    const uniqueOptions = [lowestCostOption, shortestDistanceOption, balancedOption].filter(
      (option, index, self) =>
        self.findIndex(
          (o) =>
            o.totalCost === option.totalCost && o.totalDistance === option.totalDistance
        ) === index
    );

    res.status(200).json({
      combinations: uniqueOptions,
      itemsNotFound,
    });
  } catch (error) {
    console.error('Error procesando los datos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
