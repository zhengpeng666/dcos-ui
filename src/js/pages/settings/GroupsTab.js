/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLGroupsStore from "../../stores/ACLGroupsStore";
import GroupFormModal from "../../components/GroupFormModal";
import GroupSidePanel from "../../components/GroupSidePanel";
import MesosSummaryStore from "../../stores/MesosSummaryStore";
import OrganizationTab from "./OrganizationTab";
import RequestErrorMsg from "../../components/RequestErrorMsg";
import StoreMixin from "../../mixins/StoreMixin";
import Util from "../../utils/Util";

const METHODS_TO_BIND = [
  "handleNewGroupClick",
  "handleNewGroupClose",
  "onGroupsStoreSuccess",
  "onGroupsStoreError"
];

export default class GroupsTab extends Util.mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {name: "marathon", events: ["success"]},
      {name: "groups", events: ["success", "error"]}
    ];

    this.state = {
      hasError: false,
      openNewGroupModal: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLGroupsStore.fetchGroups();
  }

  onGroupsStoreSuccess() {
    if (this.state.hasError) {
      this.setState({hasError: false});
    }
  }

  onGroupsStoreError() {
    this.setState({hasError: true});
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
    if (this.state.hasError) {
      return (
        <RequestErrorMsg />
      );
    }

    if (!MesosSummaryStore.get("statesProcessed")) {
      return this.getLoadingScreen();
    }

    let items = ACLGroupsStore.get("groups").getItems();

    return (
      <OrganizationTab
        items={items}
        newItemTitle="+ New Group"
        itemId="gid"
        itemName="groups"
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
