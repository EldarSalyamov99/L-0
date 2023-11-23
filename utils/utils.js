export const productsContainer = document.querySelector('.products__list');
export const missingProductsContainer = document.querySelector('.products__list_missing');
export const deliveryChangeBtn = document.querySelector('.cart-form__card-btn');
export const deliveryPopupSelector = document.querySelector('.popup-delivery');
export const courierAddressBox = document.querySelector('.form-delivery__adress-box-courier');
export const pickupAddressBox = document.querySelector('.form-delivery__adress-box-pickup');
export const thumbnailBox = document.querySelector('.cart-delivery__images');
export const deliveryContainer = document.querySelector('.cart-delivery__container');
export const paymentChangeBtns = document.querySelectorAll('.edit-card');
export const paymentPopupSelector = document.querySelector('.popup-payment');
export const cardsContainerSelector = document.querySelector('.form-payment__list');
export const cartFormElement = document.querySelector('.cart-form');
export const addressChangeBtn = document.querySelectorAll('.edit-address');
export const scrollButton = document.querySelector('.order__delivery-date');
export const targetElement = document.querySelector('.cart-delivery');
export const payNowCheckbox = document.querySelector('.order__checkbox-input');
export const payNowText = document.querySelectorAll('.order__paynow-text');
export const formSubmitBtn = document.querySelector('.order__sbt-btn');
//export const orderSum = document.querySelector('.order__sum-main-value');

export const formatNumber = (number, spaceType) => {
  const space = spaceType === undefined ? ' ' : ' ';
  const strNumber = number.toString();
  const parts = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, space); //
  return parts;
}



export const declenWords = (value, words) => {
	value = Math.abs(value) % 100;
	var num = value % 10;
	if (value > 10 && value < 20) return words[2];
	if (num > 1 && num < 5) return words[1];
	if (num == 1) return words[0];
	return words[2];
}

export const productWords = ['товар', 'товара', 'товаров'];

export const cartFormElements = {
  formSelector: '.cart-form',
  inputSelector: '.user__input',
  submitButtonSelector: '.order__sbt-btn',
  inputErrorClass: 'user__input_error',
  errorClass: 'user__input-error_active'
}

export const inputErrros = [
  {
    input: 'username',
    errorType: 'filling',
    errorText: 'Укажите имя'
  },
  {
    input: 'userlastname',
    errorType: 'filling',
    errorText: 'Введите фамилию'
  },
  {
    input: 'email',
    errorType: 'filling',
    errorText: 'Укажите электронную почту'
  },
  {
    input: 'phone',
    errorType: 'filling',
    errorText: 'Укажите номер телефона'
  },
  {
    input: 'inn',
    errorType: 'filling',
    errorText: 'Укажите ИНН'
  },
  {
    input: 'email',
    errorType: 'validity',
    errorText: 'Проверьте адрес электронной почты'
  },
  {
    input: 'phone',
    errorType: 'validity',
    errorText: 'Формат: +9 999 999 99 99'
  },
  {
    input: 'inn',
    errorType: 'validity',
    errorText: 'Проверьте ИНН'
  }
];
