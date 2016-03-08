import {Dropdown} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLGroupStore from '../../groups/stores/ACLGroupStore';
import ACLGroupsStore from '../../groups/stores/ACLGroupsStore';
import ACLUserStore from '../../users/stores/ACLUserStore';
import UserGroupTable from './UserGroupTable';

const DEFAULT_ID = 'default-placeholder-group-id';
const NO_GROUPS_AVAILABLE_ID = 'no-groups-available';

const METHODS_TO_BIND = [
  'onGroupSelection'
];

let SDK = require('../../../SDK').getSDK();

let {RequestErrorMsg, Util} = SDK.get(['RequestErrorMsg', 'Util']);

class UserGroupMembershipTab extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      pendingRequest: false,
      requestGroupsSuccess: false,
      requestGroupsError: false,
      userUpdateError: null
    };

    this.store_listeners = [
      {
        name: 'group',
        events: [
          'deleteUserSuccess',
          'deleteUserError',
          'usersSuccess'
        ]
      },
      {
        name: 'groups',
        events: [
          'success',
          'error'
        ]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLGroupsStore.fetchGroups();
  }

  onGroupSelection(group) {
    if (group.id === DEFAULT_ID) {
      return;
    }
    ACLGroupStore.addUser(group.id, this.props.userID);
  }

  onGroupsStoreError() {
    this.setState({
      requestGroupsSuccess: false,
      requestGroupsError: true
    });
  }

  onGroupsStoreSuccess() {
    this.setState({
      requestGroupsSuccess: true,
      requestGroupsError: false
    });
  }

  getDropdownItems() {
    let groups = ACLGroupsStore.getGroups().getItems().sort(
      Util.getLocaleCompareSortFn('description')
    );
    let userDetails = ACLUserStore.getUser(this.props.userID);
    let userGroups = userDetails.getGroups().getItems();
    let filteredGroups = groups.filter(function (group) {
      // Filter out any group which is in permissions
      let gid = group.get('gid');
      return !userGroups.some(function (currentGroup) {
        return currentGroup.get('gid') === gid;
      });
    });

    let defaultItem = {
      className: 'hidden',
      description: 'Add Group',
      gid: DEFAULT_ID,
      selectable: false
    };
    let items = [defaultItem].concat(filteredGroups);

    if (!filteredGroups || filteredGroups.length === 0) {
      items.push({
        description: 'No groups to add.',
        gid: NO_GROUPS_AVAILABLE_ID,
        selectable: false
      });
    }

    return items.map(function (group) {
      let selectable = true;
      let selectedHtml = group.description;

      if (group.selectable != null) {
        selectable = group.selectable;
      }

      return {
        className: group.className || '',
        id: group.gid,
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

  render() {
    if (this.state.requestGroupsError) {
      return <RequestErrorMsg />;
    }

    if (!this.state.requestGroupsSuccess) {
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
            onItemSelection={this.onGroupSelection}
            persistentID="default-placeholder-group-id"
            transition={true}
            wrapperClassName="dropdown" />
        </div>
        <div className="container container-fluid container-pod
          container-pod-short">
          <UserGroupTable userID={this.props.userID} />
        </div>
      </div>
    );
  }
}

module.exports = UserGroupMembershipTab;
