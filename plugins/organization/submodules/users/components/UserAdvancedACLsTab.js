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

import ACLStore from '../../acl/stores/ACLStore';
import ACLUsersActions from '../actions/ACLUsersActions';
import ACLUserStore from '../stores/ACLUserStore';
import AdvancedACLsTab from '../../../components/AdvancedACLsTab';

class UserAdvancedACLsTab extends AdvancedACLsTab {
  constructor() {
    super();

    this.store_listeners[0].events.push(
      'createError', 'userGrantSuccess', 'userGrantError',
      'userRevokeSuccess', 'userRevokeError'
    );
    this.store_listeners.push({
      name: 'user',
      events: ['permissionsSuccess', 'permissionsError']
    });

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    // Make two store mixin events be one,
    // since we want both to do the same thing
    // When granting an ACL to a resource,
    // we want to enable the form when either of these two occur
    this.onAclStoreUserGrantError = this.onAclStoreCreateResponse.bind(this);
    this.onAclStoreCreateError = this.onAclStoreCreateResponse.bind(this);
    // When revoking an ACL to the resource,
    // we want both of these events to do the same thing.
    this.onAclStoreUserRevokeSuccess =
      this.onAclStoreRevokeResponse.bind(this);
    this.onAclStoreUserRevokeError =
      this.onAclStoreRevokeResponse.bind(this);
    // When we recieve the Principal's permissions then call child
    this.onUserStorePermissionsSuccess =
      this.onStorePermissionsSuccess.bind(this);

    this.internalStorage_set({revokeActionsRemaining: 0});
  }

  componentWillMount() {
    super.componentWillMount(...arguments);
    ACLUsersActions.fetchUserPermissions(this.props.itemID);
  }

  onAclStoreUserGrantSuccess() {
    ACLUsersActions.fetchUserPermissions(this.props.itemID);
    this.onAclStoreCreateResponse(true);
  }

  onAclStoreFetchResourceError() {
    super.onAclStoreFetchResourceError(...arguments);
    ACLUsersActions.fetchUserPermissions(this.props.itemID);
  }

  onUserStorePermissionsError() {
    ACLUsersActions.fetchUserPermissions(this.props.itemID);
    this.setState({
      itemPermissionsRequestErrors: this.state.itemPermissionsRequestErrors + 1
      });
  }

  handleFormSubmit(formData) {
    ACLStore.grantUserActionToResource(
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
      ACLStore.revokeUserActionToResource(
        this.props.itemID, action, resourceID
      );
    });
  }

  getACLs() {
    let user = ACLUserStore.getUser(this.props.itemID);
    let allACLs = user.getPermissions();

    if (allACLs == null) {
      return [];
    }

    let acls = [];

    ['direct', 'groups'].forEach(function (type) {
      if (allACLs[type]) {
        allACLs[type].forEach(function (acl) {
          let actions = [];
          acl.actions.forEach(function (action) {
            actions.push(action.name);
          });

          acls.push({
            rid: acl.rid,
            actions,
            removable: type === 'direct'
          });
        });
      }
    });

    return acls;
  }
}

module.exports = UserAdvancedACLsTab;
