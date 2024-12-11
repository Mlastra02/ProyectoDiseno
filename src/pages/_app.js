import Script from "next/script";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Script para BotPress Webchat */}
      <Script
        src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"
        strategy="afterInteractive"
      ></Script>
      <Script
        id="botpress-webchat-init"
        src="https://files.bpcontent.cloud/2024/12/09/16/20241209161453-Z66CIAUQ.js"
        strategy="afterInteractive"
      ></Script>

      {/* Renderizado del componente principal */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
