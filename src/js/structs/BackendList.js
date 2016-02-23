import Backend from './Backend';
import List from './List';

module.exports = class BackendList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of Backend.
    this.list = this.list.map(function (item) {
      if (item instanceof Backend) {
        console.log('is backend');
        return item;
      } else {
        console.log('new backend');
        return new Backend(item);
      }
    });
  }
};
