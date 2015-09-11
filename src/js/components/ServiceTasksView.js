import _ from "underscore";
import React from "react/addons";

import EventTypes from "../constants/EventTypes";
import FilterByTaskState from "./FilterByTaskState";
import FilterInputText from "./FilterInputText";
import MesosStateStore from "../stores/MesosStateStore";
import RequestErrorMsg from "./RequestErrorMsg";
import ServiceTasksTable from "./ServiceTasksTable";
import StringUtil from "../utils/StringUtil";
import TaskStates from "../constants/TaskStates";

const METHODS_TO_BIND = [
  "handleSearchStringChange",
  "handleStatusFilterChange",
  "onMesosStateChange",
  "onMesosStateRequestError"
];

export default class ServiceTasksView extends React.Component {
  constructor() {
    super();

    this.state = {
      mesosStateErrorCount: 0,
      searchString: "",
      filterByStatus: "all"
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentWillMount() {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  }

  componentWillUnmount() {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  }

  onMesosStateChange() {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    let serviceName = this.props.serviceName;
    this.tasks = MesosStateStore.getTasksFromServiceName(serviceName);
    this.forceUpdate();
  }

  onMesosStateRequestError() {
    this.setState({mesosStateErrorCount: this.state.mesosStateErrorCount + 1});
  }

  filterByCurrentStatus(tasks) {
    let status = this.state.filterByStatus;
    if (status === "all") {
      return tasks;
    }

    let filterBy = TaskStates.completed;
    if (status === "active") {
      filterBy = TaskStates.active;
    }

    return _.filter(tasks, function (task) {
      return _.contains(filterBy, task.state);
    });
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  handleStatusFilterChange(filterByStatus) {
    this.setState({filterByStatus});
  }

  hasLoadingError() {
    return this.state.mesosStateErrorCount >= 3;
  }

  getStatusCounts(tasks) {
    return tasks.reduce(function (acc, task) {
      if (_.contains(TaskStates.active, task.state)) {
        acc.active += 1;
      }

      if (_.contains(TaskStates.completed, task.state)) {
        acc.completed += 1;
      }

      return acc;
    }, {active: 0, completed: 0});
  }

  getStatuses() {
    let statusCount = this.getStatusCounts(this.tasks);
    return [
      {
        count: statusCount.active,
        id: 1,
        name: "Active Tasks",
        value: "active"
      },
      {
        count: statusCount.completed,
        id: 2,
        name: "Completed Tasks",
        value: "completed"
      }
    ];
  }

  getLoadingScreen() {
    return (
      <div className="text-align-center vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getTasksTable(tasks) {
    return (
      <ServiceTasksTable tasks={tasks} />
    );
  }

  getHeaderText() {
    let currentStatus = this.state.filterByStatus;
    let tasksLength = this.tasks.length;
    if (currentStatus === "all") {
      return `${tasksLength} ${StringUtil.pluralize("Task", tasksLength)}`;
    }

    const displayNameMap = {
      active: "Active",
      completed: "Completed"
    };

    let statusCount = this.getStatusCounts(this.tasks)[currentStatus];
    let displayName = displayNameMap[currentStatus];
    let pluralizedTasks = StringUtil.pluralize("Task", statusCount);
    return `${statusCount} ${displayName} ${pluralizedTasks}`;
  }

  getContent() {
    if (this.tasks) {
      let state = this.state;
      let tasks = this.tasks;

      if (state.searchString !== "") {
        tasks = StringUtil.filterByString(
          tasks,
          "name",
          state.searchString
        );
      }

      tasks = this.filterByCurrentStatus(tasks);

      return (
        <div>
          <h2 className="inverse text-align-left">
            {this.getHeaderText()}
          </h2>
          <div className="flex-box control-group">
            <FilterInputText
              searchString={state.searchString}
              handleFilterChange={this.handleSearchStringChange} />
            <div>
              <FilterByTaskState
                statuses={this.getStatuses()}
                handleFilterChange={this.handleStatusFilterChange}
                totalTasksCount={this.tasks.length}
                currentStatus={state.filterByStatus}/>
            </div>
          </div>
          {this.getTasksTable(tasks)}
        </div>
      );
    } else {
      return this.getLoadingScreen();
    }
  }

  render() {
    let hasLoadingError = this.hasLoadingError();
    let errorMsg = null;

    if (hasLoadingError) {
      errorMsg = <RequestErrorMsg />;
    }

    return (
      <div>
        {this.getContent()}
        {errorMsg}
      </div>
    );
  }
}

ServiceTasksView.propTypes = {
  serviceName: React.PropTypes.string
};
