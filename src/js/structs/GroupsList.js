import List from './List';
import Group from './Group';

export default class GroupsList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of Group.
    this.list = this.list.map(function (item) {
      if (item instanceof Group) {
        return item;
      } else {
        return new Group(item);
      }
    });
  }
}
