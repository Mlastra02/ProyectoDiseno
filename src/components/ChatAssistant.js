import { useState } from "react";

export default function ChatAssistant({ language = "es" }) {
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleChat = () => setShowChat(!showChat);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    if (isLoading) return; // Evitar solicitudes múltiples simultáneamente

    const newMessage = {
      sender: "user",
      text: userMessage,
    };

    setChatMessages([...chatMessages, newMessage]);
    setUserMessage("");
    setError(null);

    try {
      setIsLoading(true);
      const response = await fetch("/api/chatAssistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(
          language === "es"
            ? "Hubo un problema al comunicarse con el servidor."
            : "There was an issue communicating with the server."
        );
      }

      const data = await response.json();
      if (data.reply) {
        const assistantMessage = {
          sender: "assistant",
          text: data.reply,
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(
          language === "es"
            ? "No se recibió una respuesta válida del servidor."
            : "No valid response received from the server."
        );
      }
    } catch (error) {
      console.error("Error al obtener respuesta del asistente:", error);
      setError(
        error.message ||
          (language === "es"
            ? "Ocurrió un error inesperado."
            : "An unexpected error occurred.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Botón flotante */}
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300 z-50"
      >
        {language === "es" ? "Asistente" : "Assistant"}
      </button>

      {/* Ventana de chat */}
      {showChat && (
        <div className="fixed bottom-20 right-8 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {language === "es" ? "Asistente Virtual" : "Virtual Assistant"}
            </h2>
            <button
              onClick={toggleChat}
              className="text-white font-bold hover:opacity-80"
            >
              ✖
            </button>
          </div>
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {language === "es"
                  ? "Hola, soy tu asistente virtual. Pregúntame sobre listas de compras saludables."
                  : "Hi, I’m your virtual assistant. Ask me about healthy shopping lists."}
              </p>
            ) : (
              chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="text-gray-500 text-sm">
                {language === "es" ? "Escribiendo..." : "Typing..."}
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>
          <div className="p-4 flex space-x-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder={
                language === "es"
                  ? "Escribe un mensaje..."
                  : "Type a message..."
              }
              className="flex-grow border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              disabled={isLoading} // Deshabilitar botón mientras se carga
            >
              {language === "es" ? "Enviar" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
