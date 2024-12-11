import { useRouter } from "next/router";

export default function Navbar({ language = "es" }) {
  const router = useRouter();

  return (
    <nav
      className="bg-green-600 text-white shadow-lg"
      style={{
        borderBottomLeftRadius: "30px",
        borderBottomRightRadius: "30px",
        background: "linear-gradient(to right, #66bb6a, #43a047)",
      }}
    >
      <div className="flex justify-center space-x-8 py-4">
        <button
          onClick={() => router.push("/")}
          className="text-lg font-semibold hover:text-gray-200 transition"
        >
          {language === "es" ? "Inicio" : "Home"}
        </button>
        <button
          onClick={() => router.push("/busqueda-dinamica")}
          className="text-lg font-semibold bg-green-700 px-4 py-2 rounded-lg hover:bg-green-800 transition"
        >
          {language === "es" ? "Búsqueda Dinámica" : "Dynamic Search"}
        </button>
      </div>
    </nav>
  );
}
