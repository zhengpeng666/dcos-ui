import mixin from 'reactjs-mixin';
import React from 'react';
import {Confirm, SidePanel} from 'reactjs-components';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLGroupStore from '../stores/ACLGroupStore';
import GroupSidePanelContents from './GroupSidePanelContents';

let SDK = require('../../../SDK').getSDK();

const METHODS_TO_BIND = [
  'handleDeleteModalOpen',
  'handleDeleteCancel',
  'handlePanelClose',
  'handleDeleteGroup'
];

class GroupSidePanel extends mixin(StoreMixin) {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.state = {
      deleteUpdateError: null,
      openDeleteConfirmation: false,
      pendingRequest: false
    };

    this.store_listeners = [
      {
        name: 'group',
        events: [
          'deleteSuccess',
          'deleteError'
        ]
      }
    ];
  }

  handleDeleteCancel() {
    this.setState({
      openDeleteConfirmation: false
    });
  }

  handleDeleteModalOpen() {
    this.setState({
      deleteUpdateError: null,
      openDeleteConfirmation: true
    });
  }

  handleDeleteGroup() {
    this.setState({
      pendingRequest: true
    });
    ACLGroupStore.deleteGroup(this.props.params.groupID);
  }

  handlePanelClose(closeInfo) {
    if (!this.isOpen()) {
      return;
    }

    let router = this.context.router;

    if (closeInfo && closeInfo.closedByBackdrop) {
      router.transitionTo(this.props.openedPage, router.getCurrentParams());
      return;
    }

    SDK.Hooks.doAction('goBack', router);
  }

  onGroupStoreDeleteError(error) {
    this.setState({
      deleteUpdateError: error,
      pendingRequest: false
    });
  }

  onGroupStoreDeleteSuccess() {
    this.setState({
      openDeleteConfirmation: false,
      pendingRequest: false
    });

    this.context.router.transitionTo('settings-organization-groups');
  }

  isOpen() {
    return (
      this.props.params.groupID != null
      && SDK.Store.getAppState().summary.statesProcessed
    );
  }

  getDeleteModalContent() {
    let error = null;

    if (this.state.deleteUpdateError != null) {
      error = (
        <p className="text-error-state">{this.state.deleteUpdateError}</p>
      );
    }

    let group = ACLGroupStore.getGroup(this.props.params.groupID);
    return (
      <div className="container-pod container-pod-short text-align-center">
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

  render() {
    let groupID = this.props.params.groupID;

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
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
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

module.exports = GroupSidePanel;
