import FormBox from "@/components/Form/FormBox";
import FormInput from "@/components/Form/FormInput";
import Titulo from "@/components/Titulo";
import Button from "@/components/Button";
import { useLanguage } from "@/context/LenguageContext";

function ListaCompra() {
  const { language, translations } = useLanguage();
  const translate = translations[language].shopingList;
  return (
    <FormBox boxSize="w-2xl">
      <Titulo className={"text-2xl md:text-3xl font-bold text-green-800"}>
        {translate.tituloListaCompra}
      </Titulo>
      <p className="text-md text-gray-700/80 mb-6">
        {translate.textoAgregaProductos}
      </p>
      <div className="space-y-4">
        <div>
          <FormInput
            type={"text"}
            id={"nombreLista"}
            placeholder={translate.placeholderNombreLista}
          />
        </div>
        <div className="flex gap-2 justify-between">
          <FormInput
            type={"text"}
            id={"producto"}
            placeholder={translate.placeholderAgregarProducto}
          />
          <FormInput
            type={"number"}
            id={"cantidadProducto"}
            placeholder={"1"}
            min="1"
            defaultValue="1"
            className={"w-20"}
          />
          <Button className={"bg-green-600 hover:bg-green-700"}>
            {translate.textoBotonAgregar}
          </Button>
        </div>
        <div className="border rounded-md p-4 min-h-[100px] bg-slate-100">
          <p className="text-center text-black/80">
            {translate.textoAunNoHayProductos}
          </p>
        </div>
        <div className="w-full">
          <Button className={"w-full bg-green-600 hover:bg-green-700"}>
            {translate.textoBotonGuardar}
          </Button>
        </div>
      </div>
    </FormBox>
  );
}

export default ListaCompra;
