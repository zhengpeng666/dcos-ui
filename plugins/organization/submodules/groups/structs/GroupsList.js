let SDK = require('../../../SDK').getSDK();

let List = SDK.get('List');

module.exports = class GroupsList extends List {
  constructor() {
    super(...arguments);
    var Group = require('./Group');
    // Replace list items instances of Group.
    this.list = this.list.map(function (item) {
      if (item instanceof Group) {
        return item;
      } else {
        return new Group(item);
      }
    });
  }
};
