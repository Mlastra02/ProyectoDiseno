import React from 'react';

export default function MejoresPrecios({ items = [], notFoundItems = [], language = 'es' }) {
  const translations = {
    es: {
      title: 'Mejores Precios por Local',
      store: 'Tienda',
      price: 'Precio',
      noResults: 'No se encontraron productos con mejores precios.',
      description: 'Descripción',
      notFound: 'Productos no encontrados en locales cercanos:',
    },
    en: {
      title: 'Best Prices by Store',
      store: 'Store',
      price: 'Price',
      noResults: 'No products found with best prices.',
      description: 'Description',
      notFound: 'Items not found in nearby stores:',
    },
  };

  const t = translations[language];

  const productsByStore = {};
  items.forEach((item) => {
    if (item && item.store) {
      if (!productsByStore[item.store]) {
        productsByStore[item.store] = [];
      }
      productsByStore[item.store].push({
        name: item.name || 'Producto desconocido',
        price: item.price || 0.0,
        description: item.description || t.noResults,
      });
    }
  });

  return (
    <div className="w-full">
      {Object.keys(productsByStore).length === 0 ? (
        <p className="text-center text-gray-500">{t.noResults}</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(productsByStore).map(([store, products], index) => (
            <div key={index} className="bg-green-100 p-4 rounded-lg shadow-md">
              <h3 className="text-md font-semibold text-green-700 mb-2">
                {t.store}: {store}
              </h3>
              <ul className="space-y-1">
                {products.map((item, idx) => (
                  <li key={idx} className="mb-1">
                    <h4 className="text-sm font-semibold text-green-800">{item.name}</h4>
                    <p className="text-xs text-green-600">
                      {t.description}: {item.description}
                    </p>
                    <p className="text-sm font-semibold text-green-700">
                      {t.price}: ${item.price.toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {notFoundItems.length > 0 && (
        <div className="mt-4 text-center text-red-500">
          <h3 className="text-md font-semibold mb-2">{t.notFound}</h3>
          <ul>
            {notFoundItems.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
