import Client from './Client';
import List from '../../../src/js/structs/List';

module.exports = class ClientList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of Client.
    this.list = this.list.map(function (item) {
      if (item instanceof Client) {
        return item;
      } else {
        return new Client(item);
      }
    });
  }
};
