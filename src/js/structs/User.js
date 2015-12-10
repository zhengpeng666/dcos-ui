import GroupsList from "./GroupsList";
import Item from "./Item";

export default class User extends Item {

  getGroups() {
    let groups = this.get("groups") || [];
    let items = groups.map(function (groupMembership) {
      return groupMembership.group;
    });
    return new GroupsList({items});
  }

  getGroupCount() {
    return this.getGroups().getItems().length;
  }

  getPermissions() {
    return this.get("permissions");
  }

  getPermissionCount() {
    return this.getUniquePermissions().length;
  }

  getUniquePermissions() {
    let permissions = this.getPermissions();
    let uniqueUrls = [];

    if (permissions == null) {
      return [];
    }

    if (!permissions.direct) {
      permissions = permissions.groups || [];
    } else {
      permissions = permissions.direct.concat(permissions.groups || []);
    }

    return permissions.filter(function (service) {
      let url = service.aclurl;

      if (uniqueUrls.indexOf(url) < 0) {
        uniqueUrls.push(url);
        return true;
      }

      return false;
    });
  }
}
