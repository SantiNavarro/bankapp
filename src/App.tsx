import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import './App.scss';
import PrivateRoutes from './utils/PrivateRoutes';
import Login from './pages/Login';

const App = () => (
  <Routes>
    <Route element={<PrivateRoutes />}>
      <Route element={<HomePage />} path="/" />
    </Route>
    <Route element={<Login />} path="/login" />
  </Routes>
);

export default App;
