/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from 'react';

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'cities/loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case 'cities/error':
      return { ...state, error: action.payload };
    default:
      throw new Error('uknown action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: 'cities/loading' });

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (error) {
        dispatch({
          type: 'cities/error',
          payload: 'There was an error while loading cities',
        });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    if (currentCity.id == id) return;

    dispatch({ type: 'cities/loading' });

    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: 'city/loaded', payload: data });
    } catch (error) {
      dispatch({
        type: 'cities/error',
        payload: 'There was an error while loading a city data',
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: 'cities/loading' });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      dispatch({ type: 'city/created', payload: data });
    } catch (error) {
      dispatch({
        type: 'cities/error',
        payload: 'There was an error while creating a new city',
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'cities/loading' });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch (error) {
      dispatch({
        type: 'cities/error',
        payload: 'There was an error while deleting a city',
      });
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
