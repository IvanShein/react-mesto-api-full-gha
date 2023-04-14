import React from 'react';
import logoRegistrationSuccess from '../images/SuccessRegistration.svg';
import logoRegistrationFail from '../images/FailRegistration.svg'

function InfoTooltip(props) {
  return (
    <div className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <div className="popup__registration-status">
          <img className="popup__logo-registration-status"
            src={props.isRegistrationDone ? logoRegistrationSuccess : logoRegistrationFail}
          />
          <h2 className="popup__subtitle-registration-status">
            {props.isRegistrationDone ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
          </h2>
          <button
            onClick={props.onClose}
            type="button"
            aria-label="Кнопка закрыть окно"
            className="popup__close-button">
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
