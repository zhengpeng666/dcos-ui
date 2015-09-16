import _ from "underscore";
import classNames from "classnames";
import React from "react/addons";

import DateUtil from "../utils/DateUtil";
import Maths from "../utils/Maths";
import ResourceTableUtil from "../utils/ResourceTableUtil";
import Table from "./Table";
import TaskStates from "../constants/TaskStates";
import TaskTableHeaderLabels from "../constants/TaskTableHeaderLabels";
import Units from "../utils/Units";

const METHODS_TO_BIND = [
  "handleTaskClick",
  "renderHeadline",
  "renderUpdated"
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

  getTaskUpdatedTimestamp(task) {
    let lastStatus = _.last(task.statuses);
    return lastStatus && lastStatus.timestamp || null;
  }

  getSortFunction(title) {
    return (prop) => {
      return (task) => {
        let value = task[prop];

        if (prop === "cpus" || prop === "mem") {
          return task.resources[prop];
        }

        if (prop === "updated") {
          let updatedAt = this.getTaskUpdatedTimestamp(task);

          if (updatedAt == null) {
            return 0;
          } else {
            return updatedAt;
          }
        }

        value = value.toString().toLowerCase();
        title = title.toLowerCase();
        return `${value}-${title}`;
      };
    };
  }

  getColumns() {
    return [
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "name",
        render: this.renderHeadline,
        sortable: true
      },
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "updated",
        render: this.renderUpdated,
        sortable: true
      },
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "state",
        render: this.renderState,
        sortable: true
      },
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true
      },
      {
        className: ResourceTableUtil.getClassName,
        header: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true
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

  renderUpdated(prop, task) {
    let updatedAt = this.getTaskUpdatedTimestamp(task);

    if (updatedAt == null) {
      updatedAt = "NA";
    } else {
      updatedAt = DateUtil.msToDateStr(updatedAt.toFixed(3) * 1000);
    }

    return (
      <span>
        {updatedAt}
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
        data={this.props.tasks.slice(0)}
        keys={["id"]}
        sortBy={{prop: "name", order: "desc"}}
        sortFunc={this.getSortFunction("name")} />
    );
  }
}

TaskTable.propTypes = {
  tasks: React.PropTypes.array.isRequired
};

TaskTable.defaultProps = {
  tasks: []
};

