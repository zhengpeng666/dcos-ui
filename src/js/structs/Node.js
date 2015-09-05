import Item from "./Item";

export default class Node extends Item {
  getServices() {
    return this.get("framework_ids");
  }

  isActive() {
    return this.get("active");
  }

  getUsageStats(resource) {
    let total = this.get("resources")[resource];
    let value = this.get("used_resources")[resource];
    let percentage = Math.round(100 * value / Math.max(1, total));

    return {percentage, total, value};
  }
}
