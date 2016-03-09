import Backend from './Backend';
let SDK = require('../SDK').getSDK();

let List = SDK.get('List');

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
