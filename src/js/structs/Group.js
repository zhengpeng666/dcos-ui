import Item from "./Item";
import UsersList from "./UsersList";

export default class Group extends Item {
  getPermissions() {
    return this.get("permissions");
  }

  getPermissionCount() {
    return this.get("permissions").length;
  }

  getUsers() {
    let users = this.get("users");
    let items = users.map(function (userMembership) {
      return userMembership.user;
    });
    return new UsersList({items});
  }

  getUserCount() {
    return this.getUsers().getItems().length;
  }
}
