import _ from "underscore";
import React from "react/addons";
import {SidePanel} from "reactjs-components";

import HistoryStore from "../stores/HistoryStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import NodeSidePanelContents from "./NodeSidePanelContents";
import ServiceSidePanelContents from "./ServiceSidePanelContents";
import StringUtil from "../utils/StringUtil";
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

  handlePanelClose(closeInfo) {
    if (!this.isOpen()) {
      return;
    }

    if (closeInfo && closeInfo.closedByBackdrop) {
      HistoryStore.goBackToPage(this.context.router);
      return;
    }

    HistoryStore.goBack(this.context.router);
  }

  // isOpen() {
  //   let props = this.props;
  //   let params = props.params;

  //   let nodeID = params.nodeID;
  //   let serviceName = params.serviceName;
  //   let taskID = params.taskID;
  //   let statesProcessed = MesosSummaryStore.get("statesProcessed");

  //   return (nodeID != null || serviceName != null || taskID != null)
  //     && statesProcessed;
  // }

  isOpen() {
    let params = this.props.params;

    return (
      params.nodeID != null ||
      params.serviceName != null ||
      params.taskID != null
    ) && MesosSummaryStore.get("statesProcessed");
  }

  getHeader() {
    let text = "back";
    let prevPage = HistoryStore.getHistoryAt(-1);

    if (prevPage == null) {
      text = "close";
    }

    if (prevPage) {
      let matchedRoutes = this.context.router.match(prevPage).routes;
      prevPage = _.last(matchedRoutes).name;

      if (_.contains(
        ["services", "dashboard", "nodes-list", "nodes-grid"], prevPage)) {
        text = "close";
      }
    }

    let iconClass =
      `icon icon-sprite icon-sprite-small icon-${text} icon-sprite-small-white`;

    return (
      <div className="side-panel-header-actions
        side-panel-header-actions-primary">
        <span className="side-panel-header-action"
          onClick={this.handlePanelClose}>
          <i className={iconClass}></i>
          {StringUtil.capitalize(text)}
        </span>
      </div>
    );
  }

  getContents(ids) {
    if (!this.isOpen()) {
      return null;
    }

    let {nodeID, serviceName, taskID} = ids;

    if (nodeID != null) {
      return (
        <NodeSidePanelContents
          itemID={nodeID}
          parentRouter={this.context.router} />
      );
    }

    if (taskID != null) {
      return (
        <TaskSidePanelContents
          itemID={taskID}
          parentRouter={this.context.router} />
      );
    }

    if (serviceName != null) {
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
        headerContainerClass="side-panel-header-container container
          container-fluid container-fluid-narrow container-pod
          container-pod-short"
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
  params: React.PropTypes.object
};
