// src/pages/api/getLocalData.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export default async function handler(req, res) {
  const { local } = req.query;

  if (!local) {
    console.error("Nombre de local no proporcionado");
    return res.status(400).json({ error: 'Nombre de local requerido' });
  }

  const filePath = path.resolve(process.cwd(), 'locales', `${local}.csv`);
  const results = [];

  if (!fs.existsSync(filePath)) {
    console.error("Archivo CSV no encontrado en la ruta:", filePath);
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (data.name) {
          data.name = data.name.trim().toLowerCase(); // Convertir el nombre del producto a minúsculas
        }
        results.push(data);
      })
      .on('end', () => {
        console.log("Datos leídos exitosamente desde el archivo:", results);
        res.status(200).json(results);
      })
      .on('error', (err) => {
        console.error("Error al procesar el archivo CSV:", err);
        res.status(500).json({ error: 'Error al leer el archivo' });
      });
  } catch (error) {
    console.error("Error inesperado al intentar leer el archivo:", error);
    res.status(500).json({ error: 'Error inesperado' });
  }
}
