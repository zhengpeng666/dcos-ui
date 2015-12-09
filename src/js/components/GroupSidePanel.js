import React from "react/addons";
import {Confirm, SidePanel} from "reactjs-components";

import ACLGroupStore from "../stores/ACLGroupStore";
import HistoryStore from "../stores/HistoryStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import StoreMixin from "../mixins/StoreMixin";
import GroupSidePanelContents from "./GroupSidePanelContents";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleDeleteModalOpen",
  "handleDeleteCancel",
  "handlePanelClose",
  "handleDeleteGroup"
];

export default class GroupSidePanel extends Util.mixin(StoreMixin) {
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
        name: "group",
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
      itemID: this.props.params.groupID,
      deleteUpdateError: null,
      openDeleteConfirmation: true
    });
  }

  handleDeleteGroup() {
    this.setState({
      pendingRequest: true
    });
    ACLGroupStore.deleteGroup(this.state.itemID);
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

    return (params.groupID != null && MesosSummaryStore.get("statesProcessed"));
  }

  getDeleteModalContent() {
    let error = null;

    if (this.state.deleteUpdateError != null) {
      error = (
        <p className="text-error-state">{this.state.deleteUpdateError}</p>
      );
    }

    let group = ACLGroupStore.getGroup(this.state.itemID);
    return (
      <div className="container-pod text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>{`${group.description} will be deleted.`}</p>
        {error}
      </div>
    );
  }

  getHeader(groupID) {
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
          {this.getHeaderDelete(groupID)}
        </div>

      </div>
    );
  }

  getHeaderDelete(groupID) {
    if (groupID != null) {
      return (
        <span className="side-panel-header-action"
          onClick={this.handleDeleteModalOpen}>
          Delete
        </span>
      );
    }

    return null;
  }

  getContents(groupID) {
    if (!this.isOpen()) {
      return null;
    }

    return (
      <GroupSidePanelContents
        itemID={groupID}
        parentRouter={this.context.router} />
    );
  }

  onGroupStoreDeleteError(groupID, error) {
    this.setState({
      deleteUpdateError: error,
      pendingRequest: false
    });
  }

  onGroupStoreDeleteSuccess() {
    this.setState({
      itemID: null,
      openDeleteConfirmation: false,
      pendingRequest: false
    });

    this.context.router.transitionTo("settings-organization-groups");
  }

  render() {
    let props = this.props;
    let groupID = props.params.groupID;

    return (
      <div>
        <SidePanel className="side-panel-detail"
          header={this.getHeader(groupID)}
          headerContainerClass="container
            container-fluid container-fluid-narrow container-pod
            container-pod-short"
          bodyClass="side-panel-content flex-container-col"
          onClose={this.handlePanelClose}
          open={this.isOpen()}>
          {this.getContents(groupID)}
        </SidePanel>
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerClass="modal-footer container container-pod container-pod-fluid"
          open={this.state.openDeleteConfirmation}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeleteGroup}
          rightButtonClassName="button button-danger"
          rightButtonText="Delete">
          {this.getDeleteModalContent()}
        </Confirm>
      </div>
    );
  }
}

GroupSidePanel.contextTypes = {
  router: React.PropTypes.func
};

GroupSidePanel.propTypes = {
  params: React.PropTypes.object
};
