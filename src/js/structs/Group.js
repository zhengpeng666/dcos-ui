import Item from "./Item";
import UsersList from "./UsersList";

export default class Group extends Item {
  getPermissions() {
    return this.get("permissions");
  }

  getUsers() {
    let users = this.get("users");
    let items = users.map(function (userMembership) {
      return userMembership.user;
    });
    return new UsersList({items});
  }
}
