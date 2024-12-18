import "../styles/tailwind.css";
import "@/styles/globals.css";
import { LanguageProvider } from "@/context/LenguageContext";

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default MyApp;
