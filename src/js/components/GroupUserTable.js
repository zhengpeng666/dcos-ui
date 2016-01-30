import {Confirm, Table} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLGroupStore from '../stores/ACLGroupStore';
import ResourceTableUtil from '../utils/ResourceTableUtil';
import TableUtil from '../utils/TableUtil';

const METHODS_TO_BIND = [
  'handleOpenConfirm',
  'handleButtonConfirm',
  'handleButtonCancel',
  'renderButton'
];

export default class GroupUserTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      userID: null,
      openConfirm: false,
      pendingRequest: false,
      requestUsersError: false,
      requestUsersSuccess: false,
      groupUpdateError: null
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

  handleOpenConfirm(user) {
    this.setState({
      userID: user.uid,
      openConfirm: true,
      groupUpdateError: null
    });
  }

  handleButtonConfirm() {
    this.setState({pendingRequest: true});
    ACLGroupStore.deleteUser(this.props.groupID, this.state.userID);
  }

  handleButtonCancel() {
    this.setState({openConfirm: false, userID: null});
  }

  onGroupStoreDeleteUserError(groupID, userID, error) {
    this.setState({groupUpdateError: error, pendingRequest: false});
  }

  onGroupStoreDeleteUserSuccess() {
    this.setState({openConfirm: false, pendingRequest: false, userID: null});
  }

  onUsersStoreError() {
    this.setState({
      requestUsersError: true
    });
  }

  onUsersStoreSuccess() {
    this.setState({
      requestUsersSuccess: true,
      requestUsersError: false
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
        render: this.renderUserLabel,
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

  getConfirmModalContent(groupDetails) {
    let state = this.state;
    let userLabel = 'this user';
    groupDetails.users.forEach(function (user) {
      if (user.user.uid === state.userID) {
        userLabel = user.user.description;
      }
    });

    let groupLabel = groupDetails.description;
    let error = null;

    if (state.groupUpdateError != null) {
      error = (
        <p className="text-error-state">{state.groupUpdateError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>{`${userLabel} will be removed from the ${groupLabel} group.`}</p>
        {error}
      </div>
    );
  }

  getLoadingScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center
        vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  renderUserLabel(prop, user) {
    return user[prop];
  }

  renderButton(prop, user) {
    return (
      <div className="text-align-right">
        <button className="button button-danger button-stroke button-small"
          onClick={this.handleOpenConfirm.bind(this, user)}>
          Remove
        </button>
      </div>
    );
  }

  render() {
    let groupDetails = ACLGroupStore.getGroup(this.props.groupID);
    let groupUsers = groupDetails.users.map(function (user) {
      return user.user;
    });

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
          {this.getConfirmModalContent(groupDetails)}
        </Confirm>
        <Table
          className="table table-borderless-outer table-borderless-inner-columns
            flush-bottom no-overflow"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={groupUsers}
          idAttribute="uid"
          itemHeight={TableUtil.getRowHeight()}
          sortBy={{prop: 'description', order: 'asc'}}
          useFlex={true}
          transition={false}
          useScrollTable={false} />
      </div>
    );
  }
}
