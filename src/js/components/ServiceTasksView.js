var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var FilterInputText = require("./FilterInputText");
var MesosStateStore = require("../stores/MesosStateStore");
var RequestErrorMsg = require("./RequestErrorMsg");
var ServiceTasksTable = require("./ServiceTasksTable");
var StringUtil = require("../utils/StringUtil");

var ServiceTasksView = React.createClass({

  displayName: "ServiceTasksView",

  propTypes: {
    serviceName: React.PropTypes.string
  },

  tasks: null,

  getInitialState: function () {
    return {
      mesosStateErrorCount: 0,
      searchString: ""
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

  handleSearchStringChange: function (searchString) {
    this.setState({searchString});
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

      if (state.searchString !== "") {
        tasks = StringUtil.filterByString(
          tasks,
          "name",
          state.searchString
        );
      }

      return (
        <div>
          <h2 className="inverse">{this.tasks.length} Tasks</h2>
          <ul className="list list-unstyled list-inline flush-bottom">
            <li>
              <FilterInputText
                searchString={state.searchString}
                handleFilterChange={this.handleSearchStringChange}
                inverse={true}/>
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
