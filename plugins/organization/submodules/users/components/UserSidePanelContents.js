import {Form} from 'reactjs-components';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

import _ACLUserStore from '../stores/ACLUserStore';
import _PermissionsView from '../../acl/components/PermissionsView';
import _UserDetails from './UserDetails';
import _UserGroupMembershipTab from './UserGroupMembershipTab';

import MesosSummaryStore from '../../../../../src/js/stores/MesosSummaryStore';

const EXTERNAL_CHANGE_EVENTS = [
  'onAclStoreUserGrantSuccess',
  'onAclStoreUserRevokeSuccess',
  'onGroupStoreAddUserSuccess',
  'onGroupStoreDeleteUserSuccess'
];

const METHODS_TO_BIND = ['handleNameChange'];

module.exports = (PluginSDK) => {

  let {RequestErrorMsg, SidePanelContents, StringUtil} = PluginSDK.get([
    'RequestErrorMsg', 'SidePanelContents', 'StringUtil']);

  let ACLUserStore = _ACLUserStore(PluginSDK);
  let PermissionsView = _PermissionsView(PluginSDK);
  let UserDetails = _UserDetails(PluginSDK);
  let UserGroupMembershipTab = _UserGroupMembershipTab(PluginSDK);

  class UserSidePanelContents extends SidePanelContents {
    constructor() {
      super();

      this.tabs_tabs = {
        permissions: 'Permissions',
        membership: 'Group Membership',
        details: 'Details'
      };

      this.state = {
        currentTab: Object.keys(this.tabs_tabs).shift(),
        fetchedDetailsError: false
      };

      this.store_listeners = [
        {
          name: 'acl',
          events: [
            'userGrantSuccess',
            'userRevokeSuccess'
          ]
        },
        {
          name: 'group',
          events: ['addUserSuccess', 'deleteUserSuccess']
        },
        {
          name: 'user',
          events: ['fetchedDetailsSuccess', 'fetchedDetailsError']
        },
        {
          name: 'summary',
          events: ['success'],
          listenAlways: false
        }
      ];

      EXTERNAL_CHANGE_EVENTS.forEach((event) => {
        this[event] = this.onACLChange;
      });

      METHODS_TO_BIND.forEach((method) => {
        this[method] = this[method].bind(this);
      });
    }

    componentDidMount() {
      super.componentDidMount();

      ACLUserStore.fetchUserWithDetails(this.props.itemID);
    }

    handleNameChange(model) {
      ACLUserStore.updateUser(this.props.itemID, {description: model.text});
    }

    onACLChange() {
      ACLUserStore.fetchUserWithDetails(this.props.itemID);
    }

    onUserStoreFetchedDetailsSuccess() {
      if (this.state.fetchedDetailsError === true) {
        this.setState({fetchedDetailsError: false});
      }
    }

    onUserStoreFetchedDetailsError(userID) {
      if (userID === this.props.itemID) {
        this.setState({fetchedDetailsError: true});
      }
    }

    getErrorNotice() {
      return (
        <div className="container container-pod">
          <RequestErrorMsg />
        </div>
      );
    }

    getUserInfo(user) {
      let editNameFormDefinition = [
        {
          fieldType: 'text',
          name: 'text',
          placeholder: 'User\'s Full Name',
          required: true,
          sharedClass: 'form-element-inline h1 flush',
          showError: false,
          showLabel: false,
          writeType: 'edit',
          validation: function () { return true; },
          value: user.description
        }
      ];

      let imageTag = (
        <div className="side-panel-icon icon icon-large icon-image-container icon-user-container">
          <img src="./img/layout/icon-user-default-64x64@2x.png" />
        </div>
      );

      return (
        <div className="side-panel-content-header-details flex-box
          flex-box-align-vertical-center">
          {imageTag}
          <div className="side-panel-content-header-label">
            <Form definition={editNameFormDefinition}
              formRowClass="row"
              formGroupClass="form-group flush-bottom"
              onSubmit={this.handleNameChange} />
            <div>
              {this.getSubHeader(user)}
            </div>
          </div>
        </div>
      );
    }

    getSubHeader(user) {
      let groupCount = user.getGroupCount();
      let serviceCount = user.getPermissionCount();
      let groupLabel = StringUtil.pluralize('group', groupCount);
      let serviceLabel = StringUtil.pluralize('Service', serviceCount);
      let remote = '';

      if (user.isRemote()) {
        remote = '. Managed by External LDAP';
      }

      return (
        <div>
          {
            `${serviceCount} ${serviceLabel}, Member of ${groupCount}
  ${groupLabel}${remote}`
          }
        </div>
      );
    }

    renderDetailsTabView() {
      return (
        <UserDetails userID={this.props.itemID} />
      );
    }

    renderPermissionsTabView(user) {
      return (
        <div className="
          side-panel-tab-content
          side-panel-section
          container
          container-fluid
          container-pod
          container-pod-short
          container-fluid
          flex-container-col
          flex-grow">
          <PermissionsView
            permissions={user.getUniquePermissions()}
            itemID={this.props.itemID}
            itemType="user" />
        </div>
      );
    }

    renderGroupMembershipTabView() {
      return (
        <UserGroupMembershipTab userID={this.props.itemID} />
      );
    }

    render() {
      let user = ACLUserStore.getUser(this.props.itemID);

      if (this.state.fetchedDetailsError) {
        return this.getErrorNotice();
      }

      if (user.get('uid') == null ||
        !MesosSummaryStore.get('statesProcessed')) {
        return this.getLoadingScreen();
      }

      return (
        <div className="flex-container-col">
          <div className="container container-fluid container-pod
            container-pod-divider-bottom container-pod-divider-bottom-align-right
            container-pod-divider-inverse container-pod-short-top
            side-panel-content-header side-panel-section flush-bottom">
            {this.getUserInfo(user)}
            <ul className="tabs tall list-inline flush-bottom">
              {this.tabs_getUnroutedTabs()}
            </ul>
          </div>
          {this.tabs_getTabView(user)}
        </div>
      );
    }
  }
  return UserSidePanelContents;
};

