import { useNavigate } from 'react-router-dom';
import '../styles/containers/Header.scss';
import { LoginResponse } from './LoginForm';

const Header = () => {
  const navigate = useNavigate();

  const authInfo: LoginResponse = JSON.parse(
    localStorage.getItem('auth') || '{}'
  );
  const { token } = authInfo;

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };
  const redirectToHome = () => navigate('/');

  return (
    <div className="header">
      <button
        className="logo"
        aria-label="Go to home"
        onClick={redirectToHome}
        type="submit"
      />
      {token ? <h3>DLABS Bank</h3> : <h3>Welcome to DLABS Bank</h3>}
      <button
        type="submit"
        onClick={handleLogout}
        className={token ? 'logout-btn' : 'logout-btn-hidden'}
      >
        Log out
      </button>
    </div>
  );
};

export default Header;
