import React from 'react';
import { useState, useEffect } from 'react';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onLogin(password, email);
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  return (
    <div className="login">
      <h2 className="login__subtitle">Вход</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <input className="login__input" required name="email" type="email" value={email} placeholder="Email" onChange={handleEmailChange} />
        <input className="login__input" required name="password" type="password" value={password} placeholder="Пароль" onChange={handlePasswordChange} />
        <button className="login__button-submit" type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;
