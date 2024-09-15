import React, { useState, useEffect } from "react";

function RentCarCards() {
  const [sellCarData, setSellCarData] = useState([]);

  useEffect(() => {
    fetchSellCarData();
  }, []);

  const fetchSellCarData = () => {
    fetch("http://localhost:5000/get-sell-car-data")
      .then((response) => response.json())
      .then((data) => {
        setSellCarData(data);
      })
      .catch((error) => {
        console.error("Error fetching sell car data:", error);
      });
  };

  const handlePurchase = (carId) => {
    // Remove the card from the page
    setSellCarData(sellCarData.filter((car) => car.id !== carId));

    // Send the data to the backend
    fetch("http://localhost:5000/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ carId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Transaction added successfully:", data);
      })
      .catch((error) => {
        console.error("Error adding transaction:", error);
      });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {sellCarData.map((car, index) => (
        <SellCarCard key={index} car={car} handlePurchase={handlePurchase} />
      ))}
    </div>
  );
}

function SellCarCard({ car, handlePurchase }) {
  const handlePurchaseClick = () => {
    handlePurchase(car.id);
  };

  return (
    <div className=" border border-gray-300 rounded p-4 mb-4 w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700  hover:bg-green-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <h2 className="text-xl font-bold mb-2">{car.car_brand}</h2>
      <p className="mb-1">Model: {car.car_model}</p>
      <p className="mb-1">Number Plate: {car.car_number_plate}</p>
      <p className="mb-1">Fuel: {car.car_fuel}</p>
      <p className="mb-1">Gear: {car.car_gear}</p>
      <p className="mb-1">Price: {car.price}</p>
      <button
        type="button"
        onClick={handlePurchaseClick}
        className="w-full px-5 py-3 text-base font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Purchase
      </button>
    </div>
  );
}

export default RentCarCards;
