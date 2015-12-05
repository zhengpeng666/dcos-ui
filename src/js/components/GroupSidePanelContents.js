/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLGroupStore from "../stores/ACLGroupStore";
import GroupUserTable from "./GroupUserTable";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import PermissionsView from "./PermissionsView";
import RequestErrorMsg from "./RequestErrorMsg";
import SidePanelContents from "./SidePanelContents";
import StringUtil from "../utils/StringUtil";

export default class GroupSidePanelContents extends SidePanelContents {

  constructor() {
    super();

    this.tabs_tabs = {
      permissions: "Permissions",
      members: "Members"
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
        name: "group",
        events: ["fetchedDetailsSuccess", "fetchedDetailsError"]
      }
    ];
  }

  componentDidMount() {
    super.componentDidMount();

    ACLGroupStore.fetchGroupWithDetails(this.props.itemID);
  }

  onGroupStoreFetchedDetailsSuccess() {
    if (this.state.fetchedDetailsError === true) {
      this.setState({fetchedDetailsError: false});
    }
  }

  onGroupStoreFetchedDetailsError(groupID) {
    if (groupID === this.props.itemID) {
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

  getGroupInfo(group) {
    let imageTag = (
      <div className="side-panel-icon icon icon-large icon-image-container icon-group-container">
        <img src="./img/layout/icon-group-default-64x64@2x.png" />
      </div>
    );

    return (
      <div className="side-panel-content-header-details flex-box
        flex-box-align-vertical-center">
        {imageTag}
        <div>
          <h1 className="side-panel-content-header-label flush">
            {group.description}
          </h1>
          <div>
            {this.getSubHeader(group)}
          </div>
        </div>
      </div>
    );
  }

  getSubHeader(group) {
    let userCount = group.getUserCount();
    let serviceCount = group.getPermissionCount();
    let userLabel = StringUtil.pluralize("Member", userCount);
    let serviceLabel = StringUtil.pluralize("Service", serviceCount);

    return (
      <div>
        {`${serviceCount} ${serviceLabel}, ${userCount} ${userLabel}`}
      </div>
    );
  }

  renderPermissionsTabView(group) {
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
          group={group}
          parentRouter={this.props.parentRouter} />
      </div>
    );
  }

  renderMembersTabView() {
    return (
      <GroupUserTable groupID={this.props.itemID} />
    );
  }

  render() {
    let group = ACLGroupStore.getGroup(this.props.itemID);

    if (this.state.fetchedDetailsError) {
      return this.getErrorNotice();
    }

    if (group.get("gid") == null ||
        !MesosSummaryStore.get("statesProcessed")) {
      return this.getLoadingScreen();
    }

    return (
      <div className="flex-container-col">
        <div className="container container-fluid container-pod
          container-pod-divider-bottom container-pod-divider-bottom-align-right
          container-pod-divider-inverse container-pod-short-top
          side-panel-content-header side-panel-section flush-bottom">
          {this.getGroupInfo(group)}
          <ul className="tabs tall list-inline flush-bottom">
            {this.tabs_getUnroutedTabs()}
          </ul>
        </div>
        {this.tabs_getTabView(group)}
      </div>
    );
  }
}
