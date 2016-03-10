import _ from 'underscore';
let SDK = require('../../../SDK').getSDK();

let {Item, List} = SDK.get(['Item', 'List']);

module.exports = class ACLList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of Item.
    this.list = this.list.map(function (item) {
      if (item instanceof Item) {
        return item;
      } else {
        return new Item(item);
      }
    });
  }

  getItem(rid) {
    return _.find(this.getItems(), function (item) {
      return item.get('rid') === rid;
    });
  }
};
