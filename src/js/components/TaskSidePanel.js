/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DetailSidePanel from "./DetailSidePanel";
import HistoryStore from "../stores/HistoryStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";

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

  getInfo(task) {
    if (task == null || !MesosSummaryStore.get("statesProcessed")) {
      return null;
    }

    let node = MesosStateStore.getNodeFromNodeID(task.slave_id);
    let service = MesosSummaryStore.get("states")
      .last()
      .getServiceList()
      .filter({
        ids: [task.framework_id]
      })
      .last();

    let headerValueMapping = {
      ID: task.id,
      Service: `${service.name} (${service.id})`,
      Node: `${node.hostname} (${node.id})`
    };

    task.labels.forEach(function (label) {
      headerValueMapping[label.key] = label.value;
    });

    return Object.keys(headerValueMapping).map(function (header, i) {
      return (
        <p key={i} className="row flex-box">
          <span className="column-6 emphasize">
            {header}
          </span>
          <span className="column-10">
            {headerValueMapping[header]}
          </span>
        </p>
      );
    });
  }

  getBasicInfo(task) {
    if (task == null) {
      return null;
    }

    return (
      <div>
        <h1 className="inverse flush-top flush-bottom">
          {task.name}
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
        <div className="container container-pod container-pod-short">
          {this.getInfo(task)}
        </div>
      </div>
    );
  }

  render() {
    return super.render(...arguments);
  }
}
