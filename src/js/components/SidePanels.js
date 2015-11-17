import React from "react/addons";
import {SidePanel} from "reactjs-components";

import HistoryStore from "../stores/HistoryStore";
import NodeSidePanelContents from "./NodeSidePanelContents";
import ServiceSidePanelContents from "./ServiceSidePanelContents";
import TaskSidePanelContents from "./TaskSidePanelContents";

const METHODS_TO_BIND = [
  "handlePanelClose"
];

export default class SidePanels extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.state = {};
  }

  handlePanelClose() {
    if (!this.isOpen()) {
      return;
    }

    let prevPath = HistoryStore.getHistoryAt(-1);
    if (prevPath) {
      this.context.router.transitionTo(prevPath);
      HistoryStore.get("history").pop();
      HistoryStore.get("history").pop();
      return;
    }

    let routes = this.context.router.getCurrentRoutes();
    let pageBefore = routes[routes.length - 2];
    this.context.router.transitionTo(pageBefore.name);
  }

  isOpen() {
    let props = this.props;
    let params = props.params;

    let nodeID = params.nodeID;
    let serviceName = params.serviceName;
    let taskID = params.taskID;

    return props.statesProcessed
      && (nodeID != null || serviceName != null || taskID != null);
  }

  getHeader() {
    return (
      <div className="side-panel-header-actions side-panel-header-actions-primary">
        <span className="side-panel-header-action"
          onClick={this.handlePanelClose}>
          <i className="icon icon-sprite icon-sprite-small icon-close icon-sprite-small-white"></i>
          Close
        </span>
      </div>
    );
  }

  getContents(ids) {
    let statesProcessed = this.props.statesProcessed;
    let {nodeID, serviceName, taskID} = ids;

    if (statesProcessed && nodeID != null) {
      return (
        <NodeSidePanelContents
          itemID={nodeID}
          parentRouter={this.context.router} />
      );
    }

    if (statesProcessed && taskID != null) {
      return (
        <TaskSidePanelContents
          itemID={taskID}
          parentRouter={this.context.router} />
      );
    }

    if (statesProcessed && serviceName != null) {
      return (
        <ServiceSidePanelContents
          itemID={serviceName}
          parentRouter={this.context.router} />
      );
    }

    return null;
  }

  render() {
    let props = this.props;
    let params = props.params;

    let nodeID = params.nodeID;
    let serviceName = params.serviceName;
    let taskID = params.taskID;

    return (
      <SidePanel className="side-panel-detail"
        header={this.getHeader()}
        headerContainerClass="side-panel-header-container container container-fluid container-fluid-narrow container-pod container-pod-short"
        bodyClass="side-panel-content flex-container-col"
        onClose={this.handlePanelClose}
        open={this.isOpen()}>
        {this.getContents({nodeID, serviceName, taskID})}
      </SidePanel>
    );
  }
}

SidePanels.contextTypes = {
  router: React.PropTypes.func
};

SidePanels.propTypes = {
  statesProcessed: React.PropTypes.bool,
  params: React.PropTypes.object
};
