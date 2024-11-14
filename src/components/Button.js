import { useLanguage } from "@/context/LenguageContext";
function Button() {
  const { language, translations } = useLanguage();
  return (
    <button className="mt-8 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300">
      {translations[language].cerrarSesionBoton}
    </button>
  );
}

export default Button;
