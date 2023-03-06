import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const authInfo = localStorage.getItem('auth') || '';
  return authInfo && JSON.parse(authInfo || '')?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
