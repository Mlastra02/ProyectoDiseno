import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const usuariosFilePath = path.resolve(process.cwd(), "usuarios.json");

if (!fs.existsSync(usuariosFilePath)) {
  fs.writeFileSync(usuariosFilePath, JSON.stringify([]), { flag: "w" });
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos" });
    }

    const users = JSON.parse(fs.readFileSync(usuariosFilePath, "utf8"));

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      sessionId: user.sessionId, // Retornar el mismo sessionId del usuario
    });
  } catch (error) {
    console.error("Error inesperado en la API de login:", error);
    return res.status(500).json({ message: "Error inesperado en la API de login" });
  }
}
