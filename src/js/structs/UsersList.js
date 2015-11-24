import List from "./List";
import User from "./User";

export default class UsersList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of User.
    this.list = this.list.map(function (item) {
      if (item instanceof User) {
        return item;
      } else {
        return new User(item);
      }
    });
  }
}
