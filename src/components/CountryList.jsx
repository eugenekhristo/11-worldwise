/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import Spinner from './Spinner';
import Message from './Message';
import styles from './CountryList.module.css';
import CountryItem from './CountryItem';

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  const countries = cities.reduce((arrAcc, city) => {
    if (!arrAcc.map((city) => city?.country).includes(city.country)) {
      return [...arrAcc, { country: city.country, emoji: city.emoji }];
    } else {
      return arrAcc;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => {
        return <CountryItem country={country} />;
      })}
    </ul>
  );
}

export default CountryList;
