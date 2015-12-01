import List from "./List";
import ACL from "./ACL";

export default class ACLsList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of ACL.
    this.list = this.list.map(function (item) {
      if (item instanceof ACL) {
        return item;
      } else {
        return new ACL(item);
      }
    });
  }
}
