// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './Form.module.css';
import Button from './Button';
import ButtonBack from './ButtonBack';
import { useUrlPosition } from '../hooks/useurlPosition';
import Spinner from './Spinner';
import Message from './Message';
import DatePicker from 'react-datepicker';
import { useCities } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [lat, lng] = useUrlPosition();
  const [emoji, setEmoji] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { createCity, isLoading: isLoadingContext } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCity() {
      try {
        setError('');
        setIsLoading(true);

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode)
          throw new Error(
            'There is no such a country out there! 😅 Please click on a different location'
          );

        setCityName(data.city || data.locality || '');
        setEmoji(() => convertToEmoji(data.countryCode));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCity();
  }, [lat, lng]);

  async function handleSumbit(e) {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate('/app');
  }

  if (isLoading) return <Spinner />;
  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;
  if (error) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${isLoadingContext ? styles.loading : ''}`}
      onSubmit={(e) => handleSumbit(e)}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat={'dd/MM/yyyy'}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <ButtonBack />
        <Button type="primary">Add</Button>
      </div>
    </form>
  );
}

export default Form;
