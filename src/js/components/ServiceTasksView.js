var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var FilterInputText = require("./FilterInputText");
var FilterState = require("./FilterState");
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
      filterByState: "active"
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

  filterByCurrentStatus: function (tasks) {
    var status = this.state.filterByState;
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

  handleFilterStateChange: function (filterByState) {
    this.setState({filterByState});
  },

  hasLoadingError: function () {
    return this.state.mesosStateErrorCount >= 3;
  },

  getLoadingScreen: function () {
    return (
      <div className="text-align-center vertical-center">
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

      tasks = this.filterByCurrentStatus(tasks);

      return (
        <div>
          <h2 className="inverse">{this.tasks.length} Tasks</h2>
          <ul className="list list-unstyled list-inline flush-bottom">
            <li>
              <FilterState
                handleFilterChange={this.handleFilterStateChange}
                currentFilterState={state.filterByState}
                statusCounts={statusCount} />
            </li>
            <li>
              <FilterInputText
                searchString={state.searchString}
                handleFilterChange={this.handleSearchStringChange}
                inverse={true} />
            </li>
          </ul>
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
