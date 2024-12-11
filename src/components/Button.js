import { useLanguage } from "@/context/LenguageContext";
function Button({ onClick, className, children }) {
  const { language, translations } = useLanguage();
  const translate = translations[language].homePage;
  return (
    <button
      className={`px-4 py-2 text-white font-semibold rounded transition duration-300 ${className}`}
      onClick={onClick}
    >
      {children ? children : translate.cerrarSesionBoton}
    </button>
  );
}

export default Button;
