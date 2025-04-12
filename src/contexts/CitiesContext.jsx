/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert('Error while fetching cities');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      alert('Error while fetching city info');
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch (error) {
      alert('Error while fetching city info');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      alert('Error while fetching city info');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const value = useContext(CitiesContext);
  if (value === undefined)
    throw new Error(
      'CitiesContext cannot be accessed outside of the CitiesProvider'
    );
  return value;
}

export { CitiesProvider, useCities };
