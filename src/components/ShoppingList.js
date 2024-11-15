// src/components/ShoppingList.js
import { useState, useEffect } from 'react';

export default function ShoppingList({ language = 'es', onSelectList }) {
  const [listName, setListName] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [editingListName, setEditingListName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedLists = JSON.parse(localStorage.getItem(`shoppingLists_${token}`)) || [];
      setShoppingLists(storedLists);
    }
  }, []);

  const addItemToList = async () => {
    const normalizedItemName = itemName.trim().toLowerCase();
    let isAvailable = false;

    try {
      const response = await fetch(`/api/checkAvailability?itemName=${encodeURIComponent(normalizedItemName)}`);
      const data = await response.json();
      isAvailable = data.available;
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
    }

    if (!isAvailable) {
      alert(language === 'es' ? 'El insumo no está disponible' : 'Item is not available');
      return;
    }

    setCurrentList([...currentList, { name: itemName, quantity: itemQuantity }]);
    setItemName('');
    setItemQuantity(1);
  };

  const saveList = () => {
    if (!listName) {
      alert(language === 'es' ? 'Por favor, ingrese un nombre para la lista' : 'Please enter a list name');
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      let updatedLists;
      if (editingListName) {
        updatedLists = shoppingLists.map((list) =>
          list.name === editingListName ? { name: listName, items: currentList } : list
        );
      } else {
        updatedLists = [...shoppingLists, { name: listName, items: currentList }];
      }
      setShoppingLists(updatedLists);
      localStorage.setItem(`shoppingLists_${token}`, JSON.stringify(updatedLists));
    }

    setListName('');
    setCurrentList([]);
    setEditingListName(null);
    setSelectedList(null);
  };

  const handleDeleteList = (name) => {
    const token = localStorage.getItem("token");
    if (token) {
      const updatedLists = shoppingLists.filter((list) => list.name !== name);
      setShoppingLists(updatedLists);
      localStorage.setItem(`shoppingLists_${token}`, JSON.stringify(updatedLists));
      setSelectedList(null);
    }
  };

  const handleEditList = (list) => {
    setListName(list.name);
    setCurrentList(list.items);
    setEditingListName(list.name);
  };

  const handleDeleteItem = (index) => {
    setCurrentList(currentList.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-green-200 via-green-300 to-green-100 text-gray-900 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-3xl font-semibold text-green-800 mb-4 text-center">
        {language === 'es' ? 'Crear Lista de Compras' : 'Create Shopping List'}
      </h2>
      <input
        type="text"
        placeholder={language === 'es' ? 'Nombre de la lista' : 'List name'}
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        className="w-full mb-4 p-3 border border-green-300 bg-white text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div className="flex mb-4">
        <input
          type="text"
          placeholder={language === 'es' ? 'Nombre del insumo' : 'Item name'}
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="flex-1 mr-2 p-3 border border-green-300 bg-white text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="number"
          placeholder={language === 'es' ? 'Cantidad' : 'Quantity'}
          value={itemQuantity}
          onChange={(e) => setItemQuantity(Number(e.target.value))}
          min="1"
          className="w-20 p-3 border border-green-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button onClick={addItemToList} className="ml-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300">
          {language === 'es' ? 'Agregar' : 'Add'}
        </button>
      </div>

      {/* Lista de elementos agregados */}
      {currentList.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            {language === 'es' ? 'Elementos en la lista' : 'Items in the list'}
          </h3>
          <ul className="bg-green-100 bg-opacity-80 rounded-lg p-4">
            {currentList.map((item, index) => (
              <li key={index} className="flex justify-between text-green-800">
                <span>{item.name} - {language === 'es' ? `Cantidad: ${item.quantity}` : `Quantity: ${item.quantity}`}</span>
                <button onClick={() => handleDeleteItem(index)} className="text-red-400 hover:text-red-600">
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={saveList} className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 mb-6">
        {editingListName ? (language === 'es' ? 'Guardar Cambios' : 'Save Changes') : (language === 'es' ? 'Guardar Lista' : 'Save List')}
      </button>

      <h3 className="text-lg font-semibold mb-2 text-green-800">
        {language === 'es' ? 'Mis Listas de Compras' : 'My Shopping Lists'}
      </h3>
      
      {shoppingLists.length === 0 ? (
        <p className="text-center text-gray-500">
          {language === 'es' ? 'No tienes listas de compras guardadas.' : 'You have no saved shopping lists.'}
        </p>
      ) : (
        <div className="space-y-2">
          {shoppingLists.map((list) => (
            <div key={list.name} className="flex justify-between items-center">
              <span
                onClick={() => onSelectList(list.items)}
                className="cursor-pointer text-green-600 underline"
              >
                {list.name}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditList(list)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
                >
                  {language === 'es' ? 'Editar' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDeleteList(list.name)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                >
                  {language === 'es' ? 'Eliminar' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mostrar elementos de la lista seleccionada */}
      {selectedList && !editingListName && (
        <div className="mt-4 bg-green-200 p-4 rounded-lg text-green-800">
          <h3 className="text-lg font-semibold mb-2">{selectedList.name}</h3>
          <ul>
            {selectedList.items.map((item, index) => (
              <li key={index}>
                {item.name} - {language === 'es' ? `Cantidad: ${item.quantity}` : `Quantity: ${item.quantity}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
