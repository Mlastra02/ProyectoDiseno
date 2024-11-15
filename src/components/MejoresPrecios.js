import React from 'react';

export default function MejoresPrecios({ bestPrices, notFoundItems, language = 'es' }) {
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

  // Agrupar los productos por tienda donde es más barato
  const productsByStore = {};
  Object.entries(bestPrices).forEach(([productName, details]) => {
    if (!productsByStore[details.store]) {
      productsByStore[details.store] = [];
    }
    productsByStore[details.store].push({
      name: productName,
      price: details.price,
      description: details.description,
    });
  });

  return (
    <div className="w-full max-w-5xl bg-gradient-to-b from-green-200 via-green-300 to-green-100 text-gray-900 rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-3xl font-semibold text-center text-green-800 mb-6">{t.title}</h2>
      
      {Object.keys(productsByStore).length === 0 ? (
        <p className="text-center text-gray-500">{t.noResults}</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(productsByStore).map(([store, products], index) => (
            <div key={index} className="bg-green-100 p-4 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                {t.store}: {store}
              </h3>
              <ul className="space-y-2">
                {products.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    <h4 className="text-lg font-semibold text-green-800">{item.name}</h4>
                    <p className="text-sm text-green-600">{t.description}: {item.description}</p>
                    <p className="text-md font-semibold text-green-700">{t.price}: ${item.price.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Mostrar productos no encontrados */}
      {notFoundItems && notFoundItems.length > 0 && (
        <div className="mt-8 text-center text-red-500">
          <h3 className="text-2xl font-semibold mb-4">{t.notFound}</h3>
          <ul>
            {notFoundItems.map((item, index) => (
              <li key={index} className="text-lg">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
