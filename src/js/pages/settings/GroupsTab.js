import _ from "underscore";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import {Table} from "reactjs-components";

import ACLGroupsStore from "../../stores/ACLGroupsStore";
import FilterHeadline from "../../components/FilterHeadline";
import FilterInputText from "../../components/FilterInputText";
import MesosSummaryStore from "../../stores/MesosSummaryStore";
import ResourceTableUtil from "../../utils/ResourceTableUtil";
import RequestErrorMsg from "../../components/RequestErrorMsg";
import SidePanels from "../../components/SidePanels";
import StoreMixin from "../../mixins/StoreMixin";
import TableUtil from "../../utils/TableUtil";
import Util from "../../utils/Util";

const METHODS_TO_BIND = [
  "handleSearchStringChange",
  "onGroupsSuccess",
  "onGroupsError",
  "resetFilter"
];

export default class GroupsTab extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: "marathon", events: ["success"]},
      {name: "groups", events: ["success", "error"]}
    ];

    this.state = {hasError: false, searchString: ""};

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidMount() {
    super.componentDidMount();
    ACLGroupsStore.fetchGroups();
  }

  onGroupsSuccess() {
    if (this.state.hasError) {
      this.setState({hasError: false});
    }
  }

  onGroupsError() {
    this.setState({hasError: true});
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

  getContents() {
    if (!MesosSummaryStore.get("statesProcessed")) {
      return this.getLoadingScreen();
    }

    return (
      <div className="flex-container-col">
        {this.getTableHeader()}
        {this.getTable()}
      </div>
    );
  }

  getTable() {
    return (
      <div className="page-content-fill flex-grow flex-container-col">
        <Table
          className="table inverse table-borderless-outer
            table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.getVisibleGroups()}
          idAttribute="gid"
          itemHeight={TableUtil.getRowHeight()}
          sortBy={{prop: "description", order: "asc"}}
          useFlex={true}
          transition={false}
          useScrollTable={false} />
      </div>
    );
  }

  getTableHeader() {
    return (
      <div className="groups-table-header">
        <FilterHeadline
          onReset={this.resetFilter}
          name="Groups"
          currentLength={this.getVisibleGroups().length}
          totalLength={ACLGroupsStore.get("groups").getItems().length} />
        <FilterInputText
          searchString={this.state.searchString}
          handleFilterChange={this.handleSearchStringChange}
          inverseStyle={true} />
      </div>
    );
  }

  getVisibleGroups() {
    let searchString = this.state.searchString.toLowerCase();

    if (searchString !== "") {
      return _.filter(ACLGroupsStore.get("groups").getItems(), function (group) {
        let description = group.get("description").toLowerCase();
        return description.indexOf(searchString) > -1;
      });
    }

    return ACLGroupsStore.get("groups").getItems();
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

    return (
      <div>
        {this.getContents()}
        <SidePanels
          params={this.props.params}
          openedPage="settings-organization-groups" />
      </div>
    );
  }
}
