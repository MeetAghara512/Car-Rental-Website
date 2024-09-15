import React, { useState, useEffect } from 'react';

function SellCarList() {
    const [carsForSale, setCarsForSale] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/sell-car');
                const data = await response.json();
                setCarsForSale(data);
            } catch (error) {
                console.error('Error fetching cars for sale:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Cars For Sale</h2>
            <table>
                <thead>
                    <tr>
                        <th>Car Brand</th>
                        <th>Car Model</th>
                        <th>Car Number Plate</th>
                        <th>Car Fuel</th>
                        <th>Car Gear</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {carsForSale.map((car) => (
                        <tr key={car.id}>
                            <td>{car.car_brand}</td>
                            <td>{car.car_model}</td>
                            <td>{car.car_number_plate}</td>
                            <td>{car.car_fuel}</td>
                            <td>{car.car_gear}</td>
                            <td>{car.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SellCarList;
