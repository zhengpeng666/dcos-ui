import TaskStates from "../constants/TaskStates";
import Item from "./Item";

export default class Node extends Item {
  getServiceIDs() {
    return this.get("framework_ids");
  }

  isActive() {
    return this.get("active");
  }

  sumTaskTypesByState(state) {
    let sum = 0;

    Object.keys(TaskStates).forEach(function (taskType) {
      if (TaskStates[taskType].stateTypes.indexOf(state) !== -1) {
        // Make sure there's a value
        if (this[taskType]) {
          sum += this[taskType];
        }
      }
    }, this);

    return sum;
  }

  getUsageStats(resource) {
    let total = this.get("resources")[resource];
    let value = this.get("used_resources")[resource];
    let percentage = Math.round(100 * value / Math.max(1, total));

    return {percentage, total, value};
  }
}
