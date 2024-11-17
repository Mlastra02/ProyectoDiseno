import Header from "@/components/Header";
import Titulo from "@/components/Titulo";
import FormBox from "@/components/Form/FormBox";
import Form from "@/components/Form/Form";
import { useLanguage } from "@/context/LenguageContext";
import Main from "@/components/Main";
import FormLink from "@/components/Form/FormLink";
import { useState } from "react";

export default function Login() {
  const { language, translations } = useLanguage();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const tarnslate = translations[language].login;

  const handleChangeUserName = (e) => setUserName(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userName, password);
  };
  return (
    <div className="bg-gradient-to-b from-green-200 via-green-300 to-green-100 min-h-screen flex flex-col">
      <Header />
      <Main>
        <FormBox boxSize="max-w-md">
          <Titulo
            className={"text-3xl font-semibold text-center text-green-800 mb-6"}
          >
            {tarnslate.tituloIniciarSesion}
          </Titulo>
          <Form
            textUsername={tarnslate.placeholderNombreUsuario}
            textPassword={tarnslate.placeholderContrasena}
            textButton={tarnslate.iniciarSesionBoton}
            handleSubmit={handleSubmit}
            handleChangeUserName={handleChangeUserName}
            handleChangePassword={handleChangePassword}
          />
          <FormLink
            text={tarnslate.textoPregunta}
            href={"/register"}
            textLink={tarnslate.link}
          />
        </FormBox>
      </Main>
    </div>
  );
}
