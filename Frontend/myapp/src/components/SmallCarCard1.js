import React from "react";

function SmallCarCard1({ car }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{car.car_name}</h2>
      <p className="mb-1">Price: {car.price}</p>
      <p className="mb-1">Car ID: {car.car_id}</p>
    </div>
  );
}

export default SmallCarCard1;
