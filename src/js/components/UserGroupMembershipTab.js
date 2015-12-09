import {Dropdown} from "reactjs-components";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLGroupStore from "../stores/ACLGroupStore";
import ACLGroupsStore from "../stores/ACLGroupsStore";
import RequestErrorMsg from "../components/RequestErrorMsg";
import StoreMixin from "../mixins/StoreMixin";
import UserGroupTable from "./UserGroupTable";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "onGroupSelection"
];

export default class UserGroupMembershipTab extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      pendingRequest: false,
      requestGroupsSuccess: false,
      requestGroupsError: false,
      userUpdateError: null
    };

    this.store_listeners = [
      {
        name: "group",
        events: [
          "deleteUserSuccess",
          "deleteUserError",
          "usersSuccess"
        ]
      },
      {
        name: "groups",
        events: [
          "success",
          "error"
        ]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLGroupsStore.fetchGroups();
  }

  onGroupSelection(group) {
    ACLGroupStore.addUser(group.id, this.props.userID);
  }

  onGroupsStoreError() {
    this.setState({
      requestGroupsError: true
    });
  }

  onGroupsStoreSuccess() {
    this.setState({
      requestGroupsSuccess: true,
      requestGroupsError: false
    });
  }

  getDropdownItems() {
    let groups = ACLGroupsStore.get("groups").getItems();

    let defaultItem = {
      description: "Add Group",
      gid: "default-placeholder-group-id"
    };
    let items = [defaultItem].concat(groups);

    return items.map(function (group) {
      let selectedHtml = group.description;

      return {
        id: group.gid,
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

  render() {
    if (this.state.requestGroupsError) {
      return <RequestErrorMsg />;
    }

    if (!this.state.requestGroupsSuccess) {
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
            onItemSelection={this.onGroupSelection}
            selectedID="default-placeholder-group-id"
            transition={true}
            wrapperClassName="dropdown" />
        </div>
        <div className="container container-fluid container-pod
          container-pod-short">
          <UserGroupTable userID={this.props.userID} />
        </div>
      </div>
    );
  }
}
