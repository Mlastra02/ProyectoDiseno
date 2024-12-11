import { useState } from "react";
import { useRouter } from "next/router";
import { MdPerson, MdLock } from "react-icons/md";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones en el cliente
    if (!username || !password || !confirmPassword) {
      setMessage("Todos los campos son requeridos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setMessage("Correo electrónico inválido.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    // Llamada a la API
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        setMessage(data.message || "Error al registrarse");
      }
    } catch (error) {
      setMessage(`Error en la conexión con el servidor: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100">
      <div className="w-full max-w-md p-8 backdrop-blur-sm bg-white/70 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8 text-black">
          Crear Cuenta
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <MdPerson className="absolute left-3 top-3" size={24} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-green-50 text-black placeholder-black border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <MdLock className="absolute left-3 top-3" size={24} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-green-50 text-black placeholder-black border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <MdLock className="absolute left-3 top-3" size={24} />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-green-50 text-black placeholder-black border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300"
          >
            Registrarse
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-400">{message}</p>}
        <p className="mt-6 text-center text-black">
          ¿Ya tienes una cuenta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-700 cursor-pointer hover:underline"
          >
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
}
