import fs from "fs";
import path from "path";

const listasFilePath = path.resolve(process.cwd(), "listas.json");

if (!fs.existsSync(listasFilePath)) {
  fs.writeFileSync(listasFilePath, JSON.stringify({}), { flag: "w" });
}

export default async function handler(req, res) {
  try {
    const { method } = req;

    if (method === "GET") {
      const { sessionId } = req.query;

      if (!sessionId) {
        return res.status(400).json({ message: "Se requiere sessionId para obtener las listas" });
      }

      const listas = JSON.parse(fs.readFileSync(listasFilePath, "utf8"));

      return res.status(200).json(listas[sessionId] || []);
    }

    if (method === "POST") {
      const { sessionId } = req.query;
      const { shoppingLists } = req.body;

      if (!sessionId || !Array.isArray(shoppingLists)) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      const listas = JSON.parse(fs.readFileSync(listasFilePath, "utf8"));

      listas[sessionId] = shoppingLists; // Asociar listas al sessionId
      fs.writeFileSync(listasFilePath, JSON.stringify(listas, null, 2));

      return res.status(200).json({ message: "Listas guardadas exitosamente" });
    }

    res.status(405).json({ message: "Método no permitido" });
  } catch (error) {
    console.error("Error inesperado en la API de listas:", error);
    res.status(500).json({ message: "Error inesperado en la API de listas" });
  }
}
