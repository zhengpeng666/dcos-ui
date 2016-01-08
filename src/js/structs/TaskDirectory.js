import _ from "underscore";

import List from "./List";
import File from "./File";

export default class TaskDirectory extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of Node
    this.list = this.list.map(function (item) {
      if (item instanceof File) {
        return item;
      } else {
        return new File(item);
      }
    });
  }

  getFileForName(name) {
    return _.find(this.getItems(), function (file) {
      return _.last(file.get("path").split("/")) === name;
    });
  }

}
