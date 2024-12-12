import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Titulo from "@/components/Titulo";
import FormBox from "./Form/FormBox";

const ListasRecientes = ({ triggerReload }) => {
  const [userLists, setUserLists] = useState(null); // Datos de las listas del usuario
  const [expandedList, setExpandedList] = useState(null); // Lista actualmente expandida

  useEffect(() => {
    const userId = window.localStorage.getItem("userId");
    // Simular una solicitud al backend para obtener las listas del usuario
    const fetchUserLists = async () => {
      try {
        const response = await fetch("http://localhost:3001/users");
        const data = await response.json();

        const user = data.find((u) => u.id === userId);

        if (user && user.lists) {
          // Obtener las últimas dos listas
          const lists = Object.entries(user.lists)
            .slice(-2) // Las últimas dos listas
            .map(([listName, items]) => ({ name: listName, items }));

          setUserLists(lists);
        } else {
          setUserLists([]); // Usuario sin listas
        }
      } catch (error) {
        console.error("Error al obtener las listas del usuario:", error);
        setUserLists([]);
      }
    };

    fetchUserLists();
  }, [triggerReload]);

  // Alternar el menú desplegable
  const toggleList = (listName) => {
    setExpandedList((prev) => (prev === listName ? null : listName));
  };

  return (
    <FormBox>
      <Titulo className={"text-2xl md:text-3xl font-bold text-green-800"}>
        Listas recientes
      </Titulo>

      {userLists === null ? (
        <p className="text-gray-500 text-center">Cargando listas...</p>
      ) : userLists.length === 0 ? (
        <p className="text-gray-500 text-center">
          No hay listas guardadas aún.
        </p>
      ) : (
        userLists.map((list) => (
          <div
            key={list.name}
            className="mb-4 border border-gray-300 rounded-lg"
          >
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer bg-white hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleList(list.name)}
            >
              <span className="font-medium text-gray-800">{list.name}</span>
              {expandedList === list.name ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
            {expandedList === list.name && (
              <div className="px-4 py-2 bg-gray-50 rounded-b-lg">
                {list.items.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No hay productos en esta lista.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {list.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-600">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </FormBox>
  );
};

export default ListasRecientes;
