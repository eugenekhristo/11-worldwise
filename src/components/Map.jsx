/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import styles from './Map.module.css';
import { useCities } from '../contexts/CitiesContext';
import Button from './Button';
import { useGeolocation } from '../hooks/useGeolocation';
import { useUrlPosition } from '../hooks/useurlPosition';

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [lat, lng] = useUrlPosition();
  const {
    isLoading: isLoadingCurrent,
    position: positionCurrent,
    getPosition: getPositionCurrent,
  } = useGeolocation();

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (positionCurrent)
      setMapPosition([positionCurrent.lat, positionCurrent.lng]);
  }, [positionCurrent]);

  return (
    <div className={styles.mapContainer}>
      {!positionCurrent && (
        <Button
          type="position"
          onClick={() => {
            getPositionCurrent();
          }}
        >
          {isLoadingCurrent ? 'Loading...' : 'Get my position'}
        </Button>
      )}

      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      // setMapPosition([e.latlng.lat, e.latlng.lng]);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
