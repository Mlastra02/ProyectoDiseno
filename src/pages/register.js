import Header from "@/components/Header";
import Titulo from "@/components/Titulo";
import FormBox from "@/components/Form/FormBox";
import Form from "@/components/Form/Form";
import { useLanguage } from "@/context/LenguageContext";
import Main from "@/components/Main";
import FormLink from "@/components/Form/FormLink";
import { useState } from "react";
import FormInput from "@/components/Form/FormInput";

export default function Login() {
  const { language, translations } = useLanguage();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChangeUserName = (e) => setUserName(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeVerifyPassword = (e) => setVerifyPassword(e.target.value);

  const handleSubmit = async (e) => {
    setError("");
    setMessage("");
    e.preventDefault();
    const res = await fetch("api/register/register_api", {
      method: "POST",
      body: JSON.stringify({ userName, password, verifyPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
    }
    setError(data.error);
  };

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
            handleSubmit={handleSubmit}
            handleChangeUserName={handleChangeUserName}
            handleChangePassword={handleChangePassword}
          >
            <FormInput
              id={"verifyPassword"}
              type={"password"}
              placeholder={tarnslate.placeholderVerificarContrasena}
              handleChange={handleChangeVerifyPassword}
            />
          </Form>
          <FormLink
            text={tarnslate.textoPregunta}
            href={"/login"}
            textLink={tarnslate.link}
          />
          <p>
            {message && <span className="text-green-800">{message}</span>}
            {error && <span className="text-red-800">{error}</span>}
          </p>
        </FormBox>
      </Main>
    </div>
  );
}
