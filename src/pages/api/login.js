// src/pages/api/login.js
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
  }

  const filePath = path.resolve(process.cwd(), 'usuarios.csv');

  // Verificar que el archivo existe antes de intentar leerlo
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ message: 'Archivo de usuarios no encontrado' });
  }

  try {
    const users = [];
    const fileData = fs.readFileSync(filePath, 'utf8');  // Leer archivo sincrónicamente

    // Parsear CSV manualmente
    const lines = fileData.split('\n');
    lines.forEach(line => {
      const [csvUsername, csvPassword] = line.split(',');
      if (csvUsername && csvPassword) {
        users.push({ username: csvUsername.trim(), password: csvPassword.trim() });
      }
    });

    // Buscar usuario
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Respuesta exitosa
    return res.status(200).json({ message: 'Inicio de sesión exitoso' });

  } catch (error) {
    console.error("Error inesperado:", error);
    return res.status(500).json({ message: 'Error inesperado en el servidor' });
  }
}
