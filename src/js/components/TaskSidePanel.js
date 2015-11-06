/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/
import classNames from "classnames";

import DetailSidePanel from "./DetailSidePanel";
import HistoryStore from "../stores/HistoryStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import ResourceTypes from "../constants/ResourceTypes";
import TaskDirectoryView from "./TaskDirectoryView";
import TaskStates from "../constants/TaskStates";
import TaskUtil from "../utils/TaskUtil";
import Units from "../utils/Units";

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

  getInfo(task, node) {
    if (task == null || !MesosSummaryStore.get("statesProcessed")) {
      return null;
    }

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

  getTabView(task, node) {
    let currentTab = this.state.currentTab;
    if (currentTab === "files") {
      return this.getFileView(task);
    }

    return this.getInfo(task, node);
  }

  getFileView(task) {
    return <TaskDirectoryView task={task} />;
  }

  getResources(task) {
    console.log(task);
    let resources = Object.keys(task.resources);
    console.log(resources);
    return resources.map(function (resource) {
      if (resource === "ports") {
        return null;
      }

      let colorIndex = ResourceTypes[resource].colorIndex;
      let resourceLabel = ResourceTypes[resource].label;
      let resourceIconClasses = `icon icon-sprite icon-sprite-medium
        icon-sprite-medium-color icon-resources-${resourceLabel.toLowerCase()}`;
      let resourceValue = Units.formatResource(
        resource, task.resources[resource]
      );
      return (
        <div key={resource} className="
          side-panel-resource-container
          flex-box-align-vertical-center
          container-pod
          container-pod-super-short
          flush-top">
          <div className="media-object media-object-align-middle">
            <div className="media-object-icon media-object-icon-medium">
              <i className={resourceIconClasses}></i>
            </div>
            <div className="media-object-content">
              <h4 className="flush-top flush-bottom text-color-neutral">
                {resourceValue}
              </h4>
              <span className={`side-panel-resource-label
                  text-color-${colorIndex}`}>
                {resourceLabel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      );
    });
  }

  getBasicInfo(task, node) {
    if (task == null) {
      return null;
    }

    let statusIcon = TaskUtil.getTaskStatusIcon(task);
    let statusClassName = `${TaskUtil.getTaskStatusClassName(task)} side-panel-subheader`;

    return (
      <div>
        <div className="side-panel-content-header container-fluid container-pod flush-top container-pod-short-bottom">
          <h1 className="side-panel-content-header-label flush">
            {task.name}
          </h1>

          <div className="media-object media-object-align-middle media-object-inline">
            <div className="media-object-icon media-object-icon-mini">
              {statusIcon}
            </div>
            <div className="media-object-content">
            <span className={statusClassName}>
              {TaskStates[task.state].displayName}
            </span>
            </div>
          </div>

          <span className="side-panel-subheader side-panel-subheader-emphasize">
            {node.hostname}
          </span>
        </div>
        <div className="container container-pod container-pod-short container-fluid flush">
          {this.getResources(task)}
        </div>
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

    let node = MesosStateStore.getNodeFromID(task.slave_id);

    return (
      <div>
        <div className="side-panel-content-header container container-pod
          container-fluid container-pod-divider-bottom
          container-pod-divider-bottom-align-right flush-bottom">
          {this.getBasicInfo(task, node)}
          <div className="container container-fluid container-pod side-panel-tabs
            flush flush-bottom flush-top">
            {this.getTabs()}
          </div>
        </div>
        <div className="container container-fluid container-pod container-pod-short">
          {this.getTabView(task, node)}
        </div>
      </div>
    );
  }

  render() {
    return super.render(...arguments);
  }
}
