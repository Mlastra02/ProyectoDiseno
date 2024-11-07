import bcrypt from 'bcrypt';
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

  // Ruta del archivo CSV donde se guardan los datos de usuario
  const filePath = path.resolve(process.cwd(), 'usuarios.csv');

  try {
    // Verificar si el archivo CSV existe, si no, crearlo con un encabezado
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'Username,Password\n'); // Encabezado de las columnas
      console.log("Archivo CSV creado con encabezados.");
    }

    // Leer el archivo CSV y verificar si el usuario ya existe
    const data = fs.readFileSync(filePath, 'utf8');
    const rows = data.split('\n');
    const userExists = rows.some(row => row.split(',')[0] === username);

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Agregar el nuevo usuario al final del archivo CSV
    const newUserLine = `${username},${hashedPassword}\n`;
    fs.appendFileSync(filePath, newUserLine);

    console.log("Usuario agregado al archivo CSV exitosamente.");
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error("Error al manejar el archivo CSV:", error);
    res.status(500).json({ message: 'Error al manejar el archivo de usuarios' });
  }
}
