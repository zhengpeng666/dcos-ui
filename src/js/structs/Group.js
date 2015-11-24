import Item from "./Item";
import UsersList from "./UsersList";

export default class Group extends Item {
  getPermissions() {
    return this.get("permissions");
  }

  getUsers() {
    return new UsersList({
      items: this.get("users")
    });
  }
}
