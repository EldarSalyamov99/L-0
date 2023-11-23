import Popup from './Popup.js'

export default class DeliveryPopup extends Popup {
  constructor (popupSelector, addressTemplate, toggleAddresses, defaultAddress, defaultPickupAddress) {
    super(popupSelector);
    this._addressTemplate = addressTemplate;
    this._formElement = this._popupSelector.querySelector('.form-delivery');
    this._popupSbtBtn = this._formElement.querySelector('.popup__sbt-btn');
    this._deliveryBtnCourier = this._popupSelector.querySelector('.form-delivery__del-courier');
    this._deliveryBtnPickup = this._popupSelector.querySelector('.form-delivery__del-pickup');
    this._courierAddressBox = this._popupSelector.querySelector('.form-delivery__adress-box-courier');
    this._pickupAddressBox = this._popupSelector.querySelector('.form-delivery__adress-box-pickup');
    this._initialSbtBtn = this._popupSbtBtn.textContent;
    this._toggleDeliveryType = this._toggleDeliveryType.bind(this);
    this.toggleAddresses = toggleAddresses;
    this._initialAddress = { courier: defaultAddress.address, pickUp: defaultPickupAddress.address, activeType: 'pickUp', rating: 0 };
    this._selectedAddress = { courier: defaultAddress.address, pickUp: defaultPickupAddress.address, activeType: 'pickUp', rating: 0 };
    this._submittedAddress;
  }

  openPopup() {
    super.openPopup();
    this._updateAddressBoxWidth([this._courierAddressBox, this._pickupAddressBox]);
    this._dropData();
  }

  _closePopup() {
    super.closePopup();
  }

  //drop selected data if form was closed without submit
  _dropData() {
    const allInputs = this._popupSelector.querySelectorAll('.radio-btn__value');

    if (!this._submittedAddress) {
      const initialInputCourier = Array.from(allInputs).find(i => i.textContent === this._initialAddress.courier);
      const initialInputpickup = Array.from(allInputs).find(i => i.textContent === this._initialAddress.pickUp);
      if (initialInputCourier) initialInputCourier.nextElementSibling.checked = true;
      if (initialInputpickup) initialInputpickup.nextElementSibling.checked = true;

      const activeBtn = this._initialAddress.activeType === 'pickUp' ? this._deliveryBtnPickup : this._deliveryBtnCourier;
      this._toggleDeliveryType(activeBtn);
    } else {
      const submittedAddress = Array.from(allInputs).find(i => i.textContent === this._submittedAddress[this._submittedAddress.activeType]);
      const inActiveType = this._submittedAddress.activeType === 'pickUp' ? 'courier' : 'pickUp';

      const initialInactiveInput = Array.from(allInputs).find(i => i.textContent === this._initialAddress[inActiveType]);
      if (submittedAddress) submittedAddress.nextElementSibling.checked = true;
      if (initialInactiveInput) initialInactiveInput.nextElementSibling.checked = true;

      const activeBtn = this._submittedAddress.activeType === 'pickUp' ? this._deliveryBtnPickup : this._deliveryBtnCourier;
      this._toggleDeliveryType(activeBtn);
    }
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._addressTemplate)
      .content
      .cloneNode(true);

    return cardElement;
  }

  generateAddress(adressData) {
    this._address = this._getTemplate();
    this._addressValue = this._address.querySelector('.radio-btn__value');
    this._input = this._address.querySelector('.radio-btn__input');
    this._deleteBtn = this._address.querySelector('.form-delivery__dlt-btn');
    this._rating = this._address.querySelector('.form-delivery__rating-value');

    this._addressValue.textContent = adressData.address;
    this._input.name = adressData.type;
    this._input.checked = adressData.checked;

    //add rating for pickup address
    if (adressData.rating > 0) {
      this._rating.textContent = adressData.rating;
      this._rating.classList.remove('form-delivery__rating-value_inactive');
    } else {
      this._rating.classList.add('form-delivery__rating-value_inactive');
    }

    const addressElement = this._deleteBtn.closest('.form-delivery__adress-wrapper');
    this._setInnerEventListeners(addressElement, adressData);

    return this._address;
  }

  //handle buttons: toggle active address list (courier or pick up)
  _toggleDeliveryType(data) {

    if (!data.classList.contains('form-delivery__del-type_active')) {
      if (this._deliveryBtnCourier.textContent === data.textContent) {
        this._deliveryBtnPickup.classList.remove('form-delivery__del-type_active');
        this._deliveryBtnCourier.classList.add('form-delivery__del-type_active');

        //add active type of delivery
        this._selectedAddress.activeType = 'courier';
        this._toggleSbtBtnActivity();
      } else {
        this._deliveryBtnPickup.classList.add('form-delivery__del-type_active');
        this._deliveryBtnCourier.classList.remove('form-delivery__del-type_active');

        this._selectedAddress.activeType = 'pickUp';
        this._toggleSbtBtnActivity();
      }

      //toggle address list
      this.toggleAddresses();

      this._updateAddressBoxWidth([this._courierAddressBox, this._pickupAddressBox]);
    }
  }

  _removeAddress(addressElement, addressData) {
    addressElement.remove();
    this._updateActiveRadioBtn(addressData);
    this._toggleSbtBtnActivity();
    this._updateAddressBoxWidth([this._courierAddressBox, this._pickupAddressBox]);
  }

  //update active radio btn when address deleted
  _updateActiveRadioBtn(addressData) {
    const addressElementBox = addressData.type === 'pickUp' ? this._pickupAddressBox : this._courierAddressBox;
    const remainingRadioButtons = addressElementBox.querySelectorAll('.radio-btn__input');

    let checkedButtonFound = false;
    for (const radioButton of remainingRadioButtons) {
      if (radioButton.checked) {
        checkedButtonFound = true;
        break;
      }
    }

    if (!checkedButtonFound && remainingRadioButtons.length > 0) {
      remainingRadioButtons[0].checked = true;
      this._handleAddressChange({ type: addressData.type, address: remainingRadioButtons[0].labels[0].innerText });
    }

    if (remainingRadioButtons.length === 0) {
      this._handleAddressChange({ type: addressData.type, address: '' });
    }
  }

  //active and disactive submit button if
  _toggleSbtBtnActivity() {
    if (this._selectedAddress[this._selectedAddress.activeType] === '') {
      this._popupSbtBtn.classList.add('popup__sbt-btn_inactive');
    } else {
      this._popupSbtBtn.classList.remove('popup__sbt-btn_inactive');
    }

  }

  _handleAddressChange(addressObj) {
    this._selectedAddress[addressObj.type] = addressObj.address;
    this._selectedAddress.rating = addressObj.rating;
  }

  //update address box width when scroll appears
  _updateAddressBoxWidth(array) {
    array.forEach((i) => {
      if (i.scrollHeight > i.clientHeight) {
        /* i.style.marginRight = '-10px';
        i.style.paddingRight = '5px'; */

        i.classList.add('form-delivery__adress-box_wide');
      } else {
        /* i.style.marginRight = '';
        i.style.paddingRight = ''; */
        i.classList.remove('form-delivery__adress-box_wide');
      }
    })
  }

  //save new address
  _submitForm(e) {
    e.preventDefault();
    this._newAddress = this._selectedAddress[this._selectedAddress.activeType];
    this._submittedAddress = {
      courier: this._selectedAddress.courier, pickUp: this._selectedAddress.pickUp, activeType: this._selectedAddress.activeType, rating: 0 };;

    //check if address selected
    if (this._newAddress !== '') {
      this._selectedAddressElement = document.querySelector('.cart-delivery__address');
      this._selectedAddressRating = document.querySelector('.cart-delivery__rating-value');
      this._pickupAddressData = document.querySelector('.cart-delivery__address-data');
      this._orderAddress = document.querySelector('.order__selected-address');

      this._selectedAddressElement.textContent = this._newAddress;
      this._orderAddress.textContent = this._newAddress;

      //add rating for pickup address
      if (this._selectedAddress.activeType === 'pickUp') {
        if (this._selectedAddress.rating > 0) {
          this._selectedAddressRating.textContent = this._selectedAddress.rating;
        } else {
          this._selectedAddressRating.textContent = '';
        }
        this._pickupAddressData.classList.remove('cart-delivery__address-data_inactive')
      } else {
        this._pickupAddressData.classList.add('cart-delivery__address-data_inactive')
      }
      this._closePopup();
    }

  }

  _setInnerEventListeners(addressElement, adressData) {
    this._deleteBtn.addEventListener('click', () => this._removeAddress(addressElement, adressData));
    this._input.addEventListener('change', () => this._handleAddressChange(adressData));
  }

  setEventListeners() {
    super.setEventListeners();
    this._deliveryBtnCourier.addEventListener('click', e => this._toggleDeliveryType(e.target));
    this._deliveryBtnPickup.addEventListener('click', e => this._toggleDeliveryType(e.target));
    this._formElement.addEventListener('submit', e => this._submitForm(e));
  }

}
