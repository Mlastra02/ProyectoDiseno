const bcryptjs = require("bcryptjs");
async function handler(req, res) {
  if (req.method === "POST") {
    const json = JSON.parse(req.body);
    const userName = json.userName;
    const password = json.password;
    if (!userName || !password) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }
    const getJson = await fetch("http://localhost:3001/users");

    const users = await getJson.json();
    if (users.find((user) => user.userName === userName)) {
      console.log("El usuario ya existe.");
      return res.status(400).json({ error: "El usuario ya existe." });
    }
    let passwordHash = await bcryptjs.hash(password, 8);
    await fetch("http://localhost:3001/users", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ userName: userName, password: passwordHash }),
    });
    return res
      .status(200)
      .json({ message: "Usuario registrado correctamente" });
  }

  return res.status(400).json({ error: "Método no permitido." });
}

export default handler;
