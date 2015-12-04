/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLUsersStore from "../../stores/ACLUsersStore";
import MesosSummaryStore from "../../stores/MesosSummaryStore";
import OrganizationTab from "./OrganizationTab";
import RequestErrorMsg from "../../components/RequestErrorMsg";
import SidePanels from "../../components/SidePanels";
import StoreMixin from "../../mixins/StoreMixin";
import UserFormModal from "../../components/UserFormModal";
import Util from "../../utils/Util";

const METHODS_TO_BIND = [
  "handleNewUserClick",
  "handleNewUserClose",
  "onUsersStoreSuccess",
  "onUsersStoreError"
];

export default class UsersTab extends Util.mixin(StoreMixin) {
  constructor() {
    super(arguments);

    this.store_listeners = [
      {name: "marathon", events: ["success"]},
      {name: "users", events: ["success", "error"]}
    ];

    this.state = {
      hasError: false,
      openNewUserModal: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLUsersStore.fetchUsers();
  }

  onUsersStoreSuccess() {
    if (this.state.hasError) {
      this.setState({hasError: false});
    }
  }

  onUsersStoreError() {
    this.setState({hasError: true});
  }

  handleNewUserClick() {
    this.setState({openNewUserModal: true});
  }

  handleNewUserClose() {
    this.setState({openNewUserModal: false});
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
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

    let items = ACLUsersStore.get("users").getItems();

    return (
      <OrganizationTab
        items={items}
        newItemTitle="+ New User"
        itemId="uid"
        itemName="users"
        newItemClicked={this.handleNewUserClick} />
    );
  }

  render() {
    return (
      <div>
        {this.getContents()}
        <SidePanels
          params={this.props.params}
          openedPage="settings-organization-users" />
        <UserFormModal
          open={this.state.openNewUserModal}
          onClose={this.handleNewUserClose}/>
      </div>
    );
  }
}
