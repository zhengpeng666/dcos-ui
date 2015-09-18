import _ from "underscore";
import classNames from "classnames";
import React from "react/addons";

import DateUtil from "../utils/DateUtil";
import Maths from "../utils/Maths";
import ResourceTableUtil from "../utils/ResourceTableUtil";
import {Table} from "reactjs-components";
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
      return (a, b) => {
        let aValue = a[prop];
        let bValue = b[prop];

        if (prop === "cpus" || prop === "mem") {
          aValue = a.resources[prop];
          bValue = b.resources[prop];
          let tied = ResourceTableUtil.tieBreaker(a, b, title, aValue, bValue);

          if (typeof tied === "number") {
            return tied;
          }

          return aValue - bValue;
        }

        if (prop === "updated") {
          let aUpdatedAt = this.getTaskUpdatedTimestamp(a) || 0;
          let bUpdatedAt = this.getTaskUpdatedTimestamp(b) || 0;

          return aUpdatedAt - bUpdatedAt;
        }

        aValue = `${aValue.toString().toLowerCase()}-${a[title].toLowerCase()}`;
        bValue = `${bValue.toString().toLowerCase()}-${b[title].toLowerCase()}`;

        if (aValue > bValue) {
          return 1;
        } else if (aValue === bValue) {
          return 0;
        } else {
          return -1;
        }
      };
    };
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
        sortFunction: this.getSortFunction("name")
      },
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "updated",
        render: this.renderUpdated,
        sortable: true,
        sortFunction: this.getSortFunction("name")
      },
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "state",
        render: this.renderState,
        sortable: true,
        sortFunction: this.getSortFunction("name")
      },
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        sortFunction: this.getSortFunction("name")
      },
      {
        className: ResourceTableUtil.getClassName,
        heading: ResourceTableUtil.renderHeader(TaskTableHeaderLabels),
        headerClassName: ResourceTableUtil.getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        sortFunction: this.getSortFunction("name")
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

