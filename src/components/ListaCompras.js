import { useState, useEffect } from 'react';

export default function ListaCompras() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const storedList = JSON.parse(sessionStorage.getItem('shoppingList')) || [];
    console.log("Lista cargada desde sessionStorage:", storedList);
    setShoppingList(storedList);
  }, []);

  const handleAddItem = () => {
    const newItem = { name: itemName, quantity };
    const updatedList = [...shoppingList, newItem];
    setShoppingList(updatedList);
    sessionStorage.setItem('shoppingList', JSON.stringify(updatedList));
    console.log("Lista guardada en sessionStorage:", updatedList);
    setItemName('');
    setQuantity(1);
  };

  const handleClearSessionStorage = () => {
    sessionStorage.clear();
    console.log("sessionStorage limpiado");
    setShoppingList([]); // Limpiar también el estado
  };

  return (
    <section style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Lista de Compras</h2>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        style={{ padding: '5px', margin: '5px' }}
      />
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ padding: '5px', margin: '5px' }}
      />
      <button
        onClick={handleAddItem}
        style={{ backgroundColor: 'blue', color: 'white', padding: '10px', margin: '5px' }}
      >
        Agregar a la Lista
      </button>
      <button
        onClick={handleClearSessionStorage}
        style={{ backgroundColor: 'red', color: 'white', padding: '10px', margin: '5px' }}
      >
        Limpiar Sesión
      </button>

      <h3>Items en la Lista:</h3>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>
            {item.name} - Cantidad: {item.quantity}
          </li>
        ))}
      </ul>
    </section>
  );
}
