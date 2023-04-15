import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import { useEffect, useState } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/Api.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Route, Switch, Redirect, useHistory, BrowserRouter as Router } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import authorisation from '../utils/Authorisation.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('none');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isRegistrationDone, setIsRegistrationDone] = useState(false);
  const history = useHistory();
  const token = localStorage.getItem('token');

  const checkToken = (token) => {
    if (token) {
      authorisation.checkToken(token)
        .then((data) => {
          setLoggedIn(true);
          setEmail(data.email);
          history.push("/");
        })
        .catch((error) => {
          console.log(`К сожалению, возникла ошибка: ${error}`);
        });
    }
  };

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInformation(), api.getInitialCards()])
        .then(([userData, initialCards]) => {
          setCurrentUser(userData);
          setCards(initialCards);
        })
        .catch((error) => {
          console.log(`К сожалению, возникла ошибка: ${error}`);
        });
    }
    checkToken(token)
  }, [loggedIn]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card)
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((error) => {
        console.log(`К сожалению, возникла ошибка: ${error}`);
      })
  };

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.log(`К сожалению, возникла ошибка: ${error}`);
      })
  };

  const handleUpdateUser = (userInformation) => {
    api.sendUserInformation(userInformation.name, userInformation.about)
      .then((userInformation) => {
        setCurrentUser(userInformation);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(`К сожалению, возникла ошибка: ${error}`);
      })

  };

  const handleUpdateAvatar = (userInformation) => {
    api.sendUserAvatarLink(userInformation.avatar)
      .then((userInformation) => {
        setCurrentUser(userInformation);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(`К сожалению, возникла ошибка: ${error}`);
      })
  };

  const handleAddPlaceSubmit = (cardInformation) => {
    api.sendNewCard(cardInformation)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(`К сожалению, возникла ошибка: ${error}`);
      })
  };

  const handleLogin = (password, email) => {
    authorisation.signIn(password, email)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setLoggedIn(true);
          history.push('/');
          setEmail(email);
        } else {
          setIsRegistrationDone(false);
          setIsInfoTooltipOpen(true);
        }
      })
      .catch((error) => {
        setIsRegistrationDone(false);
        setIsInfoTooltipOpen(true);
        console.log(`К сожалению, возникла ошибка: ${error}`);
      })
  };

  const handleRegister = (password, email) => {
    authorisation.registration(password, email)
      .then(() => {
        history.push('/sign-in');
        setIsRegistrationDone(true);
        setIsInfoTooltipOpen(true);
      })
      .catch((error) => {
        setIsRegistrationDone(false);
        setIsInfoTooltipOpen(true);
        console.log(`К сожалению, возникла ошибка: ${error}`);
      })
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history.push('/sign-in');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          email={email}
          onSignOut={handleSignOut}
        />

        <Switch>
        <ProtectedRoute exact path="/"
            component={Main}
            loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}>
          </ProtectedRoute>
          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
          </Route>
          <Route path="*">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        {loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          name="delete-confirmation"
          title="Вы уверены?"
          buttonText="Да"
          children={<></>} />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isRegistrationDone={isRegistrationDone}
        />

      </div >
    </CurrentUserContext.Provider>
  )
};

export default App;
