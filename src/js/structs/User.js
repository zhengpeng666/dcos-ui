import GroupsList from "./GroupsList";
import Item from "./Item";

export default class User extends Item {
  getGroups() {
    let groups = this.get("groups");
    let groupsList = groups.map(function (groupItem) {
      return groupItem.group;
    });
    return new GroupsList({
      items: groupsList
    });
  }

  getPermissions() {
    return this.get("permissions");
  }
}
