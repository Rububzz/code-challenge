import React from "react";

const PricePage = React.memo(({ prices, tokenImages }) => {
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <ul className="space-y-4">
        {prices.map(({ currency, price, date }, index) => {
          const numericPrice = Number(price);
          const tokenImage = tokenImages[currency.toUpperCase()]; // Match image with currency

          return (
            <li
              key={`${currency}-${date}-${index}`}
              className="flex flex-wrap items-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-md"
            >
              {tokenImage && (
                <img src={tokenImage} alt={currency} className="w-8 h-8" />
              )}
              <div>
                <strong className="text-sm">{currency}</strong>:
                <span className="ml-2 text-green-400">
                  ${isNaN(numericPrice) ? "N/A" : numericPrice.toFixed(2)}
                </span>
                <br />
                <small className="text-gray-400">
                  {new Date(date).toLocaleString()}
                </small>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default PricePage;
