import { useEffect, useRef, useState } from "react";
import React from "react";

const CustomSelect = ({ options, value, onChange, getToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchValue("");
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().startsWith(searchValue.toLowerCase()),
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="w-full p-2 bg-gray-700 text-white rounded-md flex"
      >
        <span className="flex-grow justify-items-start">{value}</span>
        <div className="items-end">
          {getToken && getToken(value)} {/* Token image on the right */}
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-gray-800 text-white mt-1 rounded-md">
          <div className="sticky top-0 bg-gray-800 p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
          </div>
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={`${option.value}-${index}`}
                onClick={() => handleSelect(option.value)}
                className="p-2 hover:bg-gray-700 cursor-pointer flex items-center"
              >
                <span className="flex-grow">{option.label}</span>
                <div className="items-end">
                  {getToken && getToken(option.value)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ConversionForm = React.memo(({ prices, tokens }) => {
  const [inputNumber, setInputNumber] = useState("");
  const [convertedNumber, setConvertedNumber] = useState("");
  const [inputCurrency, setInputCurrency] = useState("");
  const [outputCurrency, setOutputCurrency] = useState("");
  const [currencyMap, setCurrencyMap] = useState([]);

  const getToken = (value) => {
    return (
      <img
        src={tokens[value.toUpperCase()]}
        alt={tokens}
        className="w-full h-8"
      />
    );
  };

  useEffect(() => {
    if (prices.length > 0) {
      setInputCurrency(prices[0].currency); // Set the first available currency
      setOutputCurrency(prices[0].currency);
    }
    const priceMap = {};
    prices.forEach(({ currency, price }) => {
      priceMap[currency.toUpperCase()] = price;
    });
    setCurrencyMap(priceMap);
  }, [prices]);

  const handleConversion = (inputCurrency, inputNumber, outputCurrency) => {
    const input = currencyMap[inputCurrency.toUpperCase()];
    const output = currencyMap[outputCurrency.toUpperCase()];
    const conversion = output / input;
    const returnvalue = (parseInt(inputNumber) * conversion).toString();
    setConvertedNumber(returnvalue);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mt-2">
              <label
                className="block text-lg font-semibold mb-2"
                htmlFor="inputCurrency"
              >
                From Currency:
              </label>
              <CustomSelect
                value={inputCurrency}
                onChange={setInputCurrency}
                options={prices.map((item) => ({
                  value: item.currency,
                  label: item.currency,
                }))}
                getToken={getToken}
              />
            </div>
            <label
              className="block text-lg font-semibold mb-2 mt-2"
              htmlFor="inputNumber"
            >
              Enter Value:
            </label>
            <input
              id="inputNumber"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="mt-2">
              <label
                className="block text-lg font-semibold mb-2"
                htmlFor="outputCurrency"
              >
                To Currency:
              </label>
              <CustomSelect
                value={outputCurrency}
                onChange={setOutputCurrency}
                options={prices.map((item) => ({
                  value: item.currency,
                  label: item.currency,
                }))}
                getToken={getToken}
              />
            </div>
            <label
              className="block text-lg font-semibold mb-2 mt-2"
              htmlFor="convertedNumber"
            >
              Converted Number:
            </label>
            <input
              id="convertedNumber"
              value={convertedNumber}
              readOnly
              className="w-full p-2 bg-gray-700 text-white rounded-md"
            />
            <button
              onClick={() =>
                handleConversion(inputCurrency, inputNumber, outputCurrency)
              }
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Convert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ConversionForm;
