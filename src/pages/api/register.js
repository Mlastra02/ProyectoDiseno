// src/pages/api/register.js
import bcrypt from 'bcrypt';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Ruta del archivo Excel donde se guardan los datos de usuario
  const filePath = path.resolve(process.cwd(), 'usuarios.xlsx');
  const workbook = new ExcelJS.Workbook();

  let worksheet;
  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
    worksheet = workbook.getWorksheet('Usuarios');
  } else {
    worksheet = workbook.addWorksheet('Usuarios');
    worksheet.columns = [
      { header: 'Username', key: 'username', width: 30 },
      { header: 'Password', key: 'password', width: 60 },
    ];
  }

  // Verifica si el usuario ya existe en la columna `Username`
  const existingUser = worksheet.getColumn('username').values.includes(username);

  if (existingUser) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  // Agrega el nuevo usuario al archivo
  worksheet.addRow({ username, password: hashedPassword });

  // Guarda el archivo Excel
  await workbook.xlsx.writeFile(filePath);

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
}
