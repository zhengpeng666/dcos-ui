/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DateUtil from "../utils/DateUtil";
import SidePanelContents from "./SidePanelContents";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import MesosStateStore from "../stores/MesosStateStore";
import StringUtil from "../utils/StringUtil";
import TaskView from "./TaskView";

export default class NodeSidePanelContents extends SidePanelContents {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {name: "summary", events: ["success"]},
      {name: "state", events: ["success"]}
    ];

    this.state = {
      currentTab: Object.keys(this.tabs).shift()
    };
  }

  getBasicInfo(node) {
    let activeTasksCount = node.sumTaskTypesByState("active");
    let activeTasksSubHeader = StringUtil.pluralize("Task", activeTasksCount);

    return (
      <div className="side-panel-content-header">
        <h1 className="side-panel-content-header-label flush">
          {node.hostname}
        </h1>
        <div>
          {`${activeTasksCount} Active ${activeTasksSubHeader}`}
        </div>
      </div>
    );
  }

  renderTasksTabView() {
    let tasks = MesosStateStore.getTasksFromNodeID(this.props.itemID);

    let contents = this.getLoadingScreen();

    let timeSinceMount = (Date.now() - this.mountedAt) / 1000;
    if (timeSinceMount >= SidePanelContents.animationLengthSeconds) {
      contents = <TaskView tasks={tasks} parentRouter={this.props.parentRouter} />;
    }

    return (
      <div className="side-panel-tab-content side-panel-section container container-fluid container-pod container-pod-short-top container-fluid flex-container-col flush-bottom flex-grow no-overflow">
        {contents}
      </div>
    );
  }

  renderDetailsTabView() {
    let nodeID = this.props.itemID;
    let last = MesosSummaryStore.get("states").lastSuccessful();
    let node = last.getNodesList().filter({ids: [nodeID]}).last();

    if (node == null) {
      return null;
    }

    let headerValueMapping = {
      ID: node.id,
      Active: StringUtil.capitalize(node.active.toString().toLowerCase()),
      Registered: DateUtil.msToDateStr(
        node.registered_time.toFixed(3) * 1000
      ),
      "Master Version": MesosStateStore.get("lastMesosState").version
    };

    return (
      <div className="side-panel-tab-content side-panel-section container container-fluid container-pod container-pod-short-top">
        {this.getKeyValuePairs(headerValueMapping)}
        {this.getKeyValuePairs(node.attributes, "Attributes")}
      </div>
    );
  }

  render() {
    let nodeID = this.props.itemID;
    let last = MesosSummaryStore.get("states").lastSuccessful();
    let node = last.getNodesList().filter({ids: [nodeID]}).last();

    if (node == null) {
      return this.getNotFound("node");
    }

    return (
      <div className="flex-container-col">
        <div className="side-panel-section side-panel-content-header container container-pod container-fluid container-pod-divider-bottom container-pod-divider-bottom-align-right flush-bottom">
          {this.getBasicInfo(node)}
          <div className="side-panel-content-header-charts container-pod container-pod-short-top flush-bottom">
            <div className="row">
              {this.getCharts("Node", node)}
            </div>
          </div>
          <div className="side-panel-tabs">
            {this.tabs_getTabs()}
          </div>
        </div>
        {this.tabs_getTabView()}
      </div>
    );
  }
}
