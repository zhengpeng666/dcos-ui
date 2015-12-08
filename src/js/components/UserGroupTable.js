import {Confirm, Dropdown, Table} from "reactjs-components";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLGroupStore from "../stores/ACLGroupStore";
import ACLGroupsStore from "../stores/ACLGroupsStore";
import ACLUserStore from "../stores/ACLUserStore";
import RequestErrorMsg from "../components/RequestErrorMsg";
import ResourceTableUtil from "../utils/ResourceTableUtil";
import StoreMixin from "../mixins/StoreMixin";
import TableUtil from "../utils/TableUtil";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleOpenConfirm",
  "handleButtonConfirm",
  "handleButtonCancel",
  "onGroupSelection",
  "renderButton"
];

export default class UserGroupTable extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      groupID: null,
      openConfirm: false,
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

  handleOpenConfirm(group) {
    this.setState({
      groupID: group.gid,
      openConfirm: true,
      userUpdateError: null
    });
  }

  handleButtonConfirm() {
    ACLGroupStore.deleteUser(this.state.groupID, this.props.userID);
    this.setState({pendingRequest: true});
  }

  handleButtonCancel() {
    this.setState({groupID: null, openConfirm: false});
  }

  onGroupSelection(group) {
    ACLGroupStore.addUser(group.id, this.props.userID);
  }

  onGroupStoreDeleteUserError(groupID, userID, error) {
    this.setState({pendingRequest: false, userUpdateError: error});
  }

  onGroupStoreDeleteUserSuccess() {
    this.setState({groupID: null, openConfirm: false, pendingRequest: false});
  }

  onGroupsStoreError() {
    this.setState({
      requestGroupsError: false
    });
  }

  onGroupsStoreSuccess() {
    this.setState({
      requestGroupsSuccess: true,
      requestGroupsError: false
    });
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: "50%"}} />
        <col />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let descriptionHeading = ResourceTableUtil.renderHeading({
      description: "Group Name"
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction("description");

    return [
      {
        className,
        headerClassName: className,
        prop: "description",
        render: this.renderGroupLabel,
        sortable: true,
        sortFunction: propSortFunction,
        heading: descriptionHeading
      },
      {
        className,
        headerClassName: className,
        prop: "remove",
        render: this.renderButton,
        sortable: false,
        sortFunction: propSortFunction,
        heading: ""
      }
    ];
  }

  getConfirmModalContent(userDetails) {
    let state = this.state;
    let groupLabel = "this group";
    userDetails.groups.forEach(function (group) {
      if (group.group.gid === state.groupID) {
        groupLabel = group.group.description;
      }
    });

    let userName = userDetails.description;
    let error = null;

    if (state.userUpdateError != null) {
      error = (
        <p className="text-error-state">{state.userUpdateError}</p>
      );
    }

    return (
      <div className="container-pod text-align-center">
        <p>{`Are you sure you want to remove ${userName} from ${groupLabel}?`}</p>
        {error}
      </div>
    );
  }

  getDropdownItems(groups) {
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

  renderGroupLabel(prop, group) {
    return group[prop];
  }

  renderButton(prop, group) {
    return (
      <div className="text-align-right">
        <button className="button button-danger button-stroke button-small"
          onClick={this.handleOpenConfirm.bind(this, group)}>
          Remove
        </button>
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

    let allGroups = ACLGroupsStore.get("groups").getItems();
    let userDetails = ACLUserStore.getUser(this.props.userID);
    let userGroups = userDetails.groups.map(function (group) {
      return group.group;
    });

    return (
      <div className="whatever">
        <Confirm
          disabled={this.state.pendingRequest}
          footerClass="modal-footer container container-pod container-pod-fluid"
          open={this.state.openConfirm}
          onClose={this.handleButtonCancel}
          leftButtonCallback={this.handleButtonCancel}
          rightButtonCallback={this.handleButtonConfirm}>
          {this.getConfirmModalContent(userDetails)}
        </Confirm>
        <div className="container container-fluid container-pod
          container-pod-short flush-bottom">
          <Dropdown buttonClassName="button dropdown-toggle"
            dropdownMenuClassName="dropdown-menu"
            dropdownMenuListClassName="dropdown-menu-list"
            items={this.getDropdownItems(allGroups)}
            onItemSelection={this.onGroupSelection}
            selectedID="default-placeholder-group-id"
            transition={true}
            wrapperClassName="dropdown" />
        </div>
        <div className="container container-fluid container-pod
          container-pod-short">
          <Table
            className="table table-borderless-outer
              table-borderless-inner-columns flush-bottom no-overflow
              flush-bottom"
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
            data={userGroups}
            idAttribute="gid"
            itemHeight={TableUtil.getRowHeight()}
            sortBy={{prop: "description", order: "asc"}}
            useFlex={true}
            transition={false}
            useScrollTable={false} />
        </div>
      </div>
    );
  }
}
