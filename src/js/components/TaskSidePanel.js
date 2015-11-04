/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/
import classNames from "classnames";

import DetailSidePanel from "./DetailSidePanel";
import HistoryStore from "../stores/HistoryStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import TaskStates from "../constants/TaskStates";

// key is the name, value is the display name
const TABS = {
  files: "Files",
  details: "Details"
};

export default class TaskSidePanel extends DetailSidePanel {
  constructor() {
    super(...arguments);

    this.state = {
      currentTab: Object.keys(TABS).shift()
    };

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

  handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }

  getHeader() {
    return (
      <div className="side-panel-header-actions side-panel-header-actions-primary">
        <span className="side-panel-header-action"
          onClick={this.handlePanelClose}>
          <i className="icon icon-sprite icon-sprite-small icon-back icon-sprite-small-white"></i>
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
    let services = MesosSummaryStore.get("states").lastSuccessful().getServiceList();
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

  getTabs() {
    let currentTab = this.state.currentTab;

    return Object.keys(TABS).map(function (tab, i) {
      let classSet = classNames({
        "button button-link": true,
        "button-primary": currentTab === tab
      });

      return (
        <div
          key={i}
          className={classSet}
          onClick={this.handleTabClick.bind(this, tab)}>
          {TABS[tab]}
        </div>
      );
    }, this);
  }

  getTabView(task) {
    let currentTab = this.state.currentTab;
    if (currentTab === "files") {
      return this.getFileView(task);
    }

    return this.getInfo(task);
  }

  getFileView(task) {
    return null;
  }

  getBasicInfo(task) {
    if (task == null) {
      return null;
    }

    let taskStatus = task.state.substring('TASK_'.length).toLowerCase();
    let statusClassName = `task-status-${taskStatus}`;

    return (
      <div className="side-panel-content-header container-pod flush-top container-pod-short-bottom">
        <h1 className="side-panel-content-header-label flush">
          {task.name}
        </h1>
        <span className={statusClassName}>
          {TaskStates[task.state].displayName}
        </span>
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
        <div className="side-panel-content-header container container-pod
          container-fluid container-pod-divider-bottom
          container-pod-divider-bottom-align-right flush-bottom">
          {this.getBasicInfo(task)}
          <div className="container container-pod side-panel-tabs
            flush flush-bottom">
            {this.getTabs()}
          </div>
        </div>
        <div className="container container-fluid container-pod container-pod-short">
          {this.getTabView(task)}
        </div>
      </div>
    );
  }

  render() {
    return super.render(...arguments);
  }
}
