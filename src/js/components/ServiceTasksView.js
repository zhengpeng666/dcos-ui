var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var FilterByTaskState = require("./FilterByTaskState");
var FilterInputText = require("./FilterInputText");
var MesosStateStore = require("../stores/MesosStateStore");
var RequestErrorMsg = require("./RequestErrorMsg");
var ServiceTasksTable = require("./ServiceTasksTable");
var StringUtil = require("../utils/StringUtil");
var TaskHealthStates = require("../constants/TaskHealthStates");
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
      filterByStatus: "active",
      filterByTaskState: ""
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
    if (!status) {
      status = "active";
    }

    if (status === "active") {
      return _.filter(tasks, function (task) {
        return _.contains(TaskStates.active, task.state);
      });
    }

    return _.filter(tasks, function (task) {
      return _.contains(TaskStates.completed, task.state);
    });
  },

  handleSearchStringChange: function (searchString) {
    this.setState({searchString});
  },

  handleFilterStateChange: function (filterByStatus) {
    this.setState({filterByStatus});
  },

  handleTaskStateFilterChange: function (taskStateFilter) {
    this.setState({taskStateFilter});
  },

  handleToggleStatus: function () {
    if (this.state.filterByStatus === "active") {
      this.setState({filterByStatus: "completed"});
    } else {
      this.setState({filterByStatus: "active"});
    }
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

  getTaskStateCount: function (state) {
    return this.tasks.reduce(function (acc, task) {
      if (task.state === state) {
        return acc + 1;
      }

      return acc;
    }, 0);
  },

  getStates: function () {
    let allStates = TaskStates.allStates;
    return allStates.map(function (state, i) {
      return {
        id: i,
        name: TaskHealthStates[state],
        count: this.getTaskStateCount(state)
      };
    }, this);
    // return [{id: 1, name: "running", count: 5}, {id: 2, name: "failed", count: 4}];
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

  getContent: function () {
    if (this.tasks) {
      var state = this.state;
      var tasks = this.tasks;
      var statusCount = this.getStatusCounts(tasks);

      if (state.searchString !== "") {
        tasks = StringUtil.filterByString(
          tasks,
          "name",
          state.searchString
        );
      }

      if (state.taskStateFilter) {
        tasks = StringUtil.filterByString(
          tasks,
          "state",
          state.taskStateFilter
        );
      }

      tasks = this.filterByCurrentStatus(tasks);

      return (
        <div>
          <div
            className="h2 clickable inverse text-align-left"
            onClick={this.handleToggleStatus}>
            {`Showing ${statusCount[state.filterByStatus]} of ${this.tasks.length} ${state.filterByStatus} Tasks`}
            <span className="caret dropdown"></span>
          </div>
          <div className="flex-box">
            <div>
              <FilterByTaskState
                states={this.getStates()}
                handleFilterChange={this.handleTaskStateFilterChange}
                totalTasksCount={this.tasks.length}/>
            </div>
            <div className="flex-box flex-box-row-reverse side-panel-input-filter">
              <FilterInputText
                searchString={state.searchString}
                handleFilterChange={this.handleSearchStringChange}
                inverse={true} />
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
