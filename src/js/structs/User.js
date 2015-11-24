import GroupsList from "./GroupsList";
import Item from "./Item";

export default class User extends Item {
  getGroups() {
    return new GroupsList(this.get("groups"));
  }

  getPermissions() {
    return this.get("permissions");
  }
}
