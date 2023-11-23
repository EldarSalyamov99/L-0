export default class Popup {
  constructor (popupSelector) {
    this._popupSelector = popupSelector;
    this.closePopup = this.closePopup.bind(this);
    this._handleOverlayClose = this._handleOverlayClose.bind(this);
    this._handleEscClose = this._handleEscClose.bind(this);
    this._pageElement = document.querySelector('.page');
  }

   openPopup() {
    this._popupSelector.classList.add('popup_opened');

    //remove scroll bar when popup is opened
    document.body.classList.add('body_unscrolled');
    this._pageElement.classList.add('page_scrolled');

    document.addEventListener('mousedown', this._handleOverlayClose);
    document.addEventListener('keydown', this._handleEscClose);
   }

   closePopup() {
    this._popupSelector.classList.remove('popup_opened');

    //smooth page scroll appearance to avoid shifting
    setTimeout(() => {
      document.body.classList.remove('body_unscrolled');
      this._pageElement.classList.remove('page_scrolled');
    }, 200)


    document.removeEventListener('mousedown', this._handleOverlayClose);
    document.removeEventListener('keydown', this._handleEscClose);
  }

  _handleEscClose(evt) {
    const activePopup = document.querySelector('.popup_opened');
    if (evt.key === 'Escape') {
      this.closePopup(activePopup);
    }
  }

  _handleOverlayClose(evt) {
    const activePopup = document.querySelector('.popup_opened');
    if (evt.target.classList.contains('popup_opened')) {
      this.closePopup(activePopup)}
  }

  setEventListeners() {
    this._popupSelector.querySelector('.popup__close-btn').addEventListener('click', this.closePopup);
  }

}
