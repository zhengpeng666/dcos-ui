export default class Item {
  constructor(item = {}) {
    Object.keys(item).forEach(function (key) {
      this[key] = item[key];
    }, this);

    this._itemData = item;
  }

  get(key) {
    return this._itemData[key];
  }
}
