async function requestHandler(req, res) {
  if (req.method === "POST") {
    const json = JSON.parse(req.body);
    const userId = json.userId;
    const list = json.list;
    const listName = json.listName;

    if (!userId || !list || !listName) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const getJson = await fetch("http://localhost:3001/users");

    const users = await getJson.json();

    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(400).json({ error: "usuario no encontrado." });
    }

    if (!user.lists) {
      user.lists = {};
    }
    user.lists[listName] = list;

    await fetch(`http://localhost:3001/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(user),
    });

    return res.status(200).json({ message: "Lista guardada correctamente." });
  }

  return res.status(400).json({ error: "Método no permitido." });
}

export default requestHandler;
