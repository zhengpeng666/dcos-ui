import Item from './Item';
import StringUtil from '../utils/StringUtil';
import Util from '../utils/Util';

module.exports = class List {
  constructor(options = {}) {
    this.list = [];

    if (options.items) {
      if (!Util.isArray(options.items)) {
        throw new Error('Expected an array.');
      }

      this.list = options.items;
      this.filterProperties = options.filterProperties || [];
    }
  }

  add(item) {
    this.list.push(item);
  }

  getItems() {
    return this.list;
  }

  getFilterProperties() {
    return this.filterProperties;
  }

  last() {
    return this.list[this.list.length - 1];
  }

  filterItems(filterText) {
    let items = this.getItems();
    let filterProperties = this.getFilterProperties();

    if (filterText) {
      items = StringUtil.filterByString(items, function (item) {
        let searchFields = Object.keys(filterProperties).map(function (prop) {
          // Use getter function if specified
          let valueGetter = filterProperties[prop];
          if (typeof valueGetter === 'function') {
            return valueGetter(item, prop);
          }

          // Use default getter if instanceof Item
          if (item instanceof Item) {
            return item.get(prop) || '';
          }

          // Last resort is to get property on object
          return item[prop] || '';
        });

        return searchFields.join(' ');
      }, filterText);
    }

    return new this.constructor({items});
  }
};
