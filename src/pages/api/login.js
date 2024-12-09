import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método no permitido' });
    }

    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
    }

    const filePath = path.resolve(process.cwd(), 'usuarios.csv');

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ message: 'Archivo de usuarios no encontrado' });
    }

    const fileData = fs.readFileSync(filePath, 'utf8').trim();

    if (!fileData) {
      return res.status(500).json({ message: 'El archivo de usuarios está vacío o corrupto' });
    }

    const users = fileData
      .split('\n')
      .slice(1)
      .map((line) => {
        const [csvUsername, csvPassword] = line.split(',');
        return { username: csvUsername?.trim(), password: csvPassword?.trim() };
      })
      .filter((user) => user.username && user.password);

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un ID de sesión único
    const sessionId = uuidv4();

    // Respuesta con ID de sesión
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      sessionId, // Enviar al cliente para usar como userId del chat
    });
  } catch (error) {
    console.error('Error inesperado en el servidor:', error);
    return res.status(500).json({ message: 'Error inesperado en el servidor' });
  }
}
