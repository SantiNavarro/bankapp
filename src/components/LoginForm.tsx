import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/containers/LoginForm.scss';
import '../styles/containers/Loader.scss';

type Currency = 'UY' | 'USD' | 'EUR';

export interface Account {
  name: string;
  amount: string;
  currency: Currency;
  id: string;
}
interface User {
  name: string;
  surname: string;
  accountsList: Account[];
}
export interface LoginResponse {
  token: string;
  user: User;
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleLogin = async (): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await axios.get(
      'https://my-json-server.typicode.com/SantiNavarro/myjsonserver-bank/login',
      { data: { email, password } }
    );
    console.log(response);
    return response.data;
  };

  const { mutate, isLoading, error } = useMutation<LoginResponse, Error>(
    handleLogin,
    {
      onSuccess: (data) => {
        console.log('Login successful', data);
        localStorage.setItem('auth', JSON.stringify(data));
        navigate('/');
      },
      onError: (error) => {
        console.log('Login failed', error);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="email">
          <input
            type="text"
            id="email"
            value={email}
            placeholder="Email"
            onChange={handleEmailChange}
          />
        </label>

        <label htmlFor="password">
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={handlePasswordChange}
          />
        </label>

        {isLoading ? (
          <div className="loader">
            <div>&nbsp;</div>
            <div>&nbsp;</div>
          </div>
        ) : (
          <button type="submit" className="btn" onClick={() => mutate()}>
            Login
          </button>
        )}

        {error && error instanceof Error && <p>{error?.message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
