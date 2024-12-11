import { useEffect } from "react";

export default function BotpressChat() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    const initializeBotpress = () => {
      if (window.botpressWebChat) {
        console.log("Initializing Botpress...");
        window.botpressWebChat.init({
          botId: "0b80778e-b711-48c9-a5db-11c0546ee63b",
          hostUrl: "https://cdn.botpress.cloud/webchat",
          userId: token, // Vinculamos el chat con el usuario actual
        });
        window.botpressWebChat.show();
        console.log("Botpress initialized and visible.");
      } else {
        console.error("Botpress webchat is not available.");
      }
    };

    // Reintentar inicialización hasta que el script cargue
    const interval = setInterval(() => {
      if (window.botpressWebChat) {
        clearInterval(interval);
        initializeBotpress();
      }
    }, 500);

    return () => {
      clearInterval(interval); // Limpiamos el intervalo si se desmonta el componente
    };
  }, []);

  return null; // Este componente no renderiza nada
}
