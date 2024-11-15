// src/components/ListaCompras.js
import { useState } from 'react';

export default function ListaCompras({ userId, saveList }) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shoppingList, setShoppingList] = useState([]);

  const handleAddItem = async () => {
    const normalizedItemName = itemName.trim().toLowerCase();
    let isAvailable = false;

    try {
      // Llamar a la API para verificar disponibilidad
      const response = await fetch(`/api/checkAvailability?itemName=${encodeURIComponent(normalizedItemName)}`);
      const data = await response.json();
      console.log("Respuesta de disponibilidad para", normalizedItemName, ":", data);
      
      // Validar que la respuesta de la API contiene el campo esperado
      if (data && data.available) {
        isAvailable = data.available;
        console.log(`Producto "${itemName}" disponible:`, isAvailable);
      } else {
        console.warn(`Producto "${itemName}" no está disponible.`);
      }
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
    }

    const newItem = { name: itemName, quantity, available: isAvailable };
    setShoppingList((prevList) => [...prevList, newItem]);

    // Limpiar los campos de entrada
    setItemName('');
    setQuantity(1);
  };

  const handleSaveList = () => {
    saveList(userId, shoppingList);
    alert('Lista de compras guardada con éxito');
  };

  return (
    <section className="p-6 bg-gray-100 rounded-lg shadow-md text-gray-900 mb-8">
      <h2 className="text-2xl font-bold mb-4">Crear Lista de Compras</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
        />
      </div>
      <button
        onClick={handleAddItem}
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Agregar a la Lista
      </button>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Lista de Compras</h3>
        <ul>
          {shoppingList.map((item, index) => (
            <li key={index} className="flex justify-between p-3 bg-gray-200 rounded-lg mb-2">
              <span>{item.name} - Cantidad: {item.quantity}</span>
              <span className={item.available ? 'text-green-500' : 'text-red-500'}>
                {item.available ? 'Disponible' : 'No disponible'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleSaveList}
        className="w-full p-3 mt-6 bg-green-500 text-white rounded-lg hover:bg-green-700"
      >
        Guardar Lista
      </button>
    </section>
  );
}
