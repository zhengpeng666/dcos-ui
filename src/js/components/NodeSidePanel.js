import classNames from "classnames";
/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DateUtil from "../utils/DateUtil";
import DetailSidePanel from "./DetailSidePanel";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import MesosStateStore from "../stores/MesosStateStore";
import StringUtil from "../utils/StringUtil";
import TaskView from "./TaskView";

// key is the name, value is the display name
const TABS = {
  tasks: "Tasks",
  details: "Details"
};

export default class NodeSidePanel extends DetailSidePanel {
  constructor() {
    super(...arguments);

    this.storesListeners = ["summary", "state"];

    this.state = {
      currentTab: Object.keys(TABS).shift()
    };
  }

  handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }

  getBasicInfo(node) {
    let activeTasksCount = node.sumTaskTypesByState("active");
    let activeTasksSubHeader = StringUtil.pluralize("Task", activeTasksCount);

    return (
      <div>
        <h1 className="inverse flush-top flush-bottom">
          {node.hostname}
        </h1>
        <div>
          {`${activeTasksCount} Active ${activeTasksSubHeader}`}
        </div>
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

  getTaskView() {
    let tasks = MesosStateStore.getTasksFromNodeID(this.props.itemID);

    return (
      <div className="container container-pod flush-top">
        <TaskView tasks={tasks} />
      </div>
    );
  }

  displayKeyValuePairs(hash = {}) {
    return Object.keys(hash).map(function (key) {
      return (
        <p key={key} className="row flex-box">
          <span className="column-4 emphasize">
            {key}
          </span>
          <span className="column-12">
            {hash[key]}
          </span>
        </p>
      );
    });
  }

  getTabView(node) {
    let currentTab = this.state.currentTab;

    if (currentTab === "tasks") {
      return this.getTaskView();
    }

    let headerValueMapping = null;

    if (node != null) {
      headerValueMapping = {
        ID: node.id,
        Active: StringUtil.capitalize(node.active.toString().toLowerCase()),
        Registered: DateUtil.msToDateStr(
          node.registered_time.toFixed(3) * 1000
        ),
        "Master version": MesosStateStore.get("lastMesosState").version
      };
    }

    let attributeNodes = null;

    if (node.attributes != null && Object.keys(node.attributes).length > 0) {
      attributeNodes = (
        <div className="container container-pod container-pod-short flush-top">
          <h3 className="inverse flush-top">Attributes</h3>
          {this.displayKeyValuePairs(node.attributes)}
        </div>
      );
    }

    return (
      <div>
        <div className="container container-pod container-pod-short">
          {this.displayKeyValuePairs(headerValueMapping)}
        </div>
        {attributeNodes}
      </div>
    );
  }

  getContents() {
    let nodeID = this.props.itemID;
    let last = MesosSummaryStore.get("states").last();
    let node = last.getNodesList().filter({ids: [nodeID]}).last();

    if (node == null) {
      return this.getNotFound("node");
    }

    return (
      <div>
        <div
          className="container container-pod container-pod-divider-bottom
            container-pod-divider-inverse flush-bottom">
          {this.getBasicInfo(node)}
          <div className="side-panel-tabs">
            {this.getTabs()}
          </div>
        </div>
        {this.getTabView(node)}
      </div>
    );
  }

  render() {
    return super.render(...arguments);
  }
}
