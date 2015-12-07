import _ from "underscore";
import React from "react/addons";
import {Confirm, SidePanel} from "reactjs-components";

import ACLUserStore from "../stores/ACLUserStore";
import GroupSidePanelContents from "./GroupSidePanelContents";
import HistoryStore from "../stores/HistoryStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import NodeSidePanelContents from "./NodeSidePanelContents";
import ServiceSidePanelContents from "./ServiceSidePanelContents";
import StoreMixin from "../mixins/StoreMixin";
import StringUtil from "../utils/StringUtil";
import TaskSidePanelContents from "./TaskSidePanelContents";
import UserSidePanelContents from "./UserSidePanelContents";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleDeleteModalOpen",
  "handleDeleteCancel",
  "handlePanelClose",
  "handleDeleteUser"
];

export default class SidePanels extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.state = {
      deleteUpdateError: null,
      itemID: null,
      openDeleteConfirmation: false,
      pendingRequest: false
    };

    this.store_listeners = [
      {
        name: "user",
        events: [
          "deleteSuccess",
          "deleteError"
        ]
      }
    ];
  }

  handleDeleteCancel() {
    this.setState({
      itemID: null,
      openDeleteConfirmation: false
    });
  }

  handleDeleteModalOpen() {
    this.setState({
      itemID: this.props.params.userID,
      deleteUpdateError: null,
      openDeleteConfirmation: true
    });
  }

  handleDeleteUser() {
    ACLUserStore.deleteUser(this.state.itemID);
    this.setState({
      pendingRequest: true
    });
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

  isOpen() {
    let params = this.props.params;

    return (
      params.nodeID != null ||
      params.serviceName != null ||
      params.taskID != null ||
      params.userID != null ||
      params.groupID != null
    ) && MesosSummaryStore.get("statesProcessed");
  }

  getDeleteModalContent() {
    let error = null;

    if (this.state.deleteUpdateError != null) {
      error = (
        <p className="text-error-state">{this.state.deleteUpdateError}</p>
      );
    }

    let user = ACLUserStore.getUser(this.state.itemID);
    return (
      <div className="container-pod text-align-center">
        <h4>Are you sure?</h4>
        <p>{`${StringUtil.capitalize(user.description)} will be deleted.`}</p>
        {error}
      </div>
    );
  }

  getHeader(userID) {
    let text = "back";
    let prevPage = HistoryStore.getHistoryAt(-1);

    if (prevPage == null) {
      text = "close";
    }

    if (prevPage) {
      let matchedRoutes = this.context.router.match(prevPage).routes;
      prevPage = _.last(matchedRoutes).name;

      if (this.props.openedPage === prevPage) {
        text = "close";
      }
    }

    return (
      <div className="side-panel-header-container">
        <div className="side-panel-header-actions
          side-panel-header-actions-primary">

          <span className="side-panel-header-action"
            onClick={this.handlePanelClose}>
            <i className={`icon icon-sprite
              icon-sprite-small
              icon-${text}
              icon-sprite-small-white`}></i>
            {StringUtil.capitalize(text)}
          </span>

        </div>

        <div className="side-panel-header-actions
          side-panel-header-actions-secondary">
          {this.getHeaderDelete(userID)}
        </div>

      </div>
    );
  }

  getHeaderDelete(userID) {
    if (userID != null) {
      return (
        <span className="side-panel-header-action"
          onClick={this.handleDeleteModalOpen}>
          Delete
        </span>
      );
    }

    return null;
  }

  getContents(ids) {
    if (!this.isOpen()) {
      return null;
    }

    let {nodeID, serviceName, taskID, userID, groupID} = ids;

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

    if (userID != null) {
      return (
        <UserSidePanelContents
          itemID={userID}
          parentRouter={this.context.router} />
      );
    }

    if (groupID != null) {
      return (
        <GroupSidePanelContents
          itemID={groupID}
          parentRouter={this.context.router} />
      );
    }

    return null;
  }

  onUserStoreDeleteError(userID, error) {
    this.setState({
      pendingRequest: false,
      deleteUpdateError: error
    });
  }

  onUserStoreDeleteSuccess() {
    this.setState({
      itemID: null,
      openDeleteConfirmation: false,
      pendingRequest: false
    });
  }

  render() {
    let props = this.props;
    let params = props.params;

    let nodeID = params.nodeID;
    let serviceName = params.serviceName;
    let taskID = params.taskID;
    let userID = params.userID;
    let groupID = params.groupID;

    return (
      <div>
        <SidePanel className="side-panel-detail"
          header={this.getHeader(userID, groupID)}
          headerContainerClass="container
            container-fluid container-fluid-narrow container-pod
            container-pod-short"
          bodyClass="side-panel-content flex-container-col"
          onClose={this.handlePanelClose}
          open={this.isOpen()}>
          {this.getContents({nodeID, serviceName, taskID, userID, groupID})}
        </SidePanel>
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerClass="modal-footer container container-pod container-pod-fluid"
          open={this.state.openDeleteConfirmation}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeleteUser}
          rightButtonClassName="button button-danger"
          rightButtonText="Delete">
          {this.getDeleteModalContent()}
        </Confirm>
      </div>
    );
  }
}

SidePanels.contextTypes = {
  router: React.PropTypes.func
};

SidePanels.propTypes = {
  params: React.PropTypes.object
};
