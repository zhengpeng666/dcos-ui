import _ from "underscore";
import classNames from "classnames";
import React from "react/addons";

import Maths from "../utils/Maths";
import ResourceTableUtil from "../utils/ResourceTableUtil";
import {Table} from "reactjs-components";
import TaskStates from "../constants/TaskStates";
import TaskTableHeaderLabels from "../constants/TaskTableHeaderLabels";
import Units from "../utils/Units";

const METHODS_TO_BIND = [
  "handleTaskClick",
  "renderHeadline"
];

export default class TaskTable extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  handleTaskClick(taskID) {
    let linkTo = this.getTaskPanelRoute();

    this.props.parentRouter.transitionTo(linkTo, {taskID});
  }

  getColumns() {
    return [
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "name",
        render: this.renderHeadline,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("name")
      },
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "updated",
        render: ResourceTableUtil.renderUpdated,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("name")
      },
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "state",
        render: this.renderState,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("name")
      },
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("name")
      },
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("name")
      }
    ];
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col />
        <col style={{width: "100px"}} />
        <col style={{width: "100px"}} />
        <col style={{width: "100px"}} />
      </colgroup>
    );
  }

  getTaskPanelRoute() {
    let currentRoutes = this.props.parentRouter.getCurrentRoutes();
    let currentPage = currentRoutes[currentRoutes.length - 2].name;

    return `${currentPage}-task-panel`;
  }

  renderHeadline(prop, task) {
    let dangerState = _.contains(TaskStates[task.state].stateTypes, "failure");

    let successState = _.contains(TaskStates[task.state].stateTypes, "success");

    let statusClass = classNames({
      "dot": true,
      success: successState,
      danger: dangerState
    });

    let title = task.name || task.id;

    return (
      <div className="flex-box flex-box-align-vertical-center">
        <div>
          <span className={statusClass}></span>
        </div>
        <div className="flex-box flex-box-col">
          <a
            className="emphasize clickable"
            onClick={this.handleTaskClick.bind(this, task.id)}>
            {title}
          </a>
        </div>
      </div>
    );
  }

  renderStats(prop, task) {
    let value = Maths.round(task.resources[prop], 2);

    if (prop !== "cpus") {
      value = Units.filesize(value / 1024, 1, null, null, ["GiB"]);
    }

    return (
      <span>
        {value}
      </span>
    );
  }

  renderState(prop, task) {
    return TaskStates[task[prop]].displayName;
  }

  render() {
    return (
      <Table
        className="table
          table-borderless-outer
          table-borderless-inner-columns
          flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        data={this.props.tasks.slice()}
        keys={["id"]}
        sortBy={{prop: "name", order: "desc"}} />
    );
  }
}

TaskTable.propTypes = {
  tasks: React.PropTypes.array.isRequired
};

TaskTable.defaultProps = {
  tasks: []
};

