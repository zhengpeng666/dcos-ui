var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var FilterByTaskState = require("./FilterByTaskState");
var FilterInputText = require("./FilterInputText");
var MesosStateStore = require("../stores/MesosStateStore");
var RequestErrorMsg = require("./RequestErrorMsg");
var ServiceTasksTable = require("./ServiceTasksTable");
var StringUtil = require("../utils/StringUtil");
var TaskStates = require("../constants/TaskStates");

var ServiceTasksView = React.createClass({

  displayName: "ServiceTasksView",

  propTypes: {
    serviceName: React.PropTypes.string
  },

  tasks: null,

  getInitialState: function () {
    return {
      mesosStateErrorCount: 0,
      searchString: "",
      filterByStatus: "all"
    };
  },

  componentWillMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  },

  onMesosStateChange: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    var serviceName = this.props.serviceName;
    this.tasks = MesosStateStore.getTasksFromServiceName(serviceName);
    this.forceUpdate();
  },

  onMesosStateRequestError: function () {
    this.setState({mesosStateErrorCount: this.state.mesosStateErrorCount + 1});
  },

  filterByCurrentStatus: function (tasks) {
    var status = this.state.filterByStatus;
    if (status === "all") {
      return tasks;
    }

    var filterBy = TaskStates.completed;
    if (status === "active") {
      filterBy = TaskStates.active;
    }

    return _.filter(tasks, function (task) {
      return _.contains(filterBy, task.state);
    });
  },

  handleSearchStringChange: function (searchString) {
    this.setState({searchString});
  },

  handleStatusFilterChange: function (filterByStatus) {
    this.setState({filterByStatus});
  },

  hasLoadingError: function () {
    return this.state.mesosStateErrorCount >= 3;
  },

  getStatusCounts: function (tasks) {
    return tasks.reduce(function (acc, task) {
      if (_.contains(TaskStates.active, task.state)) {
        acc.active += 1;
      }

      if (_.contains(TaskStates.completed, task.state)) {
        acc.completed += 1;
      }

      return acc;
    }, {active: 0, completed: 0});
  },

  getStatuses: function () {
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
  },

  getLoadingScreen: function () {
    return (
      <div className="text-align-center vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  },

  getTasksTable: function (tasks) {
    return (
      <ServiceTasksTable tasks={tasks} />
    );
  },

  getHeaderText: function () {
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
  },

  getContent: function () {
    if (this.tasks) {
      var state = this.state;
      var tasks = this.tasks;

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
              handleFilterChange={this.handleSearchStringChange}
              inverse={true} />
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
  },

  render: function () {
    var hasLoadingError = this.hasLoadingError();
    var errorMsg = null;

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
});

module.exports = ServiceTasksView;
