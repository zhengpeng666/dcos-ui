/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLUserStore from "../stores/ACLUserStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import PermissionsView from "./PermissionsView";
import RequestErrorMsg from "./RequestErrorMsg";
import SidePanelContents from "./SidePanelContents";
import StringUtil from "../utils/StringUtil";
import UserGroupTable from "./UserGroupTable";

export default class UserSidePanelContents extends SidePanelContents {

    constructor() {
      super();

      this.tabs_tabs = {
        permissions: "Permissions",
        membership: "Group Membership",
        details: "Details"
      };

      this.state = {
        currentTab: Object.keys(this.tabs_tabs).shift(),
        fetchedDetailsError: false
      };

      this.store_listeners = [
        {
          name: "summary",
          events: ["success"],
          listenAlways: false
        },
        {
          name: "user",
          events: ["fetchedDetailsSuccess", "fetchedDetailsError"]
        }
      ];
    }

    componentDidMount() {
      super.componentDidMount();

      ACLUserStore.fetchUserWithDetails(this.props.itemID);
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
      let imageTag = (
        <div className="side-panel-icon icon icon-large icon-image-container icon-user-container">
          <img src="./img/layout/icon-user-default-64x64@2x.png" />
        </div>
      );

      return (
        <div className="side-panel-content-header-details flex-box
          flex-box-align-vertical-center">
          {imageTag}
          <div>
            <h1 className="side-panel-content-header-label flush">
              {user.description}
            </h1>
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
      let groupLabel = StringUtil.pluralize("group", groupCount);
      let serviceLabel = StringUtil.pluralize("Service", serviceCount);

      return (
        <div>
          {`${serviceCount} ${serviceLabel}, Member of ${groupCount} ${groupLabel}`}
        </div>
      );
    }

    renderDetailsTabView() {
      return null;
    }

    renderPermissionsTabView(user) {
      return (
        <div className="
          side-panel-tab-content
          side-panel-section
          container
          container-fluid
          container-pod
          container-pod-short-top
          container-fluid
          flex-container-col
          flush-bottom
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
        <UserGroupTable userID={this.props.itemID} />
      );
    }

    render() {
      let user = ACLUserStore.getUser(this.props.itemID);

      if (this.state.fetchedDetailsError) {
        return this.getErrorNotice();
      }

      if (user.get("uid") == null ||
          !MesosSummaryStore.get("statesProcessed")) {
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
