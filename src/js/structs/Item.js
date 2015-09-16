import TaskStates from "../constants/TaskStates";

export default class Item {
  constructor(item = {}) {
    Object.keys(item).forEach(function (key) {
      this[key] = item[key];
    }, this);

    this._itemData = item;
  }

  get(key) {
    return this._itemData[key];
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
}
