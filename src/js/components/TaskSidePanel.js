/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DetailSidePanel from "./DetailSidePanel";
import HistoryStore from "../stores/HistoryStore";
import MesosStateStore from "../stores/MesosStateStore";

export default class TaskSidePanel extends DetailSidePanel {
  constructor() {
    super(...arguments);

    this.state = {};
    this.prevHistoryPath = null;
    this.storesListeners = ["state"];
  }

  componentDidUpdate() {
    // Next tick so that the history actually updates correctly
    setTimeout(() => {
      this.internalStorage_update({
        prevHistoryPath: HistoryStore.getHistoryAt(-1)
      });
    });
  }

  handlePanelClose() {
    var prevPath = this.internalStorage_get().prevHistoryPath;
    this.context.router.transitionTo(prevPath);
  }

  getBasicInfo(task) {
    return (
      <div>
        <h1 className="inverse flush-top flush-bottom">
          {task.id}
        </h1>
      </div>
    );
  }

  getContents() {
    if (MesosStateStore.get("lastMesosState").slaves == null) {
      return null;
    }

    let task = MesosStateStore.getTaskFromTaskID(this.props.itemID);
    if (task == null) {
      return this.getNotFound("task");
    }

    return (
      <div>
        <div
          className="container container-pod container-pod-divider-bottom
            container-pod-divider-inverse flush-bottom">
          {this.getBasicInfo(task)}
        </div>
      </div>
    );
  }

  render() {
    return super.render(...arguments);
  }
}
