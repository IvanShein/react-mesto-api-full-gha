import React from 'react';
import mestoLogo from '../images/mesto_logo.svg';
import { Route, Switch, Link } from 'react-router-dom';

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={mestoLogo} alt="Место Россия - логотип" />
      <div className='header__login-info'>
      <Switch>
        <Route path="/sign-in">
            <Link to="/sign-up" className="header__signin-link">Регистрация</Link>
        </Route>
        <Route path="/sign-up">
            <Link to="/sign-in" className="header__signin-link">Войти</Link>
        </Route>
        <Route exact path="/">
            <p className="header__email">{props.email}</p>
            <Link to='/sign-in' className="header__signout-link" onClick={props.onSignOut}>Выйти</Link>
        </Route>
      </Switch>
      </div>
    </header>
  );
}

export default Header;
