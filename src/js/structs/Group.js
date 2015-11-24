import Item from "./Item";
import UsersList from "./UsersList";

export default class Group extends Item {
  getPermissions() {
    return this.get("permissions");
  }

  getUsers() {
    let users = this.get("users");
    let usersList = users.map(function (userItem) {
      return userItem.user;
    });
    return new UsersList({
      items: usersList
    });
  }
}
