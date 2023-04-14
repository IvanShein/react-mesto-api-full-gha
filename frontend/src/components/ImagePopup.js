import React from 'react';

function ImagePopup(props) {
    return (
      <div className={`popup popup_type_foto ${props.card ? "popup_opened" : ""}`}>
        <div className="popup__container-foto">
          <img src={props.card ? props.card.link : ""} className="popup__foto" alt={`Увеличенное изображение из карточки ${props.card ? props.card.name : ""}`} />
          <p className="popup__figcaption">{props.card ? props.card.name : ""}</p>
          <button
            onClick={props.onClose}
            type="button"
            aria-label="Кнопка закрыть окно просмотра фотографии"
            className="popup__close-button popup__close-button_type_foto">
          </button>
        </div>
      </div>
    );
}

export default ImagePopup;
