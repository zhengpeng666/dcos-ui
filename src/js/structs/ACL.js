import Item from "./Item";

export default class ACL extends Item {
  getDescription() {
    return this.get("description");
  }

  getUrl() {
    return this.get("url");
  }
}
