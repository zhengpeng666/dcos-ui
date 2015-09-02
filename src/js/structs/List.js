export default class List {
  constructor(options = {}) {
    this.list = [];

    if (options.items) {
      if (toString.call(options.items) !== "[object Array]") {
        throw "Expected an array.";
      }

      this.list = options.items;
    }
  }

  add(item) {
    this.list.push(item);
  }

  getItems() {
    return this.list;
  }

  last() {
    return this.list[this.list.length - 1];
  }
}
