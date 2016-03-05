import {Form} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

const METHODS_TO_BIND = [
  'handleActionRevokeClick',
  'handleFormSubmit'
];

let SDK = require('../../../SDK').getSDK();

let RequestErrorMsg = SDK.get('RequestErrorMsg');

import ACLStore from  '../..//acl/stores/ACLStore';
import ACLGroupsActions from  '../actions/ACLGroupsActions';
import ACLGroupStore from  '../stores/ACLGroupStore';
import AdvancedACLsTab from  '../../../components/AdvancedACLsTab';

class GroupAdvancedACLsTab extends AdvancedACLsTab {
  constructor() {
    super();

    this.store_listeners[0].events.push(
      'createError', 'groupGrantSuccess', 'groupGrantError',
      'groupRevokeSuccess', 'groupRevokeError'
    );
    this.store_listeners.push({
      name: 'group',
      events: ['permissionsSuccess', 'permissionsError']
    });

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    // Make two store mixin events be one,
    // since we want both to do the same thing
    // When granting an ACL to a resource,
    // we want to enable the form when either of these two occur
    this.onAclStoreGroupGrantError = this.onAclStoreCreateResponse.bind(this);
    this.onAclStoreCreateError = this.onAclStoreCreateResponse.bind(this);
    // When revoking an ACL to the resource,
    // we want both of these events to do the same thing.
    this.onAclStoreGroupRevokeSuccess =
      this.onAclStoreRevokeResponse.bind(this);
    this.onAclStoreGroupRevokeError =
      this.onAclStoreRevokeResponse.bind(this);
    // When we recieve the Principal's permissions then call child
    this.onGroupStorePermissionsSuccess =
      this.onStorePermissionsSuccess.bind(this);

    this.internalStorage_set({revokeActionsRemaining: 0});
  }

  componentWillMount() {
    super.componentWillMount(...arguments);
    ACLGroupsActions.fetchGroupPermissions(this.props.itemID);
  }

  onAclStoreGroupGrantSuccess() {
    ACLGroupsActions.fetchGroupPermissions(this.props.itemID);
    this.onAclStoreCreateResponse(true);
  }

  onAclStoreFetchResourceError() {
    super.onAclStoreFetchResourceError(...arguments);
    ACLGroupsActions.fetchGroupPermissions(this.props.itemID);
  }

  onGroupStorePermissionsError() {
    ACLGroupsActions.fetchGroupPermissions(this.props.itemID);
    this.setState({
      itemPermissionsRequestErrors: this.state.itemPermissionsRequestErrors + 1
      });
  }

  handleFormSubmit(formData) {
    ACLStore.grantGroupActionToResource(
      this.props.itemID, formData.action, formData.resource
    );
    super.handleFormSubmit(...arguments);
  }

  /**
   * Handles revoking an action
   *
   * @param  {Number} resourceID A resource ID
   * @param  {Array} actions A list of actions
   */
  handleActionRevokeClick(resourceID, actions) {
    if (actions.length === 0) {
      return;
    }

    this.internalStorage_set({revokeActionsRemaining: actions.length});
    actions.forEach((action) => {
      ACLStore.revokeGroupActionToResource(
        this.props.itemID, action, resourceID
      );
    });
  }

  getACLs() {
    let Group = ACLGroupStore.getGroup(this.props.itemID);
    let allACLs = Group.getPermissions();

    if (allACLs == null) {
      return [];
    }

    let acls = [];

    if (allACLs && allACLs.length) {
      allACLs.forEach(function (acl) {
        let actions = [];
        acl.actions.forEach(function (action) {
          actions.push(action.name);
        });

        acls.push({
          rid: acl.rid,
          actions,
          removable: true
        });
      });
    }

    return acls;
  }
}

module.exports = GroupAdvancedACLsTab;
