import {Confirm, Table} from "reactjs-components";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLStore from "../stores/ACLStore";
import ResourceTableUtil from "../utils/ResourceTableUtil";
import StoreMixin from "../mixins/StoreMixin";
import TableUtil from "../utils/TableUtil";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleOpenConfirm",
  "handleButtonConfirm",
  "handleButtonCancel",
  "renderButton"
];

export default class PermissionsTable extends Util.mixin(StoreMixin) {
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
        name: "acl",
        events: [
          "userRevokeSuccess",
          "userRevokeError",
          "groupRevokeSuccess",
          "groupRevokeError"
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

    if (this.props.ownerType === "user") {
      storeAction = ACLStore.revokeUserActionToResource.bind(ACLStore);
    }

    if (this.props.ownerType === "group") {
      storeAction = ACLStore.revokeGroupActionToResource.bind(ACLStore);
    }

    storeAction(this.props.ownerID, "access", this.state.permissionID);
  }

  handleButtonCancel() {
    this.setState({
      openConfirm: false,
      permissionID: null
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
        <col style={{width: "50%"}} />
        <col />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let descriptionHeading = ResourceTableUtil.renderHeading({
      description: "Name"
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction("description");

    return [
      {
        className,
        headerClassName: className,
        prop: "description",
        render: this.renderPermissionLabel,
        sortable: true,
        sortFunction: propSortFunction,
        heading: descriptionHeading
      },
      {
        className,
        headerClassName: className,
        prop: "remove",
        render: this.renderButton,
        sortable: false,
        sortFunction: propSortFunction,
        heading: ""
      }
    ];
  }

  getConfirmModalContent(permissions) {
    let state = this.state;
    let serviceLabel = "this service";
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
      <div className="container-pod text-align-center">
        <p>{`Are you sure you want to remove permission to ${serviceLabel}?`}</p>
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

  // needs more updates
  render() {
    let permissions = this.props.permissions;

    return (
      <div>
        <Confirm
          disabled={this.state.pendingRequest}
          footerClass="modal-footer container container-pod container-pod-fluid"
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
            sortBy={{prop: "description", order: "asc"}}
            useFlex={true}
            transition={false}
            useScrollTable={false} />
        </div>
      </div>
    );
  }
}

PermissionsTable.propTypes = {
  ownerID: React.PropTypes.string,
  ownerType: React.PropTypes.string
};
