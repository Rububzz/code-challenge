import PricePage from "./PricePage.jsx";
import ConversionForm from "./ConversionForm.jsx";
import React, { useEffect, useState } from "react";
import Datasource from "./Datasource.jsx";

function App() {
  const [tokenImages, setTokenImages] = useState({});
  const [prices, setPrices] = useState([]);

  const tokens = import.meta.glob("./assets/*.svg");

  useEffect(() => {
    // Prevent the entire page from scrolling
    document.body.style.overflow = "hidden";

    const fetchSvg = async () => {
      const images = {};
      for (const path in tokens) {
        const modules = await tokens[path]();
        const filename = path.split("/").pop()?.replace(".svg", "");
        if (filename) {
          images[filename.toUpperCase()] = modules.default;
        }
      }
      setTokenImages(images);
    };

    const fetchData = async () => {
      const datasource = new Datasource(
        "https://interview.switcheo.com/prices.json",
      );
      try {
        let data = await datasource.getPrices();
        const uniqueData = [
          ...new Map(
            data.map((item) => [`${item.currency}-${item.date}`, item]),
          ).values(),
        ];
        setPrices(uniqueData);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };
    fetchSvg();
    fetchData();

    // Clean up the effect to reset body overflow when the component is unmounted
    return () => {
      document.body.style.overflow = "auto"; // Restore default scrolling behavior
    };
  }, []);

  return (
    <div className="flex h-full overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800">
      {/* Left Section: Takes 1/5 of the screen width */}
      <div className="w-[20vw] h-full p-4 flex flex-col justify-start">
        <h1 className="text-3xl font-bold text-center text-gray-200">
          Cryptocurrency Prices
        </h1>

        {/* Scrollable PricePage, limit the height */}
        <div className="overflow-y-auto flex-1 max-h-screen">
          <PricePage prices={prices} tokenImages={tokenImages} />
        </div>
      </div>

      {/* Right Section: Takes the remaining 4/5 of the screen width */}
      <div className="w-[80vw] h-full flex flex-col">
        {/* Other content */}
        <h1 className="text-9xl text-transparent font-bold mb-6 text-center bg-gradient-to-r from-gray-200 to-gray-500 by bg-clip-text leading-normal">
          Currency Swap
        </h1>
        <h2 className="text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
          Simply press on the currency and select the currency you want to
          convert to and from, <br />
          and press convert!
        </h2>
        <div className="items-center justify-items-self align-middle mt-8">
          <ConversionForm prices={prices} tokens={tokenImages} />
        </div>
      </div>
    </div>
  );
}

export default App;
