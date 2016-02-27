import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import ResourceTableUtil from '../utils/ResourceTableUtil';
import {Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';
import TaskStates from '../constants/TaskStates';
import TaskTableHeaderLabels from '../constants/TaskTableHeaderLabels';
import TaskUtil from '../utils/TaskUtil';
import Units from '../utils/Units';

const METHODS_TO_BIND = [
  'handleTaskClick',
  'renderHeadline'
];

class TaskTable extends React.Component {
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
    let propSortFunction = ResourceTableUtil.getPropSortFunction('name');
    let statSortFunction = ResourceTableUtil.getStatSortFunction(
      'name',
      function (task, resource) {
        return task.resources[resource];
      }
    );

    return [
      {
        className,
        dontCache: true,
        heading,
        headerClassName: className,
        prop: 'name',
        render: this.renderHeadline,
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        dontCache: true,
        heading,
        headerClassName: className,
        prop: 'updated',
        render: ResourceTableUtil.renderUpdated,
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: 'state',
        render: this.renderState,
        sortable: true,
        sortFunction: propSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: 'cpus',
        render: this.renderStats,
        sortable: true,
        sortFunction: statSortFunction
      },
      {
        className,
        heading,
        headerClassName: className,
        prop: 'mem',
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
        <col style={{width: '120px'}} />
        <col style={{width: '120px'}} />
        <col style={{width: '85px'}} />
        <col style={{width: '110px'}} />
      </colgroup>
    );
  }

  getTaskPanelRoute() {
    let currentRoutes = this.props.parentRouter.getCurrentRoutes();
    let currentPage = currentRoutes[currentRoutes.length - 2].name;

    return `${currentPage}-task-panel`;
  }

  renderHeadline(prop, task) {
    let dangerState = _.contains(TaskStates[task.state].stateTypes, 'failure');

    let successState = _.contains(TaskStates[task.state].stateTypes, 'success');

    let statusClass = classNames({
      'dot': true,
      success: successState,
      danger: dangerState
    });

    let title = task.name || task.id;

    return (
      <div className="flex-box flex-box-align-vertical-center
        table-cell-flex-box">
        <div className="table-cell-icon table-cell-task-dot
          task-status-indicator">
          <span className={statusClass}></span>
        </div>
        <div className="table-cell-value flex-box flex-box-col">
          <a
            className="emphasize clickable text-overflow"
            onClick={this.handleTaskClick.bind(this, task.id)}
            title={title}>
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
    let statusClassName = TaskUtil.getTaskStatusClassName(task);
    let statusIcon = TaskUtil.getTaskStatusIcon(task);
    let statusLabelClasses = `${statusClassName} table-cell-value`;

    return (
      <div className="flex-box flex-box-align-vertical-center
        table-cell-flex-box">
        <div className="table-cell-icon table-cell-icon-mini">
          {statusIcon}
        </div>
        <span className={statusLabelClasses}>
          {TaskStates[task[prop]].displayName}
        </span>
      </div>
    );
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
        containerSelector=".gm-scroll-view"
        data={this.props.tasks.slice()}
        itemHeight={TableUtil.getRowHeight()}
        sortBy={{prop: 'name', order: 'desc'}}
        useFlex={true}
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

module.exports = TaskTable;
