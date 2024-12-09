import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody);
      } catch (error) {
        reject(new Error("Error al parsear el cuerpo de la solicitud"));
      }
    });
  });
};

export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  try {
    const { message } = await parseBody(req);

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Formato inválido. 'message' debe ser una cadena.",
      });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({
        error:
          "Falta la API key de OpenAI. Asegúrate de configurarla en tu archivo .env.local",
      });
    }

    // Prompt para generar la lista de alimentos
    const prompt = `
      Genera una lista de alimentos saludables para comprar en el supermercado organizados en categorías específicas.
      Responde únicamente con los alimentos, sin repetir el texto del usuario ni incluir contexto adicional. Categorías:
      - Proteínas: Pollo, pescado, huevos.
      - Carbohidratos complejos: Avena, arroz integral, batatas.
      - Grasas saludables: Aguacate, aceite de oliva, almendras.
      - Frutas: Manzanas, plátanos, fresas.
      - Vegetales: Espinacas, zanahorias, brócoli.
      Entrada del usuario: ${message}
    `;

    console.log("Enviando solicitud a OpenAI con el siguiente prompt:", prompt);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente que sugiere listas de alimentos saludables organizadas en categorías específicas.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error en la API de OpenAI:", errorDetails);
      return res.status(response.status).json({
        error: `Error en la API de OpenAI: ${response.statusText}`,
        details: errorDetails,
      });
    }

    const data = await response.json();
    console.log("Respuesta completa de OpenAI:", data);

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("No se recibió una respuesta válida de OpenAI");
    }

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("Error completo:", error);

    res.status(500).json({
      error: "Fallo al generar respuesta",
      details: error.message,
    });
  }
}
