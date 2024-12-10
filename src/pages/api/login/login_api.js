import bcryptjs from "bcryptjs";
// import { jw } from "jsonwebtoken";
import { generateToken } from "@/utils/token";
async function handlerLogin(req, res) {
  if (req.method === "POST") {
    const json = JSON.parse(req.body);
    const userName = json.userName;
    const password = json.password;
    if (!userName || !password) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const getJson = await fetch("http://localhost:3001/users");

    const users = await getJson.json();

    const user = users.find((user) => user.userName === userName);

    if (!user) {
      return res.status(400).json({ error: "usuario no encontrado." });
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "contraseña incorrecta." });
    }

    const token = generateToken(userName);
    return res
      .status(200)
      .json({ token, message: "Usuario logueado correctamente" });
  }
  return res.status(400).json({ error: "Método no permitido." });
}

export default handlerLogin;
