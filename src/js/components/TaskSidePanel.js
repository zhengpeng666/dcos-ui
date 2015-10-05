/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DetailSidePanel from "./DetailSidePanel";
import HistoryStore from "../stores/HistoryStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import TaskStates from "../constants/TaskStates";

export default class TaskSidePanel extends DetailSidePanel {
  constructor() {
    super(...arguments);

    this.state = {};
    this.storesListeners = ["state", "summary"];
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

    if (prevPath == null) {
      return super.handlePanelClose();
    }

    this.context.router.transitionTo(prevPath);
  }

  getHeader() {
    return (
      <div>
        <span className="button button-link button-inverse"
          onClick={this.handlePanelClose}>
          <i className="icon icon-small icon-back icon-small-white"></i>
          Back
        </span>
      </div>
    );
  }

  getInfo(task) {
    if (task == null || !MesosSummaryStore.get("statesProcessed")) {
      return null;
    }

    let node = MesosStateStore.getNodeFromID(task.slave_id);
    let services = MesosSummaryStore.get("states").last().getServiceList();
    let service = services.filter({ids: [task.framework_id]}).last();

    let headerValueMapping = {
      ID: task.id,
      Service: `${service.name} (${service.id})`,
      Node: `${node.hostname} (${node.id})`
    };

    let labelMapping = {};

    task.labels.forEach(function (label) {
      labelMapping[label.key] = label.value;
    });

    return (
      <div>
        {this.getKeyValuePairs(headerValueMapping)}
        {this.getKeyValuePairs(labelMapping, "Labels")}
      </div>
    );
  }

  getBasicInfo(task) {
    if (task == null) {
      return null;
    }

    return (
      <div className="side-panel-content-header">
        <h2 className="side-panel-content-header-label inverse flush-top">
          {task.name}
        </h2>
        {TaskStates[task.state].displayName}
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
        <div className="container container-pod container-pod-short
            container-pod-divider-bottom container-pod-divider-inverse">
          {this.getBasicInfo(task)}
        </div>
        <div className="container container-pod container-pod-short flush-left
            flush-top">
          {this.getInfo(task)}
        </div>
      </div>
    );
  }

  render() {
    return super.render(...arguments);
  }
}
