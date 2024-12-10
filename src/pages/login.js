import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdPerson, MdLock } from "react-icons/md";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("es");
  const router = useRouter();

  useEffect(() => {
    // Redirigir si el usuario ya está autenticado
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }

    // Cargar el idioma almacenado en localStorage si existe
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guardar el idioma en localStorage
    localStorage.setItem("language", language);

    try {
      // Llamada a la API de login
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      // Manejo de errores de la API
      if (!res.ok) {
        const errorMessage =
          language === "es"
            ? "Error en la autenticación. Inténtalo de nuevo."
            : "Authentication error. Please try again.";
        throw new Error(errorMessage);
      }

      const data = await res.json();

      // Guardar el sessionId y el token en localStorage
      localStorage.setItem("token", data.sessionId);
      localStorage.setItem("sessionId", data.sessionId); // Aquí se guarda el sessionId

      // Redirigir a la página principal
      router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md backdrop-blur-sm bg-white/70 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-black mb-6">
          {language === "es" ? "Iniciar Sesión" : "Login"}
        </h2>
        {/* Selector de idioma */}
        <div className="mb-4 text-center">
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="bg-green-700 text-white py-1 px-2 rounded focus:outline-none"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <MdPerson className="absolute left-3 top-3" size={24} />
            <input
              type="email"
              id="email"
              placeholder={language === "es" ? "Correo electrónico" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-green-50 text-black placeholder-black border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <MdLock className="absolute left-3 top-3" size={24} />
            <input
              type="password"
              id="password"
              placeholder={language === "es" ? "Contraseña" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-green-50 text-black placeholder-black border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300"
          >
            {language === "es" ? "Iniciar Sesión" : "Login"}
          </button>
        </form>
        <p className="text-center text-black mt-4">
          {language === "es"
            ? "¿No tienes una cuenta?"
            : "Don't have an account?"}{" "}
          <a href="/register" className="text-green-700 hover:underline">
            {language === "es" ? "Regístrate aquí" : "Sign up here"}
          </a>
        </p>
      </div>
    </div>
  );
}
