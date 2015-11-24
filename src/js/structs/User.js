import GroupsList from "./GroupsList";
import Item from "./Item";

export default class User extends Item {
  getGroups() {
    let groups = this.get("groups");
    let items = groups.map(function (groupMembership) {
      return groupMembership.group;
    });
    return new GroupsList({items});
  }

  getPermissions() {
    return this.get("permissions");
  }
}
