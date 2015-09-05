import Item from "./Item";

export default class Service extends Item {
  getSlaveIDs() {
    return this.get("slave_ids");
  }
}
