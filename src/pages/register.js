import Header from "@/components/Header";
import Titulo from "@/components/Titulo";
import FormBox from "@/components/Form/FormBox";
import Form from "@/components/Form/Form";
import { useLanguage } from "@/context/LenguageContext";
import Main from "@/components/Main";
import FormLink from "@/components/Form/FormLink";

export default function Login() {
  const { language, translations } = useLanguage();
  const tarnslate = translations[language].register;
  return (
    <div className="bg-gradient-to-b from-green-200 via-green-300 to-green-100 min-h-screen flex flex-col">
      <Header />
      <Main>
        <FormBox boxSize="max-w-md">
          <Titulo
            className={"text-3xl font-semibold text-center text-green-800 mb-6"}
          >
            {tarnslate.tituloRegistro}
          </Titulo>
          <Form
            textUsername={tarnslate.placeholderNombreUsuario}
            textPassword={tarnslate.placeholderContrasena}
            textButton={tarnslate.registroBoton}
          />
          <FormLink
            text={tarnslate.textoPregunta}
            href={"/login"}
            textLink={tarnslate.link}
          />
        </FormBox>
      </Main>
    </div>
  );
}
