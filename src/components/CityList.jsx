/* eslint-disable react/prop-types */
import { useCities } from '../contexts/CitiesContext';

import Spinner from './Spinner';
import Message from './Message';
import styles from './CityList.module.css';
import CityItem from './CityItem';

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => {
        return <CityItem city={city} key={city.id} />;
      })}
    </ul>
  );
}

export default CityList;
