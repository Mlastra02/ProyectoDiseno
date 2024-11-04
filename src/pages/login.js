// src/pages/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("es"); // Agregamos el estado para el idioma
  const router = useRouter();

  useEffect(() => {
    // Cargar el idioma almacenado en localStorage si existe
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Guardar el idioma en localStorage
    localStorage.setItem("language", language);

    // Lógica de autenticación
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);
      // Redirigir a la página principal
      router.push("/");
    } else {
      alert(
        language === "es"
          ? "Error en la autenticación. Inténtalo de nuevo."
          : "Authentication error. Please try again."
      );
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-blue-800 bg-opacity-80 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          {language === "es" ? "Iniciar Sesión" : "Login"}
        </h2>

        {/* Selector de idioma */}
        <div className="mb-4 text-center">
          <select
            id="language"
            // value={language}
            onChange={handleLanguageChange}
            className="bg-blue-700 text-white py-1 px-2 rounded focus:outline-none"
          >
            <option value="" disabled selected>
              {language === "es" ? "Idioma" : "Language"}
            </option>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="username"
              className="absolute left-3 top-2 text-yellow-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </label>
            <input
              type="text"
              id="username"
              placeholder={language === "es" ? "Nombre de usuario" : "Username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-3 px-10 bg-blue-700 text-white placeholder-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="absolute left-3 top-2 text-yellow-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v4m0 4v8m4-4H8"
                />
              </svg>
            </label>
            <input
              type="password"
              id="password"
              placeholder={language === "es" ? "Contraseña" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-10 bg-blue-700 text-white placeholder-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {language === "es" ? "Iniciar Sesión" : "Login"}
          </button>
        </form>
        <p className="text-center text-blue-300 mt-4">
          {language === "es"
            ? "¿No tienes una cuenta?"
            : "Don't have an account?"}{" "}
          <a href="/register" className="text-blue-100 hover:underline">
            {language === "es" ? "Regístrate aquí" : "Sign up here"}
          </a>
        </p>
      </div>
    </div>
  );
}
