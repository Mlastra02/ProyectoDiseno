import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { username, password, confirmPassword } = req.body;

  // Validaciones en el servidor
  if (!username || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Todos los campos son requeridos.' });
  }

  // Validación de formato del correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res.status(400).json({ message: 'Correo electrónico inválido.' });
  }

  // Validación de coincidencia de contraseñas
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }

  const filePath = path.resolve(process.cwd(), 'usuarios.csv');

  try {
    // Crear el archivo si no existe
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'Username,Password\n');
    }

    const data = fs.readFileSync(filePath, 'utf8').trim();
    const rows = data.split('\n').slice(1);

    // Validar si el usuario ya existe
    const userExists = rows.some((row) => row.split(',')[0] === username);
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserLine = `${username},${hashedPassword}\n`;
    fs.appendFileSync(filePath, newUserLine);

    return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error al manejar el archivo CSV:', error);
    return res.status(500).json({ message: 'Error al manejar el archivo de usuarios.' });
  }
}
