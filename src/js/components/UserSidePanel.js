import React from "react/addons";
import {Confirm, SidePanel} from "reactjs-components";

import ACLUserStore from "../stores/ACLUserStore";
import HistoryStore from "../stores/HistoryStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import StoreMixin from "../mixins/StoreMixin";
import UserSidePanelContents from "./UserSidePanelContents";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleDeleteModalOpen",
  "handleDeleteCancel",
  "handlePanelClose",
  "handleDeleteUser"
];

export default class UserSidePanel extends Util.mixin(StoreMixin) {
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
    this.setState({
      pendingRequest: true
    });
    ACLUserStore.deleteUser(this.state.itemID);
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
    return (
      this.props.params.userID != null
      && MesosSummaryStore.get("statesProcessed")
    );
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
        <h3 className="flush-top">Are you sure?</h3>
        <p>{`${user.description} will be deleted.`}</p>
        {error}
      </div>
    );
  }

  getHeader(userID) {
    return (
      <div className="side-panel-header-container">
        <div className="side-panel-header-actions
          side-panel-header-actions-primary">

          <span className="side-panel-header-action"
            onClick={this.handlePanelClose}>
            <i className={`icon icon-sprite
              icon-sprite-small
              icon-close
              icon-sprite-small-white`}></i>
            Close
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
        <span className="side-panel-header-action text-align-right"
          onClick={this.handleDeleteModalOpen}>
          Delete
        </span>
      );
    }

    return null;
  }

  getContents(userID) {
    if (!this.isOpen()) {
      return null;
    }

    return (
      <UserSidePanelContents
        itemID={userID}
        parentRouter={this.context.router} />
    );
  }

  onUserStoreDeleteError(userID, error) {
    this.setState({
      deleteUpdateError: error,
      pendingRequest: false
    });
  }

  onUserStoreDeleteSuccess() {
    this.setState({
      itemID: null,
      openDeleteConfirmation: false,
      pendingRequest: false
    });

    this.context.router.transitionTo("settings-organization-users");
  }

  render() {
    let userID = this.props.params.userID;

    return (
      <div>
        <SidePanel className="side-panel-detail"
          header={this.getHeader(userID)}
          headerContainerClass="container
            container-fluid container-fluid-narrow container-pod
            container-pod-short"
          bodyClass="side-panel-content flex-container-col"
          onClose={this.handlePanelClose}
          open={this.isOpen()}>
          {this.getContents(userID)}
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

UserSidePanel.contextTypes = {
  router: React.PropTypes.func
};

UserSidePanel.propTypes = {
  params: React.PropTypes.object
};
