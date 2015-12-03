import _ from "underscore";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import {Table} from "reactjs-components";

import ACLUsersStore from "../../stores/ACLUsersStore";
import FilterHeadline from "../../components/FilterHeadline";
import FilterInputText from "../../components/FilterInputText";
import MesosSummaryStore from "../../stores/MesosSummaryStore";
import ResourceTableUtil from "../../utils/ResourceTableUtil";
import RequestErrorMsg from "../../components/RequestErrorMsg";
import SidePanels from "../../components/SidePanels";
import StoreMixin from "../../mixins/StoreMixin";
import TableUtil from "../../utils/TableUtil";
import UserFormModal from "../../components/UserFormModal";
import Util from "../../utils/Util";

const METHODS_TO_BIND = [
  "handleNewUserClick",
  "handleNewUserClose",
  "handleSearchStringChange",
  "onUsersSuccess",
  "onUsersError",
  "resetFilter"
];

export default class UsersTab extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: "marathon", events: ["success"]},
      {name: "users", events: ["success", "error"]}
    ];

    this.state = {
      hasError: false,
      openNewUserModal: false,
      searchString: ""
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidMount() {
    super.componentDidMount();
    ACLUsersStore.fetchUsers();
  }

  onUsersSuccess() {
    if (this.state.hasError) {
      this.setState({hasError: false});
    }
  }

  onUsersError() {
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

  getColGroup() {
    return (
      <colgroup>
        <col />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading({
      description: "Description"
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction("description");

    return [
      {
        className,
        headerClassName: className,
        prop: "description",
        render: this.renderHeadline,
        sortable: true,
        sortFunction: propSortFunction,
        heading
      }
    ];
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

  getVisibleUsers() {
    let searchString = this.state.searchString.toLowerCase();

    if (searchString !== "") {
      return _.filter(ACLUsersStore.get("users").getItems(), function (group) {
        let description = group.get("description").toLowerCase();
        return description.indexOf(searchString) > -1;
      });
    }

    return ACLUsersStore.get("users").getItems();
  }

  resetFilter() {
    this.setState({searchString: ""});
  }

  render() {
    if (this.state.hasError) {
      return (
        <RequestErrorMsg />
      );
    }

    if (!MesosSummaryStore.get("statesProcessed")) {
      return this.getLoadingScreen();
    }

    return (
      <div className="flex-container-col">
        <div className="users-table-header">
          <FilterHeadline
            onReset={this.resetFilter}
            name="Users"
            currentLength={this.getVisibleUsers().length}
            totalLength={ACLUsersStore.get("users").getItems().length} />
          <ul className="list list-unstyled list-inline flush-bottom">
            <li>
              <FilterInputText
                searchString={this.state.searchString}
                handleFilterChange={this.handleSearchStringChange}
                inverseStyle={true} />
            </li>
            <li className="button-collection list-item-aligned-right">
              <a
                className="button button-success"
                onClick={this.handleNewUserClick}>
                + New User
              </a>
            </li>
          </ul>
        </div>
        <div className="page-content-fill flex-grow flex-container-col">
          <Table
            className="table inverse table-borderless-outer
              table-borderless-inner-columns flush-bottom"
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
            data={this.getVisibleUsers()}
            idAttribute="uid"
            itemHeight={TableUtil.getRowHeight()}
            sortBy={{prop: "description", order: "asc"}}
            useFlex={true}
            transition={false}
            useScrollTable={false} />
        </div>
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
