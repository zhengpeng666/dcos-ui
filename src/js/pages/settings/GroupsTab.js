import mixin from "reactjs-mixin";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import {StoreMixin} from "mesosphere-shared-reactjs";

import ACLGroupsStore from "../../stores/ACLGroupsStore";
import GroupFormModal from "../../components/GroupFormModal";
import GroupSidePanel from "../../components/GroupSidePanel";
import MesosSummaryStore from "../../stores/MesosSummaryStore";
import OrganizationTab from "./OrganizationTab";
import RequestErrorMsg from "../../components/RequestErrorMsg";

const EXTERNAL_CHANGE_EVENTS = [
  "onGroupStoreCreateSuccess",
  "onGroupStoreDeleteSuccess",
  "onGroupStoreUpdateSuccess"
];

const METHODS_TO_BIND = [
  "handleNewGroupClick",
  "handleNewGroupClose",
  "onGroupsStoreSuccess",
  "onGroupsStoreError"
];

export default class GroupsTab extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {name: "marathon", events: ["success"]},
      {name: "groups", events: ["success", "error"]},
      {name: "group", events: ["createSuccess", "deleteSuccess", "updateSuccess"]}
    ];

    this.state = {
      groupsStoreError: false,
      groupsStoreSuccess: false,
      openNewGroupModal: false
    };

    EXTERNAL_CHANGE_EVENTS.forEach((event) => {
      this[event] = this.onGroupsChange;
    });

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLGroupsStore.fetchGroups();
  }

  onGroupsChange() {
    ACLGroupsStore.fetchGroups();
  }

  onGroupsStoreSuccess() {
    this.setState({
      groupsStoreError: false,
      groupsStoreSuccess: true
    });
  }

  onGroupsStoreError() {
    this.setState({
      groupsStoreError: true,
      groupsStoreSuccess: false
    });
  }

  handleNewGroupClick() {
    this.setState({openNewGroupModal: true});
  }

  handleNewGroupClose() {
    this.setState({openNewGroupModal: false});
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

  getContents() {
    // We want to always render the portals (side panel and modal),
    // so only this part is showing loading and error screend
    if (this.state.groupsStoreError) {
      return (
        <RequestErrorMsg />
      );
    }

    if (!MesosSummaryStore.get("statesProcessed") ||
      !this.state.groupsStoreSuccess) {
      return this.getLoadingScreen();
    }

    let items = ACLGroupsStore.get("groups").getItems();

    return (
      <OrganizationTab
        items={items}
        itemID="gid"
        itemName="group"
        handleNewItemClick={this.handleNewGroupClick} />
    );
  }

  render() {

    return (
      <div>
        {this.getContents()}
        <GroupSidePanel
          params={this.props.params}
          openedPage="settings-organization-groups" />
        <GroupFormModal
          open={this.state.openNewGroupModal}
          onClose={this.handleNewGroupClose}/>
      </div>
    );
  }
}

GroupsTab.propTypes = {
  params: React.PropTypes.object
};
