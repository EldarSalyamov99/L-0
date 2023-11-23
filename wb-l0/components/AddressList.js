export default class AddressList {
  constructor ({ renderer }, items, containerSelector) {
    this._renderedItems = items;
    this._renderer = renderer;
    this._container = containerSelector;
    this.toggleAddresses = this.toggleAddresses.bind(this);
  }

  renderItems() {
    const items = this._renderedItems.reverse();
    items.forEach((item) => {
      this._renderer(item);

    });
  }

  addItem(element) {
    this._container.prepend(element);
  }

  toggleAddresses() {
    this._container.classList.toggle('form-delivery__adress-box_inactive');
  }

  setEventListeners() {
  }

}
