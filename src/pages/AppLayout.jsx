// import { useEffect } from 'react';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import User from '../components/User';
import { useAuth } from '../contexts/FakeAuthContext';
import styles from './AppLayout.module.css';
// import { useNavigate } from 'react-router-dom';

function AppLayout() {
  const { isAuthenticated } = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated) navigate('/login');
  // }, [isAuthenticated, navigate]);

  return (
    <div className={styles.app}>
      {isAuthenticated && <User />}
      <Sidebar />
      <Map />
    </div>
  );
}

export default AppLayout;
