import { useState, useEffect } from "react";

// Función para normalizar cadenas
function normalizeString(str) {
  return str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function ShoppingList({ language = "es", sessionId, onSelectList }) {
  const [listName, setListName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [editingListName, setEditingListName] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/lists?sessionId=${sessionId}`)
        .then((res) => res.json())
        .then((data) => setShoppingLists(data))
        .catch((error) => console.error("Error al cargar listas:", error));
    }
  }, [sessionId]);

  const saveListsToAPI = (updatedLists) => {
    fetch(`/api/lists?sessionId=${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shoppingLists: updatedLists }),
    }).catch((error) => console.error("Error al guardar listas:", error));
  };

  const addItemToList = () => {
    if (!itemName.trim()) {
      alert(
        language === "es"
          ? "Por favor, ingrese un nombre de insumo"
          : "Please enter an item name"
      );
      return;
    }

    setCurrentList([
      ...currentList,
      { name: itemName.trim(), quantity: itemQuantity },
    ]);
    setItemName("");
    setItemQuantity(1);
  };

  const saveList = () => {
    if (!listName.trim()) {
      alert(
        language === "es"
          ? "Por favor, ingrese un nombre para la lista"
          : "Please enter a list name"
      );
      return;
    }

    const updatedLists = editingListName
      ? shoppingLists.map((list) =>
          list.name === editingListName
            ? { name: listName, items: currentList }
            : list
        )
      : [...shoppingLists, { name: listName, items: currentList }];

    setShoppingLists(updatedLists);
    saveListsToAPI(updatedLists);

    setListName("");
    setCurrentList([]);
    setEditingListName(null);
  };

  // Definir onSelectList si no se pasa como prop
  const handleSelectList = (items) => {
    console.log("Lista seleccionada:", items);
    // Aquí podrías pasar la lógica específica
  };

  const handleDeleteItem = (index) => {
    const updatedList = currentList.filter((_, i) => i !== index);
    setCurrentList(updatedList);
  };

  const handleDeleteList = (listName) => {
    const updatedLists = shoppingLists.filter((list) => list.name !== listName);
    setShoppingLists(updatedLists);
    saveListsToAPI(updatedLists);
  };

  const handleEditList = (list) => {
    setEditingListName(list.name);
    setCurrentList(list.items);
    setListName(list.name);
  };

  return (
    <div className="w-full max-w-2xl bg-gradient-to-b from-green-200 via-green-300 to-green-100 text-gray-900 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-3xl font-semibold text-green-800 mb-4 text-center">
        {language === "es" ? "Crear Lista de Compras" : "Create Shopping List"}
      </h2>
      <input
        type="text"
        placeholder={language === "es" ? "Nombre de la lista" : "List name"}
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        className="w-full mb-4 p-3 border border-green-300 bg-white text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      <div className="flex mb-4">
        <input
          type="text"
          placeholder={language === "es" ? "Nombre del insumo" : "Item name"}
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="flex-1 mr-2 p-3 border border-green-300 bg-white text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <input
          type="number"
          placeholder={language === "es" ? "Cantidad" : "Quantity"}
          value={itemQuantity}
          onChange={(e) => setItemQuantity(Number(e.target.value))}
          min="1"
          className="w-20 p-3 border border-green-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <button
          onClick={addItemToList}
          className="ml-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
        >
          {language === "es" ? "Agregar" : "Add"}
        </button>
      </div>

      {currentList.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            {language === "es" ? "Elementos en la lista" : "Items in the list"}
          </h3>
          <ul className="bg-green-100 bg-opacity-80 rounded-lg p-4 space-y-2">
            {currentList.map((item, index) => (
              <li
                key={index}
                className="flex justify-between text-green-800"
              >
                <span>
                  {item.name} -{" "}
                  {language === "es"
                    ? `Cantidad: ${item.quantity}`
                    : `Quantity: ${item.quantity}`}
                </span>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={saveList}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 mb-6"
      >
        {editingListName
          ? language === "es"
            ? "Guardar Cambios"
            : "Save Changes"
          : language === "es"
          ? "Guardar Lista"
          : "Save List"}
      </button>

      <h3 className="text-lg font-semibold mb-2 text-green-800">
        {language === "es" ? "Mis Listas de Compras" : "My Shopping Lists"}
      </h3>

      {shoppingLists.length === 0 ? (
        <p className="text-center text-gray-500">
          {language === "es"
            ? "No tienes listas de compras guardadas."
            : "You have no saved shopping lists."}
        </p>
      ) : (
        <div className="space-y-2">
          {shoppingLists.map((list) => (
            <div
              key={list.name}
              className="flex justify-between items-center bg-green-100 rounded-lg p-3 hover:shadow-lg transition"
            >
              <span
                onClick={() =>
                  (onSelectList || handleSelectList)(
                    list.items.map((item) => ({
                      ...item,
                      name: normalizeString(item.name),
                    }))
                  )
                }
                className="cursor-pointer text-green-600 font-semibold hover:underline"
              >
                {list.name}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditList(list)}
                  className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  {language === "es" ? "Editar" : "Edit"}
                </button>
                <button
                  onClick={() => handleDeleteList(list.name)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  {language === "es" ? "Eliminar" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
