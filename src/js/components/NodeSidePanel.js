import classNames from "classnames";
/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DetailSidePanel from "./DetailSidePanel";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import MesosStateStore from "../stores/MesosStateStore";
import StringUtil from "../utils/StringUtil";
import TaskView from "./TaskView";

const METHODS_TO_BIND = [
  "handleTabClick"
];

// key is the name, value is the display name
const TABS = {
  tasks: "Tasks",
  details: "Details"
};

export default class NodeSidePanel extends DetailSidePanel {
  constructor() {
    super(...arguments);

    this.state = {
      currentTab: Object.keys(TABS).shift()
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }

  getBasicInfo(node) {
    if (node == null) {
      return null;
    }

    let activeTasksCount = node.TASK_RUNNING + node.TASK_STARTING +
      node.TASK_STAGING;
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

  getTabView() {
    let currentTab = this.state.currentTab;
    if (currentTab === "tasks") {
      return this.getTaskView();
    }

    return (
      <div className="container container-pod container-pod-short">
        {this.getInfo()}
      </div>
    );
  }

  getContents() {
    let nodeID = this.props.itemID;
    let last = MesosSummaryStore.get("states").last();
    let node = last.getNodesList().filter({ids: [nodeID]}).last();

    if (node == null) {
      return (
        <div>
          <h1 className="text-align-center inverse overlay-header">
            Error finding node
          </h1>
          <div className="container container-pod text-align-center flush-top text-danger">
            {`Did not find a node with the id "${nodeID}"`}
          </div>
        </div>
      );
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
        {this.getTabView()}
      </div>
    );
  }

  getInfo() {
    // info will go here
    return null;
  }

  render() {
    return super.render(...arguments);
  }
}
