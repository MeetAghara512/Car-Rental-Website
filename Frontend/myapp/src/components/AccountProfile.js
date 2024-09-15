import React, { useState, useEffect } from "react";
import axios from "axios";

function UserDetails() {
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [carDetails, setCarDetails] = useState([]);
  const [loadingCarDetails, setLoadingCarDetails] = useState(true);
  const [showSoldCars, setShowSoldCars] = useState(false);
  const [soldCarsFetched, setSoldCarsFetched] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [tokenEmail, setTokenEmail] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserDataWithDelay = async () => {
      const delay = 1000; 
      await new Promise((resolve) => setTimeout(resolve, delay));
      fetchUserData();
    };
    fetchUserDataWithDelay();
  }, []);

  useEffect(() => {
    const fetchUserTransactionsWithDelay = async () => {
      const delay = 3000; 
      await new Promise((resolve) => setTimeout(resolve, delay));
      fetchUserTransactions();
    };
    fetchUserTransactionsWithDelay();
  }, []);

  useEffect(() => {
    const fetchDataWithDelay = async () => {
      const delay = 5000; 
      await new Promise((resolve) => setTimeout(resolve, delay));
      try {
        const response = await fetch(
          "http://localhost:5000/sell-car-data-tokens"
        );
        if (response.ok) {
          const data = await response.json();
          setCarDetails(data);
          setSoldCarsFetched(true); 
          setLoadingCarDetails(false);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Internal server error");
        setLoadingCarDetails(false);
      }
    };

    if (!soldCarsFetched) {
     
      fetchDataWithDelay();
    }
  }, [soldCarsFetched]); 

  useEffect(() => {
    const fetchTokenEmailWithDelay = async () => {
      const delay = 2000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    };
    fetchTokenEmailWithDelay();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-user-details");
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        setError("Failed to fetch user details");
      }
      setLoadingTransactions(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Internal server error");
      setLoadingTransactions(false);
    }
  };

  const fetchUserTransactions = async () => {
    try {
      const response = await fetch("http://localhost:5000/user-transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        setError("Failed to fetch user transactions");
      }
      setLoadingTransactions(false);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      setError("Internal server error");
      setLoadingTransactions(false);
    }
  };

  const handleSubmit = async (transactionPrice) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(transactionPrice);
      const response = await fetch("http://localhost:5000/submit_car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify({ price: transactionPrice }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message);
        fetchUserTransactions();
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Internal server error");
    }
  };

  const handleRemoveSellCar = async (price, carModel) => {
    try {
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const response = await axios.post('http://localhost:5000/remove_sell_car_data', {
        price: price,
        car_model: carModel
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Internal server error');
    }
  };

  if (loadingTransactions || loadingCarDetails) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-3/4 m-auto mt-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-black">
            First name: {userData.first_name}
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Last name: {userData.last_name}
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Phone number: {userData.phone_number}
          </p>
        </div>
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Email address: {userData.email}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-center mb-4 text-3xl font-semibold text-gray-800">User Has bought</h2>
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="  border border-gray-300 rounded p-4 mb-4 px-5 py-3 text-base font-medium text-center text-white bg-blue-700  hover:bg-green-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <h2 className="text-xl font-bold mb-2">Car Details</h2>
            <p className="mb-1">Car Brand: {transaction.car_brand}</p>
            <p className="mb-1">Car Model: {transaction.car_model}</p>
            <p className="mb-1">Price: {transaction.price}</p>
            <p className="mb-1">
              Transaction Date: {transaction.transaction_date}
            </p>
            <button
              type="button"
              onClick={() => handleSubmit(transaction.price)}
              disabled={loading}
              className="w-full px-5 py-3 text-base font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
            {error && <div className="text-red-500">{error}</div>}
            <hr />
          </div>
        ))}
      </div>
      {soldCarsFetched && (
        <div className="container mt-5">
          <h1 className="text-center mb-4 text-3xl font-semibold text-gray-800">
            User has sold
          </h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {carDetails.map((car, index) => (
              <div
                key={index}
                className="p-4 border border-black rounded-lg"
              >
                <p className="text-xl font-semibold mb-2">
                  Car Brand :{car.car_brand} 
                </p> 
                <p className="text-xl font-semibold mb-2">
                  Car Model :{car.car_model}
                </p>
                <p className="text-gray-600 mb-2 font-semibold">Number Plate : {car.car_number_plate}</p>
                <p className="text-lg font-bold text-green-600">Price :{car.price}</p>
                <button
                  type="button" 
                  onClick={() => handleRemoveSellCar(car.price, car.car_model)}
                  className="mt-4 px-5 py-3 text-base font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-blue-300 sm:w-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
