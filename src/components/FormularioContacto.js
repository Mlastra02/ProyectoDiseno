import { useState } from "react";

export default function FormularioContacto() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setResponse("Todos los campos son obligatorios");
    } else {
      // Enviar los datos a la API o procesarlos como sea necesario
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setResponse("¡Mensaje enviado con éxito!");
      } else {
        setResponse("Hubo un error al enviar el mensaje.");
      }

      // Reiniciar el formulario
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <section className="bg-surface text-onSurface py-12 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-lg bg-primaryContainer">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-onPrimaryContainer font-sans text-center">
          Contáctanos
        </h2>
        <p className="text-base md:text-lg leading-relaxed text-onPrimaryContainer text-center mb-6">
          ¿Tienes alguna pregunta? Envíanos un mensaje.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-onPrimaryContainer mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded border border-outline bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Escribe tu nombre"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-onPrimaryContainer mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded border border-outline bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Escribe tu email"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-onPrimaryContainer mb-1">
              Mensaje
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded border border-outline bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Escribe tu mensaje"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-onPrimary font-semibold rounded-lg hover:bg-primaryContainer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Enviar
          </button>
        </form>
        {response && <p className="text-center text-red-500 mt-4">{response}</p>}
      </div>
    </section>
  );
}
