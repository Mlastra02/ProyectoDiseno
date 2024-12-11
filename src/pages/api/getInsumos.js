import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export default async function handler(req, res) {
  const filePath = path.resolve(process.cwd(), 'insumos.csv');
  const items = [];

  if (req.method === 'GET') {
    try {
      // Leer el archivo CSV y agregar cada elemento al array items
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          items.push({
            id: row.id,
            name: row.name,
            description: row.description,
            price: parseFloat(row.price),
          });
        })
        .on('end', () => {
          res.status(200).json(items);
        });
    } catch (error) {
      console.error("Error al leer el archivo CSV:", error);
      res.status(500).json({ message: "Error al leer los datos de insumos" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
