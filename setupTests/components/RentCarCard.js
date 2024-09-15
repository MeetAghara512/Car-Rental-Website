import React, { useState, useEffect } from "react";

function RentCarCard() {
  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = () => {
    fetch("http://localhost:5000/get-account-data")
      .then((response) => response.json())
      .then((data) => {
        setAccountData(data);
      })
      .catch((error) => {
        console.error("Error fetching account data:", error);
      });
  };

  const removeCard = (id) => {
    setAccountData(accountData.filter((account) => account.id !== id));
  };

  return (
    <div className="flex flex-col items-center">
      {accountData.map((account) => (
        <AccountCard key={account.id} account={account} removeCard={removeCard} />
      ))}
    </div>
  );
}

function AccountCard({ account, removeCard }) {
  const handlePurchase = () => {
    removeCard(account.id);
  };

  return (
    <div className="bg-blue-600 border border-green-300 rounded p-4 mb-4 ">
      <h2 className="text-xl font-bold mb-2 ">{account.car_brand}</h2>
      <p className="mb-1">Model: {account.car_model}</p>
      <p className="mb-1">Number Plate: {account.car_number_plate}</p>
      <button
        type="button"
        onClick={handlePurchase}
        className="w-full px-5 py-3 text-base font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Purchase
      </button>
    </div>
  );
}

export default RentCarCard;
