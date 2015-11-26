import _ from "underscore";
import React from "react";

import ACLGroupsStore from "../../stores/ACLGroupsStore";
import EventTypes from "../../constants/EventTypes";
import FilterHeadline from "../../components/FilterHeadline";
import FilterInputText from "../../components/FilterInputText";
import ResourceTableUtil from "../../utils/ResourceTableUtil";
import {Table} from "reactjs-components";
import TableUtil from "../../utils/TableUtil";

const METHODS_TO_BIND = [
  "getColGroup",
  "getColumns",
  "getLoadingScreen",
  "getTable",
  "getTableHeader",
  "getVisibleGroups",
  "handleGroupsChange",
  "handleSearchStringChange"
];

export default class GroupsTab extends React.Component {
  constructor() {
    super();

    this.state = {
      groups: [],
      searchString: ""
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidMount() {
    ACLGroupsStore.addChangeListener(
      EventTypes.ACL_GROUPS_CHANGE,
      this.handleGroupsChange
    );
    ACLGroupsStore.fetchGroups();
  }

  componentWillUnmount() {
    ACLGroupsStore.removeChangeListener(
      EventTypes.ACL_GROUPS_CHANGE,
      this.handleGroupsChange
    );
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

  getTable() {
    return (
      <div className="groups-table" style={{"flex-grow": "1"}}>
        <Table
          className="table inverse table-borderless-outer
            table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.getVisibleGroups()}
          idAttribute="gid"
          itemHeight={TableUtil.getRowHeight()}
          sortBy={{ prop: "description", order: "asc" }}
          transition={false} />
      </div>
    );
  }

  getTableHeader() {
    return (
      <div className="groups-table-header">
        <FilterHeadline
          onReset={this.resetFilter}
          name="Nodes"
          currentLength={this.getVisibleGroups().length}
          totalLength={this.state.groups.length} />
        <FilterInputText
          searchString={this.state.searchString}
          handleFilterChange={this.handleSearchStringChange}
          inverseStyle={true} />
      </div>
    );
  }

  getVisibleGroups() {
    let searchString = this.state.searchString.toLowerCase();

    if (searchString === "") {
      return this.state.groups;
    } else {
      return _.filter(this.state.groups, function (group) {
        let description = group.get("description").toLowerCase();
        return description.indexOf(searchString) > -1;
      });
    }
  }

  handleGroupsChange() {
    this.setState({
      groups: ACLGroupsStore.get("groups").getItems()
    });
  }

  handleSearchStringChange(searchString) {
    this.setState({
      searchString
    });
  }

  resetFilter() {
    console.log('reset');
  }

  render() {
    if (!this.state.groups.length) {
      return this.getLoadingScreen();
    }

    let tableHeader = this.getTableHeader();
    let table = this.getTable();

    return (
      <div className="flex-container-col">
        {tableHeader}
        {table}
      </div>
    );
  }
}
