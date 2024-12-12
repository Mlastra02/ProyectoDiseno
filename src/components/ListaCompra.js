import FormBox from "@/components/Form/FormBox";
import FormInput from "@/components/Form/FormInput";
import Titulo from "@/components/Titulo";
import Button from "@/components/Button";
import Confetti from "@/components/Confetti";
import { useLanguage } from "@/context/LenguageContext";
import { useState } from "react";
import { Trash2 } from "lucide-react";

function ListaCompra({ onListSaved }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [listName, setListName] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [shadowMessage, setShadowMessage] = useState(false);
  const { language, translations } = useLanguage();
  const translate = translations[language].shopingList;

  const addItem = () => {
    if (newItem.trim() !== "") {
      setItems([...items, { name: newItem, quantity: newQuantity }]);
      setNewItem("");
      setNewQuantity(1);
    }
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const handleSave = async () => {
    const res = await fetch("api/lists/saveList_api", {
      method: "POST",
      body: JSON.stringify({
        list: items,
        userId: localStorage.getItem("userId"),
        listName: listName,
      }),
    });
    if (res.ok) {
      setShadowMessage(true);
      setShowConfetti(true);

      if (onListSaved) {
        onListSaved();
      }
      setTimeout(() => {
        setShadowMessage(false);
      }, 3000);
    }
    setListName("");
    setItems([]);
  };
  return (
    <FormBox boxSize="max-w-3xl">
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
            handleChange={(e) => setListName(e.target.value)}
            value={listName}
          />
        </div>
        <div className="flex gap-2 justify-between">
          <FormInput
            type={"text"}
            id={"producto"}
            placeholder={translate.placeholderAgregarProducto}
            className={"w-64"}
            handleChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            value={newItem}
          />
          <FormInput
            type={"number"}
            id={"cantidadProducto"}
            placeholder={"1"}
            min="1"
            className={"w-20"}
            handleChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
            value={newQuantity}
          />
          <Button
            onClick={addItem}
            className={"bg-green-600 hover:bg-green-700"}
          >
            {translate.textoBotonAgregar}
          </Button>
        </div>
        <div className="border rounded-md p-4 min-h-[100px] bg-slate-100">
          {items.length > 0 ? (
            <>
              <h3 className="text-black font-semibold text-left text-lg underline">
                {listName}
              </h3>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-black">
                      {item.quantity}x {item.name}
                    </span>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-slate-200 rounded-md"
                    >
                      <Trash2 size={24} className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-center text-black/50">
              {translate.textoAunNoHayProductos}
            </p>
          )}
        </div>
        <div className="w-full">
          <Button
            className={"w-full bg-green-600 hover:bg-green-700"}
            onClick={handleSave}
          >
            {translate.textoBotonGuardar}
          </Button>
        </div>
        {shadowMessage && (
          <div className="mt-4 p-2 text-green-700 rounded">
            {translate.mensajeGuardado}
          </div>
        )}
      </div>
      {showConfetti && <Confetti />}
    </FormBox>
  );
}

export default ListaCompra;
