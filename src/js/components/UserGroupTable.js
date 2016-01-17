import {Confirm, Table} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLGroupStore from '../stores/ACLGroupStore';
import ACLUserStore from '../stores/ACLUserStore';
import ResourceTableUtil from '../utils/ResourceTableUtil';
import TableUtil from '../utils/TableUtil';

const METHODS_TO_BIND = [
  'handleOpenConfirm',
  'handleButtonConfirm',
  'handleButtonCancel',
  'renderButton'
];

export default class UserGroupTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      groupID: null,
      openConfirm: false,
      pendingRequest: false,
      requestGroupsSuccess: false,
      requestGroupsError: false,
      userUpdateError: null
    };

    this.store_listeners = [
      {
        name: 'group',
        events: ['deleteUserSuccess', 'deleteUserError', 'usersSuccess']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleOpenConfirm(group) {
    this.setState({
      groupID: group.gid,
      openConfirm: true,
      userUpdateError: null
    });
  }

  handleButtonConfirm() {
    ACLGroupStore.deleteUser(this.state.groupID, this.props.userID);
    this.setState({pendingRequest: true});
  }

  handleButtonCancel() {
    this.setState({groupID: null, openConfirm: false});
  }

  onGroupStoreDeleteUserError(groupID, userID, error) {
    this.setState({pendingRequest: false, userUpdateError: error});
  }

  onGroupStoreDeleteUserSuccess() {
    this.setState({groupID: null, openConfirm: false, pendingRequest: false});
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
      description: 'Group Name'
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction('description');

    return [
      {
        className,
        headerClassName: className,
        prop: 'description',
        render: this.renderGroupLabel,
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

  getConfirmModalContent(userDetails) {
    let state = this.state;
    let groupLabel = 'this group';
    userDetails.groups.forEach(function (group) {
      if (group.group.gid === state.groupID) {
        groupLabel = group.group.description;
      }
    });

    let userName = userDetails.description;
    let error = null;

    if (state.userUpdateError != null) {
      error = (
        <p className="text-error-state">{state.userUpdateError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>{`${userName} will be removed from ${groupLabel}.`}</p>
        {error}
      </div>
    );
  }

  renderGroupLabel(prop, group) {
    return group[prop];
  }

  renderButton(prop, group) {
    return (
      <div className="text-align-right">
        <button className="button button-danger button-stroke button-small"
          onClick={this.handleOpenConfirm.bind(this, group)}>
          Remove
        </button>
      </div>
    );
  }

  render() {
    let userDetails = ACLUserStore.getUser(this.props.userID);
    let userGroups = userDetails.groups.map(function (group) {
      return group.group;
    });

    return (
      <div>
        <Confirm
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid"
          open={this.state.openConfirm}
          onClose={this.handleButtonCancel}
          leftButtonCallback={this.handleButtonCancel}
          rightButtonCallback={this.handleButtonConfirm}>
          {this.getConfirmModalContent(userDetails)}
        </Confirm>
        <Table
          className="table table-borderless-outer
            table-borderless-inner-columns flush-bottom no-overflow
            flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={userGroups}
          idAttribute="gid"
          itemHeight={TableUtil.getRowHeight()}
          sortBy={{prop: 'description', order: 'asc'}}
          useFlex={true}
          transition={false}
          useScrollTable={false} />
      </div>
    );
  }
}
