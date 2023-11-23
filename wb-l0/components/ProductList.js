import { formatNumber, declenWords, productWords } from '../utils/utils';

export default class ProductList {
  constructor ({ items, renderer }, containerSelector, listSelector, toggleThumbnails) {
    this._renderedItems = items;
    this._renderer = renderer;
    this._container = containerSelector;
    this._listSelector = document.querySelector(listSelector);
    this.addItem = this.addItem.bind(this);
    this._accordionIcon = this._listSelector.querySelector('.products__accordion-icon');
    this._productList = this._listSelector.querySelector('.products__list');
    this._accordionAmount = this._listSelector.querySelector('.products__accordion-amount');
    this._accordionAmountMissing = this._listSelector.querySelector('.products__accordion-amount-missing');
    this._accordionSum = this._listSelector.querySelector('.products__accordion-sum');
    this._orderSum = document.querySelector('.order__sum-main-value');
    this._orderAmount = document.querySelector('.order__amount');
    this._orderTotalPrice = document.querySelector('.order__sum-no-disc');
    this._orderDiscount = document.querySelector('.order__sum-discount');
    this._payNowCheckbox = document.querySelector('.order__checkbox-input');
    this._payNowText = document.querySelectorAll('.order__paynow-text');
    this._formSubmitBtn = document.querySelector('.order__sbt-btn');
    this._cartProductsAmount = document.querySelectorAll('.navbar__number');
    this._handlePayNowCheckbox = this._handlePayNowCheckbox.bind(this);
    this._mainCheckbox = this._listSelector.querySelector('.product__checkbox-all');
    this._productsData;
    this._toggleThumbnails = toggleThumbnails;
  }

  renderItems() {
    const items = this._renderedItems.reverse();

    items.forEach((item) => {
      this._renderer(item);
    });

    //set max height for poduct list for accordion transition
    this._updateAccordionHeight();

    if (this._accordionAmountMissing) {
      this._getMissingProductsData(items);
    }
  }

  //update accordion data: all products amount and sum
  updateAccordionData(data) {

    this._productsData = data;

    if (this._mainCheckbox) {
      this._updateCheckbox(data);
    }

    //use only cards with active checkbox
    const checkedData = data.filter(i => i.checked);

    this._totalAmount = checkedData.reduce((sum, product) => sum + product.amount, 0);
    this._totalSum = checkedData.reduce((sum, product) => sum + product.price, 0);
    this._fullPrice = checkedData.reduce((sum, product) => sum + product.fullPrice, 0);

    //add margins if all products were removed
    if (data.length === 0 && !this._accordionAmountMissing) {
      this._productList.classList.add('products__list_high');
    } else {
      this._productList.classList.remove('products__list_high');
    }

    const goodsAmountString = `${formatNumber(this._totalAmount)} ${declenWords(this._totalAmount, productWords)}`;

    if (this._accordionAmountMissing) {
      this._getMissingProductsData(data);
    } else {
      this._accordionAmount.textContent = `${goodsAmountString} ·`;
      const fullSumFormatted = formatNumber(this._totalSum);
      this._accordionSum.textContent = fullSumFormatted + ' сом';
      this._orderSum.textContent = formatNumber(this._totalSum, ' ');
      this._orderSum.title = fullSumFormatted + ' сом';
      this._orderAmount.textContent = goodsAmountString;
      this._orderTotalPrice.textContent = formatNumber(this._fullPrice, ' ') + ' сом';
      this._orderDiscount.textContent = formatNumber(this._fullPrice - this._totalSum) + ' сом';

      this._updateSbtnBtn(fullSumFormatted);

      const cartsArray = Array.from(this._cartProductsAmount);
      if (data.length === 0) {
        cartsArray.forEach((i) => {
          i.parentElement.classList.add('navbar__number-box_inactive');
        });
      } else {
        cartsArray.forEach((i) => {
          i.parentElement.classList.remove('navbar__number-box_inactive');
          i.textContent = data.length;
        });
      }

    }
  }

  //update text and activity
  _updateSbtnBtn(sum) {
    if (this._payNowCheckbox.checked) this._formSubmitBtn.textContent = `Оплатить ${sum} сом`;

    if (this._totalAmount === 0) {
      this._formSubmitBtn.classList.add('order__sbt-btn_inactive');
      this._formSubmitBtn.disabled = true;
      this._payNowCheckbox.disabled = true;
      this._formSubmitBtn.textContent = 'Заказать';
    } else {
      this._formSubmitBtn.classList.remove('order__sbt-btn_inactive');
      this._formSubmitBtn.disabled = false;
      this._payNowCheckbox.disabled = false;
    }
  }

  _handlePayNowCheckbox(e) {
    const textArray = Array.from(this._payNowText);

    if (e.target.checked) {
      textArray.forEach((i) => {
        i.classList.add('order__paynow-text_inactive');
      });
      this._formSubmitBtn.textContent = `Оплатить ${formatNumber(this._orderSum.textContent)} сом`;
    } else {
      textArray.forEach((i) => {
        i.classList.remove('order__paynow-text_inactive');
      })
      this._formSubmitBtn.textContent = 'Заказать';
    }
  }

  removeAccordionItem(data) {
    this.updateAccordionData(data);
    this._updateAccordionHeight();
  }

  //set max height for poduct list for accordion transition
  _updateAccordionHeight() {
    this._productListHeight = this._productList.offsetHeight;
    this._productList.style.maxHeight = this._productListHeight + 250 + 'px';
  }

  _getMissingProductsData(arr) {
    const str = arr.length.toString();
    const verb = str.substring(str.length - 1) === '1' ? 'Отсутствует' : 'Отсутствуют'
    this._accordionAmountMissing.textContent = `${verb} · ${formatNumber(arr.length)} ${declenWords(arr.length, productWords)}`;

    //correct margins if 0 or 1 products left
    if (arr.length === 1) {
      this._productList.classList.add('products__list_high');
    } else {
      this._productList.classList.remove('products__list_high');
    }

    if (arr.length === 0) {
      this._listSelector.classList.add('products_high');
    } else {
      this._listSelector.classList.remove('products_high');
    }
  }

  addItem(element, box) {
    box.prepend(element);
  }

  //close and open accordion
  _handleAccordion() {
    if (this._listSelector.classList.contains('products_hidden')) {
      this._productList.style.maxHeight = this._productListHeight + 'px';
    } else {
      this._productList.style.maxHeight = 0;
    }
    this._listSelector.classList.toggle('products_hidden');
  }

  //handle checkbox 'Select all'
  _handleAllCheckboxes(checked) {

    this._productsData.forEach((i) => {
      i.checked = checked;
      if (checked) {
        this._toggleThumbnails(i, i.amount);
      } else {
        this._toggleThumbnails(i, 0);
      }
    })

    const allInputs = Array.from(document.querySelectorAll('.product-card__checkbox-input'));
    allInputs.forEach((i) => {
      i.checked = checked;
    })

    this.updateAccordionData(this._productsData);
  }

  //toggle checkbox: if any product isn't checked - drop checkbox
  _updateCheckbox(data) {

    if (data.some(i => !i.checked)) {
      this._mainCheckbox.checked = false;
    } else {
      this._mainCheckbox.checked = true;
    }
  }

  setEventListeners() {
    this._accordionIcon.addEventListener('click', () => {
      this._handleAccordion();
    });

    if (!this._accordionAmountMissing) {
      this._payNowCheckbox.addEventListener('click', this._handlePayNowCheckbox);
    }

    if (this._mainCheckbox) {
      this._mainCheckbox.addEventListener('click', (e) => {
        this._handleAllCheckboxes(e.target.checked);
      });
    }

  }

}
