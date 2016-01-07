import mixin from "reactjs-mixin";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import {StoreMixin} from "mesosphere-shared-reactjs";

import ACLUsersStore from "../../stores/ACLUsersStore";
import MesosSummaryStore from "../../stores/MesosSummaryStore";
import OrganizationTab from "./OrganizationTab";
import RequestErrorMsg from "../../components/RequestErrorMsg";
import UserFormModal from "../../components/UserFormModal";
import UserSidePanel from "../../components/UserSidePanel";

const EXTERNAL_CHANGE_EVENTS = [
  "onUserStoreCreateSuccess",
  "onUserStoreDeleteSuccess",
  "onUserStoreUpdateSuccess"
];

const METHODS_TO_BIND = [
  "handleNewUserClick",
  "handleNewUserClose",
  "onUsersStoreSuccess",
  "onUsersStoreError"
];

export default class UsersTab extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {name: "marathon", events: ["success"]},
      {name: "user", events: ["createSuccess", "deleteSuccess", "updateSuccess"]},
      {name: "users", events: ["success", "error"]}
    ];

    this.state = {
      openNewUserModal: false,
      usersStoreError: false,
      usersStoreSuccess: false
    };

    EXTERNAL_CHANGE_EVENTS.forEach((event) => {
      this[event] = this.onUsersChange;
    });

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLUsersStore.fetchUsers();
  }

  onUsersChange() {
    ACLUsersStore.fetchUsers();
  }

  onUsersStoreSuccess() {
    this.setState({
      usersStoreError: false,
      usersStoreSuccess: true
    });
  }

  onUsersStoreError() {
    this.setState({
      usersStoreError: true,
      usersStoreSuccess: false
    });
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
    // so only this part is showing loading and error screen.
    if (this.state.usersStoreError) {
      return (
        <RequestErrorMsg />
      );
    }

    if (!MesosSummaryStore.get("statesProcessed") ||
      !this.state.usersStoreSuccess) {
      return this.getLoadingScreen();
    }

    let items = ACLUsersStore.get("users").getItems();

    return (
      <OrganizationTab
        items={items}
        itemID="uid"
        itemName="user"
        handleNewItemClick={this.handleNewUserClick} />
    );
  }

  render() {
    return (
      <div>
        {this.getContents()}
        <UserSidePanel
          params={this.props.params}
          openedPage="settings-organization-users" />
        <UserFormModal
          open={this.state.openNewUserModal}
          onClose={this.handleNewUserClose}/>
      </div>
    );
  }
}

UsersTab.propTypes = {
  params: React.PropTypes.object
};
