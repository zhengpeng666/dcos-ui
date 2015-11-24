import GroupsList from "./GroupsList";
import Item from "./Item";

export default class User extends Item {
  getGroups() {
    return new GroupsList({
      items: this.get("groups")
    });
  }

  getPermissions() {
    return this.get("permissions");
  }
}
