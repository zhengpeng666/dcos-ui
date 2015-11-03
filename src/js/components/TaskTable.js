import _ from "underscore";
import classNames from "classnames";
import React from "react/addons";

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
    var className = ResourceTableUtil.getClassName;
    var heading = ResourceTableUtil.renderHeading(TaskTableHeaderLabels);
    let propSortFunction = ResourceTableUtil.getPropSortFunction("name");
    let statSortFunction = ResourceTableUtil.getStatSortFunction(
      "name",
      function (task, resource) {
        return task.resources[resource];
      }
    );

    return [
      {
        className,
        heading,
        headerClassName: className,
        prop: "name",
        render: this.renderHeadline,
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: "updated",
        render: ResourceTableUtil.renderUpdated,
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: "state",
        render: this.renderState,
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        sortFunction: statSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        sortFunction: statSortFunction
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
        <col style={{width: "115px"}} />
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
    return (
      <span>
        {Units.formatResource(prop, task.resources[prop])}
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
        idAttribute={"id"}
        sortBy={{prop: "name", order: "desc"}}
        transition={false} />
    );
  }
}

TaskTable.propTypes = {
  tasks: React.PropTypes.array.isRequired
};

TaskTable.defaultProps = {
  tasks: []
};
