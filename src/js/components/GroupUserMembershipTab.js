import {Dropdown} from "reactjs-components";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLGroupStore from "../stores/ACLGroupStore";
import ACLUsersStore from "../stores/ACLUsersStore";
import GroupUserTable from "./GroupUserTable";
import RequestErrorMsg from "../components/RequestErrorMsg";
import StoreMixin from "../mixins/StoreMixin";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "onUserSelection"
];

export default class GroupUserMembershipTable extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      userID: null,
      openConfirm: false,
      pendingRequest: false,
      requestUsersError: false,
      requestUsersSuccess: false,
      groupUpdateError: null
    };

    this.store_listeners = [
      {
        name: "users",
        events: ["error", "success"]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLUsersStore.fetchUsers();
  }

  onUserSelection(user) {
    ACLGroupStore.addUser(this.props.groupID, user.id);
  }

  onUsersStoreError() {
    this.setState({
      requestUsersSuccess: false,
      requestUsersError: true
    });
  }

  onUsersStoreSuccess() {
    this.setState({
      requestUsersSuccess: true,
      requestUsersError: false
    });
  }

  getDropdownItems() {
    let users = ACLUsersStore.get("users").getItems().sort(
      Util.getLocaleCompareSortFn("description")
    );

    let defaultItem = {
      description: "Add User",
      uid: "default-placeholder-user-id"
    };
    let items = [defaultItem].concat(users);

    return items.map(function (user) {
      let selectedHtml = user.description;

      return {
        id: user.uid,
        name: selectedHtml,
        html: selectedHtml,
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

  renderUserLabel(prop, user) {
    return user[prop];
  }

  renderButton(prop, user) {
    return (
      <div className="text-align-right">
        <button className="button button-danger button-stroke button-small"
          onClick={this.handleOpenConfirm.bind(this, user)}>
          Remove
        </button>
      </div>
    );
  }

  render() {
    if (this.state.requestUsersError) {
      return (
        <div className="container container-fluid container-pod flush-bottom">
          <RequestErrorMsg />
        </div>
      );
    }

    if (!this.state.requestUsersSuccess) {
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
            onItemSelection={this.onUserSelection}
            selectedID="default-placeholder-user-id"
            transition={true}
            wrapperClassName="dropdown" />
        </div>
        <div className="container container-fluid container-pod
          container-pod-short">
          <GroupUserTable groupID={this.props.groupID} />
        </div>
      </div>
    );
  }
}
