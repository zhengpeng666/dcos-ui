/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DateUtil from "../utils/DateUtil";
import DetailSidePanel from "./DetailSidePanel";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import MesosStateStore from "../stores/MesosStateStore";
import StringUtil from "../utils/StringUtil";
import TaskView from "./TaskView";

export default class NodeSidePanel extends DetailSidePanel {
  constructor() {
    super(...arguments);

    this.storesListeners = [
      {name: "summary", listenAlways: true},
      {name: "state", listenAlways: true}
    ];

    this.state = {
      currentTab: Object.keys(this.tabs).shift()
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      let defaultTab = Object.keys(this.tabs).shift();
      if (this.state.currentTab !== defaultTab) {
        this.setState({currentTab: defaultTab});
      }
    }

    return super.shouldComponentUpdate(...arguments);
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

  getContents() {
    let nodeID = this.props.itemID;
    let last = MesosSummaryStore.get("states").lastSuccessful();
    let node = last.getNodesList().filter({ids: [nodeID]}).last();

    if (node == null) {
      return this.getNotFound("node");
    }

    return (
      <div className="flex-container-col" style={{height: "100%"}}>
        <div className="side-panel-content-header container container-pod container-fluid container-pod-divider-bottom container-pod-divider-bottom-align-right flush-bottom">
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

  renderTasksTabView() {
    let tasks = MesosStateStore.getTasksFromNodeID(this.props.itemID);

    let contents = this.getLoadingScreen();

    let timeSinceMount = (Date.now() - this.mountedAt) / 1000;
    if (timeSinceMount >= DetailSidePanel.animationLengthSeconds) {
      contents = <TaskView tasks={tasks} parentRouter={this.context.router} />;
    }

    return (
      <div className="container container-fluid container-pod container-pod-short-top container-fluid flex-container-col flush-bottom flex-grow no-overflow">
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
      <div className="container container-fluid container-pod container-pod-short-top">
        {this.getKeyValuePairs(headerValueMapping)}
        {this.getKeyValuePairs(node.attributes, "Attributes")}
      </div>
    );
  }

  render() {
    return super.render(...arguments);
  }
}
