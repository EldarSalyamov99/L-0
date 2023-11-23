import Popup from './Popup.js'

export default class PaymentPopup extends Popup {
  constructor (popupSelector, cardTemplate, renderedItems, container) {
    super(popupSelector);
    this._cardTemplate = cardTemplate;
    this._renderedItems = renderedItems;
    this._container = container;
    this._selectedCard = renderedItems.find(i => i.checked);
    this._formElement = this._popupSelector.querySelector('.form-payment');
    this._initialCard = renderedItems.find(i => i.checked);
    this._submittedCard;
  }

  openPopup() {
    super.openPopup();
    this._droppData()
  }

  _closePopup() {
    super.closePopup();
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardTemplate)
      .content
      .cloneNode(true);

    return cardElement;
  }

  _generateCard(card) {
    this._card = this._getTemplate();

    this._icon = this._card.querySelector('.form-payment__card-icon');
    this._number = this._card.querySelector('.form-payment__card-number');
    this._input = this._card.querySelector('.radio-btn__input');

    this._icon.src = card.logo;
    this._icon.alt = card.name;
    this._number.textContent = card.number;
    this._input.checked = card.checked;
    this._input.name = 'card';

    this._setInnerEventListeners(card);

    //generate initial card
    this._updateCardData();

    return this._card;
  }

  //drop selected data if form was closed without submit
  _droppData() {
    const allCards = this._popupSelector.querySelectorAll('.form-payment__card-number');

    if (this._submittedCard) {
      const savedCardElement = Array.from(allCards).find(i => i.textContent === this._submittedCard.number);
      savedCardElement.closest('.form-payment__radio-btn').control.checked = true;
    } else {
      const savedCardElement = Array.from(allCards).find(i => i.textContent === this._initialCard.number);
      savedCardElement.closest('.form-payment__radio-btn').control.checked = true;
    }
  }

  renderItems() {
    const items = this._renderedItems.reverse();
    items.forEach((item) => {
      const generatedItem = this._generateCard(item);
      this._addItem(generatedItem);
    });
  }

  _addItem(element) {
    this._container.prepend(element);
  }

  _handleCardChange(card) {
    this._selectedCard = card;
  }

  _updateCardData() {
    this._orderCardIcon = document.querySelector('.order__icon-card');
    this._orderCardNumber = document.querySelector('.order__card-number');
    this._cartCardIcon = document.querySelector('.cart-payment__card-icon');
    this._cartCardNumber = document.querySelector('.cart-payment__card-number');
    this._cartCardValidity = document.querySelector('.cart-payment__card-date');

    //save card in order form
    this._orderCardIcon.src = this._selectedCard.logo;
    this._orderCardIcon.alt = this._selectedCard.name;
    this._orderCardNumber.textContent = this._selectedCard.number;

    //save card in cart-delivery form
    this._cartCardIcon.src = this._selectedCard.logo;
    this._cartCardIcon.alt = this._selectedCard.name;
    this._cartCardNumber.textContent = this._selectedCard.number;
    this._cartCardValidity.textContent = this._selectedCard.validity;
  }

  //save selected card
  _submitForm(e) {
    e.preventDefault();
    this._updateCardData();
    this._submittedCard = this._selectedCard;
    this._closePopup();

  }

  _setInnerEventListeners(card) {
    this._input.addEventListener('change', () => this._handleCardChange(card));
  }

  setEventListeners() {
    super.setEventListeners();
    this._formElement.addEventListener('submit', e => this._submitForm(e));
  }

}
