import Backend from './Backend';
import List from './List';

module.exports = class BackendList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of Backend.
    this.list = this.list.map(function (item) {
      if (item instanceof Backend) {
        return item;
      } else {
        return new Backend(item);
      }
    });
  }
};
