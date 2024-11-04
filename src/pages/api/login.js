// src/pages/api/login.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Nombre de usuario y contraseña son requeridos" });
  }

  const filePath = path.resolve(process.cwd(), "usuarios.xlsx");
  const workbook = new ExcelJS.Workbook();

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({ message: "Base de datos de usuarios no encontrada" });
  }

  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet("Usuarios");

  if (!worksheet) {
    return res.status(404).json({
      message: 'Hoja de cálculo "Usuarios" no encontrada en el archivo Excel',
    });
  }

  let foundUser = null;

  // Recorrer las filas en la hoja de cálculo para encontrar el usuario
  worksheet.eachRow((row) => {
    const usernameCell = row.getCell(1).value; // Asumiendo que el nombre de usuario está en la primera columna
    const passwordHashCell = row.getCell(2).value; // Asumiendo que el hash de la contraseña está en la segunda columna

    if (usernameCell === username) {
      foundUser = { username: usernameCell, passwordHash: passwordHashCell };
    }
  });

  if (!foundUser) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { username: foundUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.status(200).json({ token, message: "Inicio de sesión exitoso" });
}
