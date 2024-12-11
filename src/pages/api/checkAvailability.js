// src/pages/api/checkAvailability.js
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';

export default async function handler(req, res) {
  const { itemName } = req.query;

  if (!itemName) {
    return res.status(400).json({ error: 'Nombre del insumo es requerido' });
  }

  // Desactivar caché en la respuesta
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Expires', '0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Surrogate-Control', 'no-store');

  const normalizedItemName = itemName.trim().toLowerCase();
  const localesPath = path.resolve(process.cwd(), 'public', 'locales'); // Modificación aquí
  let isAvailable = false;

  try {
    const localFiles = fs.readdirSync(localesPath).filter(file => file.endsWith('.csv'));
    console.log("Archivos de locales encontrados:", localFiles);

    for (const file of localFiles) {
      const filePath = path.join(localesPath, file);

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            const productName = data.name ? data.name.trim().toLowerCase() : '';
            if (productName === normalizedItemName) {
              isAvailable = true;
              console.log(`Producto "${data.name}" encontrado en ${filePath}`);
            }
          })
          .on('end', () => resolve())
          .on('error', (error) => {
            console.error("Error al procesar el archivo CSV:", error);
            reject(error);
          });
      });

      if (isAvailable) break;
    }

    res.status(200).json({ available: isAvailable });
  } catch (error) {
    console.error("Error al leer los archivos de locales:", error);
    res.status(500).json({ error: 'Error al leer los archivos de locales' });
  }
}
