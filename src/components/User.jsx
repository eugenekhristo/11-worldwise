import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/FakeAuthContext';
import styles from './User.module.css';
import { useEffect } from 'react';

function User() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleClick() {
    logout();
    navigate('/');
  }

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [user, navigate, isAuthenticated]);

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
