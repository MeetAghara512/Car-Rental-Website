import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import Selector from "./Selector";
import { NavLink } from 'react-router-dom';

function GetCar() {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Gujarat');
  const [city, setCity] = useState('Navsari');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   
    setCountryData(Country.getAllCountries());
  }, []);

  useEffect(() => {
    
    if (country) {
      setStateData(State.getStatesOfCountry(country?.isoCode)); 
    }
  }, [country]);

  useEffect(() => {
    
    if (state && country) {
      setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode)); 
    }
  }, [state, country]);

  const handleGetCars = async () => {
    try {
      if (!country || !state || !city || !country.name || !state.name || !city.name) {
        console.error("Country, state, or city is null or missing name property");
        return;
      }

      setLoading(true);
      console.log(country.name);
      console.log(state.name);
      console.log(city.name);

      const response = await fetch("http://localhost:5000/get-cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: country.name,
          state: state.name,
          city: city.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setCars(data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
     
    }
  };

  return (
    <section className="selector-area">
      <section className="min-h-screen bg-gray-100 grid place-items-center">
        <div>
          <h2 className="text-2xl font-bold text-teal-900">
            Country, State and City Selectors
          </h2>
          <br />
          <div className="flex flex-wrap gap-3 bg-teal-300 rounded-lg p-8">
            <div>
              <p className="text-teal-800 font-semibold">Country :</p>
              <Selector
                data={countryData}
                selected={country}
                setSelected={setCountry}
              />
            </div>
            {state && (
              <div>
                <p className="text-teal-800 font-semibold">State :</p>
                <Selector
                  data={stateData}
                  selected={state}
                  setSelected={setState}
                />
              </div>
            )}
            {city && (
              <div>
                <p className="text-teal-800 font-semibold">City :</p>
                <Selector
                  data={cityData}
                  selected={city}
                  setSelected={setCity}
                />
              </div>
            )}
          </div>
          <NavLink to ='/RentCarCards'><button
            className="w-[80px] h-[50px] relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 m-[5%]"
          >
            {loading ? "Loading..." : "Done"}
          </button></NavLink>
        </div>
      </section>
    </section>
  );
}

export default GetCar;
