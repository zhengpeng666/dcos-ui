import {Dropdown} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLGroupStore from '../stores/ACLGroupStore';
import ACLUsersStore from '../../users/stores/ACLUsersStore';
import GroupUserTable from './GroupUserTable';

const DEFAULT_ID = 'default-placeholder-user-id';
const NO_USERS_AVAILABLE_ID = 'no-users-available';

const METHODS_TO_BIND = [
  'onUserSelection'
];

let SDK = require('../../../SDK').getSDK();

let {RequestErrorMsg, Util} = SDK.get(['RequestErrorMsg', 'Util']);

class GroupUserMembershipTable extends mixin(StoreMixin) {
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
        name: 'users',
        events: ['error', 'success']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLUsersStore.fetchUsers();
  }

  onUserSelection(user) {
    ACLGroupStore.addUser(this.props.groupID, user.id);
  }

  onUsersStoreError() {
    this.setState({
      requestUsersSuccess: false,
      requestUsersError: true
    });
  }

  onUsersStoreSuccess() {
    this.setState({
      requestUsersSuccess: true,
      requestUsersError: false
    });
  }

  getDropdownItems() {
    let users = ACLUsersStore.get('users').getItems().sort(
      Util.getLocaleCompareSortFn('description')
    );
    let groupDetails = ACLGroupStore.getGroup(this.props.groupID);
    let groupUsers = groupDetails.users.map(function (user) {
      return user.user;
    });
    let filteredUsers = users.filter(function (user) {
      // Filter out any user which is already part of the group.
      let uid = user.uid;
      return !groupUsers.some(function (currentUser) {
        return currentUser.uid === uid;
      });
    });

    let defaultItem = {
      className: 'hidden',
      description: 'Add User',
      selectable: false,
      uid: DEFAULT_ID
    };
    let items = [defaultItem].concat(filteredUsers);

    if (!filteredUsers || filteredUsers.length === 0) {
      items.push({
        description: 'No users to add.',
        uid: NO_USERS_AVAILABLE_ID,
        selectable: false
      });
    }

    return items.map(function (user) {
      let selectable = true;
      let selectedHtml = user.description;

      if (user.selectable != null) {
        selectable = user.selectable;
      }

      return {
        className: user.className || '',
        id: user.uid,
        name: selectedHtml,
        html: selectedHtml,
        selectable,
        selectedHtml
      };
    });
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
    if (this.state.requestUsersError) {
      return (
        <div className="container container-fluid container-pod flush-bottom">
          <RequestErrorMsg />
        </div>
      );
    }

    if (!this.state.requestUsersSuccess) {
      return this.getLoadingScreen();
    }

    return (
      <div>
        <div className="container container-fluid container-pod
          container-pod-short flush-bottom">
          <Dropdown buttonClassName="button dropdown-toggle"
            dropdownMenuClassName="dropdown-menu"
            dropdownMenuListClassName="dropdown-menu-list"
            items={this.getDropdownItems()}
            onItemSelection={this.onUserSelection}
            persistentID="default-placeholder-user-id"
            transition={true}
            wrapperClassName="dropdown" />
        </div>
        <div className="container container-fluid container-pod
          container-pod-short">
          <GroupUserTable groupID={this.props.groupID} />
        </div>
      </div>
    );
  }
}

module.exports = GroupUserMembershipTable;
