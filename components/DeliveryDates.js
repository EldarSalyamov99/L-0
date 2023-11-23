export default class DeliveryDates {
  constructor (items, container, elementTemplate) {
    this._renderedItems = items;
    this._container = container;
    this._elementTemplate = elementTemplate;
    this._orderDates = document.querySelector('.order__delivery-date');
  }

  _getTemplate(template) {
    const cardElement = document
      .querySelector(template)
      .content
      .cloneNode(true);

    return cardElement;
  }

  //generate thumbnails images and products amount
  _generateThumbnails(product) {
    this._imageBox = this._getTemplate('#thumbnail');
    this._imageElement = this._imageBox.querySelector('.cart-delivery__image-box')
    this._imgSrc = this._imageBox.querySelector('.cart-delivery__image');
    this._productAmount = this._imageBox.querySelector('.cart-delivery__product-amount');

    this._imageElement.dataset.productId = product.id;
    this._imgSrc.src = product.thumbnail;

    this._productAmount.textContent = product.amount;
    if (product.amount > 9 && product.amount < 100) {
      this._productAmount.parentElement.classList.add('cart-delivery__amount-box_low');
    } else {
      this._productAmount.parentElement.classList.remove('cart-delivery__amount-box_low');
    }

    this._updateNumberStyle(product.amount, this._productAmount);

    return this._imageBox;
  }

  //hide product amount if it less than 2 and make number element wider if value more than 9
  _updateNumberStyle(value, element) {
    if (value > 1) {
      element.classList.remove('cart-delivery__product-amount_inactive')
    } else {
      element.classList.add('cart-delivery__product-amount_inactive')
    }
    if (value > 9) {
      element.classList.add('cart-delivery__product-amount_wide')
    } else {
      element.classList.remove('cart-delivery__product-amount_wide')
    }
  }

  //generate date groups
  _generateDates(item) {
    this._dateBox = this._getTemplate('#delivery-date-template');
    this._thumbnailBox = this._dateBox.querySelector('.cart-delivery__images');

    this._deliveryDate = this._dateBox.querySelector('.cart-delivery__date');
    this._deliveryDate.textContent = item.date;

    item.products.reverse().forEach((i) => {
      const generatedItem = this._generateThumbnails(i);
      this._addItem(this._thumbnailBox, generatedItem);
    });

    return this._dateBox;
  }

  renderItems() {
    const items = this._renderedItems.reverse();
    items.forEach((item) => {
      const generatedItem = this._generateDates(item);
      this._addItem(this._container, generatedItem);
    });
  }

  _addItem(container, element) {
    container.prepend(element);
  }

  //hide/ show thumbnails when checkbox clicked
  toggleThumbnails(card, newValue) {
    const elementsToUpdate = Array.from(document.querySelectorAll(`[data-product-id="${card.id}"]`));

    //hide thumnail if checkbox inactive
    if (newValue === 0) {
      elementsToUpdate.forEach((i) => {
        //
        i.classList.add('cart-delivery__image-box_inactive');

        const row = i.closest('.cart-delivery__row');
        const allThumbNailsInRow = Array.from(row.querySelectorAll('.cart-delivery__image-box'));

        //hide row of dates if no active thumbnails left
        if (allThumbNailsInRow.every(el => el.classList.contains('cart-delivery__image-box_inactive'))) {
          row.classList.add('cart-delivery__row_inactive');
        } else {
          row.classList.remove('cart-delivery__row_inactive');
        }

      })
    } else {
      this._imageElement.classList.remove('cart-delivery__image-box_inactive');
      elementsToUpdate.forEach((i) => {
        i.classList.remove('cart-delivery__image-box_inactive');

        const row = i.closest('.cart-delivery__row');
        row.classList.remove('cart-delivery__row_inactive');
      })
    }

  }


  //update thumbnails amount when products changed
  updateThumbnails(card, newValue, currentValue) {
    const elementsToUpdate = document.querySelectorAll(`[data-product-id="${card.id}"]`);
    const mainProduct = elementsToUpdate[0].querySelector('.cart-delivery__product-amount');
    const lastProduct = elementsToUpdate[elementsToUpdate.length - 1].querySelector('.cart-delivery__product-amount');
    const lastRow = lastProduct.closest('.cart-delivery__row');

    const delta = newValue - currentValue;

    //if new value more than in stock, get back additional delivery date (7—8 февраля)
    if (newValue > card.inOneStock && lastRow.classList.contains('cart-delivery__row_inactive')) {
      lastRow.classList.remove('cart-delivery__row_inactive');
      this._getSummaryDatesDelivery();
      mainProduct.textContent = card.inOneStock;
      lastProduct.textContent = newValue - card.inOneStock;
      this._updateNumberStyle(card.inOneStock, mainProduct);
      this._updateNumberStyle(newValue - card.inOneStock, lastProduct);
      return;
    }

    //if product is delivered only in one date - use new value
    if (elementsToUpdate.length === 1 || lastRow.classList.contains('cart-delivery__row_inactive')) {
      mainProduct.textContent = newValue;
      this._updateNumberStyle(newValue, mainProduct);
    } else {
      //increment current value if value was increased
      if (delta > 0) {
        lastProduct.textContent = parseInt(lastProduct.textContent, 10) + delta;
        this._updateNumberStyle(parseInt(lastProduct.textContent, 10) + delta, lastProduct);
      } else {
        //if value was decreased
        let leftDelta = delta * -1;

        const reversedElements = Array.from(elementsToUpdate).reverse();

        //update elements in different delivery dates
        for (let i = 0; i < reversedElements.length; i++) {
          const element = reversedElements[i].querySelector('.cart-delivery__product-amount');
          const elementAmount = parseInt(element.textContent);

          if ((elementAmount - 1) >= leftDelta) {
            element.textContent = elementAmount - leftDelta;
            this._updateNumberStyle(elementAmount - leftDelta, element);
            break;
          } else {
            element.textContent = elementAmount - leftDelta;
            leftDelta = leftDelta - elementAmount;
            reversedElements[i].closest('.cart-delivery__row').classList.add('cart-delivery__row_inactive');
            this._getSummaryDatesDelivery();
          }
        }
      }
    }
  }

  //get delivery dates for order summary
  _getSummaryDatesDelivery() {

    let str = '';
    const dates = Array.from(document.querySelectorAll('.cart-delivery__row:not(.cart-delivery__row_inactive) .cart-delivery__date'));

    if (dates.length === 0) {
      this._orderDates.classList.add('order__delivery-date_inactive');
      return;
    } else {
      this._orderDates.classList.remove('order__delivery-date_inactive');

      if (dates.length === 1) {
        str = dates[0].textContent;
      } else {
        const firstDate = dates[0].textContent;
        const lastDate = dates[dates.length - 1].textContent;
        const startDate = firstDate.split('—')[0];
        const endDate = lastDate.split('—')[1];

        str = `${startDate}—${endDate}`
      }
    }

    const parts = str.split('—');

    const beforeDash = parts[0].trim();
    const afterDash = parts[1].trim();

    const [dayAfterDash, monthAfterDash] = afterDash.split(' ');
    const formattedDate = `${beforeDash}–${dayAfterDash} ${monthAfterDash.substring(0, 3)}`;
    this._orderDates.textContent = formattedDate;
  }

  removeThumbnail(cardId) {
    const elementsToRemove = document.querySelectorAll(`[data-product-id="${cardId}"]`);

    Array.from(elementsToRemove).forEach((i) => {
      if (!i.nextElementSibling && !i.previousElementSibling) {
        //remove data row if no products left
        i.closest('.cart-delivery__row').remove();
      } else {
        //remove thumbnail
        i.remove();
      }
    })
    this._getSummaryDatesDelivery()
  }

}
