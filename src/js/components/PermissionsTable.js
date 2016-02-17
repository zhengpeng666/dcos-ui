import {Confirm, Table} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLStore from '../stores/ACLStore';
import ResourceTableUtil from '../utils/ResourceTableUtil';
import TableUtil from '../utils/TableUtil';

const METHODS_TO_BIND = [
  'handleOpenConfirm',
  'handleButtonConfirm',
  'handleButtonCancel',
  'renderButton'
];

class PermissionsTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      permissionID: null,
      openConfirm: false,
      pendingRequest: false,
      permissionUpdateError: null
    };

    this.store_listeners = [
      {
        name: 'acl',
        events: [
          'userRevokeSuccess',
          'userRevokeError',
          'groupRevokeSuccess',
          'groupRevokeError'
        ]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleOpenConfirm(permission) {
    this.setState({
      permissionID: permission.rid,
      openConfirm: true,
      permissionUpdateError: null
    });
  }

  handleButtonConfirm() {
    this.setState({pendingRequest: true});
    let storeAction;

    if (this.props.itemType === 'user') {
      storeAction = ACLStore.revokeUserActionToResource.bind(ACLStore);
    }

    if (this.props.itemType === 'group') {
      storeAction = ACLStore.revokeGroupActionToResource.bind(ACLStore);
    }

    storeAction(this.props.itemID, 'access', this.state.permissionID);
  }

  handleButtonCancel() {
    this.setState({
      openConfirm: false,
      permissionID: null
    });
  }

  onAclStoreGroupRevokeError(error) {
    this.setState({
      permissionUpdateError: error,
      pendingRequest: false
    });
  }

  onAclStoreGroupRevokeSuccess() {
    this.setState({
      openConfirm: false,
      permissionID: null,
      pendingRequest: false
    });
  }

  onAclStoreUserRevokeError(error) {
    this.setState({
      permissionUpdateError: error,
      pendingRequest: false
    });
  }

  onAclStoreUserRevokeSuccess() {
    this.setState({
      openConfirm: false,
      permissionID: null,
      pendingRequest: false
    });
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '50%'}} />
        <col />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let descriptionHeading = ResourceTableUtil.renderHeading({
      description: 'Name'
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction('description');

    return [
      {
        className,
        headerClassName: className,
        prop: 'description',
        render: this.renderPermissionLabel,
        sortable: true,
        sortFunction: propSortFunction,
        heading: descriptionHeading
      },
      {
        className,
        headerClassName: className,
        prop: 'remove',
        render: this.renderButton,
        sortable: false,
        sortFunction: propSortFunction,
        heading: ''
      }
    ];
  }

  getConfirmModalContent(permissions) {
    let state = this.state;
    let serviceLabel = 'this service';
    permissions.forEach(function (permission) {
      if (permission.rid === state.permissionID) {
        serviceLabel = permission.description;
      }
    });

    let error = null;

    if (state.permissionUpdateError != null) {
      error = (
        <p className="text-error-state">{state.permissionUpdateError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>{`Permission to ${serviceLabel} will be removed.`}</p>
        {error}
      </div>
    );
  }

  renderPermissionLabel(prop, user) {
    return user[prop];
  }

  renderButton(prop, permission) {
    return (
      <div key={permission.rid} className="text-align-right">
        <button className="button button-danger button-stroke button-small"
          onClick={this.handleOpenConfirm.bind(this, permission)}>
          Remove
        </button>
      </div>
    );
  }

  render() {
    let permissions = this.props.permissions;

    return (
      <div>
        <Confirm
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={this.state.openConfirm}
          onClose={this.handleButtonCancel}
          leftButtonCallback={this.handleButtonCancel}
          rightButtonCallback={this.handleButtonConfirm}>
          {this.getConfirmModalContent(permissions)}
        </Confirm>
        <div className="container container-fluid container-pod
          container-pod-short flush-horizontal">
          <Table
            className="table table-borderless-outer table-borderless-inner-columns
              flush-bottom no-overflow flush-bottom"
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
            data={permissions}
            idAttribute="rid"
            itemHeight={TableUtil.getRowHeight()}
            sortBy={{prop: 'description', order: 'asc'}}
            useFlex={true}
            transition={false}
            useScrollTable={false} />
        </div>
      </div>
    );
  }
}

PermissionsTable.propTypes = {
  permissions: React.PropTypes.array,
  itemID: React.PropTypes.string,
  itemType: React.PropTypes.string
};

module.exports = PermissionsTable;
