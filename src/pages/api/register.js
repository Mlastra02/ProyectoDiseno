import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const usuariosFilePath = path.resolve(process.cwd(), "usuarios.json");

if (!fs.existsSync(usuariosFilePath)) {
  fs.writeFileSync(usuariosFilePath, JSON.stringify([]), { flag: "w" });
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const users = JSON.parse(fs.readFileSync(usuariosFilePath, "utf8"));

    if (users.some((u) => u.username === username)) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
      sessionId: uuidv4(), // Generar sessionId único
    };

    users.push(newUser);
    fs.writeFileSync(usuariosFilePath, JSON.stringify(users, null, 2));

    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error inesperado en la API de registro:", error);
    return res.status(500).json({ message: "Error inesperado en la API de registro" });
  }
}
