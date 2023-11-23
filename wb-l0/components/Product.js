import { formatNumber } from '../utils/utils';

export default class Product {
  constructor(card, elementTemplate, { setLike },
    missingCard, updateProductData, removeProduct, updateThumbnails, companyData, products, toggleThumbnails) {
    this._elementTemplate = elementTemplate;
    this._card = card;
    this._setLike = setLike;
    this._missingCard = missingCard;
    this._updateProductData = updateProductData;
    this._removeProduct = removeProduct;
    this._updateThumbnails = updateThumbnails;
    this._prevValue;
    this._comanyData = companyData;
    this._products = products;
    this._checked = true;
    this._toggleThumbnails = toggleThumbnails;
  }

  _getTemplate(template) {
    const cardElement = document
      .querySelector(template)
      .content
      .cloneNode(true);

    return cardElement;
  }

  generateProduct() {
    this._cardElement = this._getTemplate(this._elementTemplate);

    this._cardImg = this._cardElement.querySelector('.product-card__img');
    this._cardTitle = this._cardElement.querySelector('.product-card__name');
    this._cardBrand = this._cardElement.querySelector('.product-card__brand');
    this._propsContainer = this._cardElement.querySelector('.product-card__properties');
    this._cardStore = this._cardElement.querySelector('.product-card__store-value');
    this._cardCompany = this._cardElement.querySelector('.product-card__company-name');
    this._cardAmount = this._cardElement.querySelector('.counter__input');
    this._cardRemainder = this._cardElement.querySelector('.product-card__remainder');
    this._cardSum = this._cardElement.querySelector('.product-card__sum-value');
    this._cardFullSum = this._cardElement.querySelector('.product-card__tlt-sum-value');
    this._cardSumDisc = this._cardElement.querySelector('.product-card__disc');
    this._cardSumDiscValue = this._cardElement.querySelector('.product-card__disc-value');
    this._cardSumConsDisc = this._cardElement.querySelector('.product-card__cost-disc');
    this._cardSumCostDiscValue = this._cardElement.querySelector('.product-card__cost-disc-value');
    this._deletetBtn = this._cardElement.querySelector('.product-card__actn-btn-delete');
    this._likeIcon = this._cardElement.querySelector('.product-card__actn-btn-like');
    this._plusBtn = this._cardElement.querySelector('.counter__btn_plus');
    this._minusBtn = this._cardElement.querySelector('.counter__btn_minus');
    this._tltCompany = this._cardElement.querySelector('.product-card__company-tooltip-name');
    this._tltOgrn = this._cardElement.querySelector('.product-card__company-tooltip-ogrn');
    this._tltAddress = this._cardElement.querySelector('.product-card__company-tooltip-address');
    this._tolltip = this._cardElement.querySelector('.product-card__company-tooltip');
    this._productSize = this._cardElement.querySelector('.product-card__size');
    this._checkbox = this._cardElement.querySelector('.checkbox__input');

    const card = this._card;

    this._cardImg.src = card.link;
    this._cardTitle.textContent = !card.brand ? card.title : `${card.title}, ${card.brand}`;
    this._cardTitle.alt = card.title;

    this._setSizeData(card, this._productSize);

    //only for products in stock
    if (!this._missingCard) {
      this._cardStore.textContent = card.store;
      this._cardCompany.textContent = card.company;
      this._cardAmount.value = card.amount.reduce((acc, current) => acc + current.amount, 0);
      this._prevValue = card.amount.reduce((acc, current) => acc + current.amount, 0);

      const companyInfo = this._comanyData.find(i => i.company === card.company);

      this._tltCompany.textContent = companyInfo.companyTooltip;
      this._tltOgrn.textContent = companyInfo.ogrn;
      this._tltAddress.textContent = companyInfo.address;

      if (this._products.findIndex(i => i.id === card.id) === 0) {
        this._tolltip.classList.add('product-card__company-tooltip_top');
      } else  {
        this._tolltip.classList.remove('product-card__company-tooltip_top');
      }

      this._updateSum();
      this._updateLeftovers();
      this._toggleCounterActivity();
    }

    //generate props array
    this._generateFromArray(this._card.props, 'span', 'product-card__prop-value', this._propsContainer);

    //this._isLiked();
    this._setEventListeners();

    return this._cardElement;
  }

  _generateFromArray(array, tag, className, container) {
    if (array.length === 0) {
      container.classList.add('product-card__properties_inactive');
    } else {
      container.classList.remove('product-card__properties_inactive');
      array.forEach(prop => {
        const propSpan = document.createElement(tag);
        propSpan.textContent = prop;
        propSpan.classList.add(className);

        if (prop.includes('Размер')) {
          propSpan.classList.add('product-card__prop-value_hidden');
        }
        container.appendChild(propSpan);
      });
    }

  }

  //check if product has a size, add size data to the card img
  _setSizeData(card, element) {
    const size = card.props.find(i => i.includes('Размер'));

    if (size) {
      const sizeData = parseInt(size.replace(/\D/g, ''), 10);
      element.textContent = sizeData;
      element.classList.add('product-card__size_active');
    }
  }

  //add or remove like
  _toggleLike(e) {
    e.target.classList.toggle('product-card__actn-btn-like_active')
  }

  //remove card from the list
  _removeCard() {
    const cardElement = this._deletetBtn.closest('.product-card');
    //if (!this._missingCard) this._updateSum();
    cardElement.remove();

    this._removeProduct(this._card.title, this._missingCard, this._card.id);
  }

  _increaseCounter() {
    const currentValue = parseInt(this._cardAmount.value);
    if ((this._card.remainder - currentValue) > 0) {
      const newValue = currentValue + 1;
      this._cardAmount.value = newValue;
      this._prevValue = newValue;
      this._updateSum();
      this._updateLeftovers();
      this._toggleCounterActivity();
      this._updateThumbnails(this._card, newValue, currentValue);
    }
  }

  _decreaseCounter() {
    const currentValue = parseInt(this._cardAmount.value)
    if (currentValue > 1) {
      const newValue = currentValue - 1;
      this._cardAmount.value = newValue;
      this._prevValue = newValue;
      this._updateSum();
      this._updateLeftovers();
      this._toggleCounterActivity();
      this._updateThumbnails(this._card, newValue, currentValue);
    }
  }

  //handle update product amount on input change
  _changeInputCounter(data) {
    const newValue = parseInt(data);

    if (newValue < 1) {
      this._cardAmount.value = 1;
    }

    if ((this._card.remainder - newValue) < 0) {
      this._cardAmount.value = this._card.remainder;
    }

    this._updateSum();
    this._updateLeftovers();
    this._toggleCounterActivity();
    this._updateThumbnails(this._card, parseInt(this._cardAmount.value, 10), this._prevValue);
    this._prevValue = parseInt(this._cardAmount.value, 10);
  }

  //update product sum when amount is changed
  _updateSum() {
    const currentValue = parseInt(this._cardAmount.value);
    const roundedPriceAmount = Math.round(this._card.price * currentValue);
    const roundedDiscountedPriceAmount = Math.round(this._card.price * (1 - this._card.disc) * currentValue);
    const roundedDiscountValue = Math.round(this._card.price * currentValue * this._card.disc);
    const roundedCostDiscountValue = Math.round(this._card.price * currentValue * this._card.disc * this._card.costDisc);

    //product cost
    this._cardSum.textContent = formatNumber(roundedDiscountedPriceAmount);
    this._cardFullSum.textContent = formatNumber(roundedPriceAmount) + ' сом';
    this._cardSum.title = this._cardSum.textContent + ' сом';

    if (roundedDiscountedPriceAmount > 9999) {
      this._cardSum.classList.add('product-card__sum-value_small');
    } else {
      this._cardSum.classList.remove('product-card__sum-value_small');
    }

    //discount data
    this._cardSumDiscValue.textContent = `−${formatNumber(roundedDiscountValue)} сом`;
    this._cardSumCostDiscValue.textContent = `−${formatNumber(roundedCostDiscountValue)} сом`;

    this._updateProductData({
      product: this._card.title,
      price: roundedDiscountedPriceAmount,
      amount: currentValue,
      fullPrice: roundedPriceAmount,
      checked: this._checked,
      id: this._card.id,
      inOneStock: this._card.inOneStock
    });
  }

  //update number of remaining products
  _updateLeftovers() {
    const currentValue = parseInt(this._cardAmount.value);
    if ((this._card.remainder - currentValue) < 3) {
      this._cardRemainder.textContent = `Осталось ${this._card.remainder - currentValue} шт.`;
      if (this._cardRemainder.style.display === 'none' ) {
        this._cardRemainder.style.display = 'block'
      }
    } else {
      this._cardRemainder.style.display = 'none';
    }
  }

  //activate/deactivate counter btns
  _toggleCounterActivity() {
    const currentValue = parseInt(this._cardAmount.value);

    //toggle minus btn
    if (currentValue < 2) {
      this._minusBtn.classList.add('counter__btn_inactive');
    } else if (this._minusBtn.classList.contains('counter__btn_inactive')) {
      this._minusBtn.classList.remove('counter__btn_inactive');
    }

    //toggle plus btn
    if ((this._card.remainder - currentValue) === 0) {
      this._plusBtn.classList.add('counter__btn_inactive');
    } else if (this._plusBtn.classList.contains('counter__btn_inactive')) {
      this._plusBtn.classList.remove('counter__btn_inactive');
    }
  }

  _handleCheckBox(checked) {
    if (checked) {
      this._checked = true;
    } else {
      this._checked = false;
    }

    this._updateSum();

    if (checked) {
      this._toggleThumbnails(this._card, this._prevValue);
    } else {
      this._toggleThumbnails(this._card, 0);

    }
  }

  _setEventListeners() {
    this._likeIcon.addEventListener('click', (e) => {
      this._toggleLike(e)
    });
    this._deletetBtn.addEventListener('click', () => {
      this._removeCard();
    });
    if (this._plusBtn) this._plusBtn.addEventListener('click', () => {
      this._increaseCounter();
    });
    if (this._minusBtn) this._minusBtn.addEventListener('click', () => {
      this._decreaseCounter();
    });
    if (this._cardAmount) this._cardAmount.addEventListener('change', (e) => {
      this._changeInputCounter(e.target.value);
    });
    if (this._checkbox) this._checkbox.addEventListener('change', (e) => {
      this._handleCheckBox(e.target.checked);
    })

  }

}
