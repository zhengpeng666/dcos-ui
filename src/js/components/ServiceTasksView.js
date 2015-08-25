var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var RequestErrorMsg = require("./RequestErrorMsg");
var ServiceTasksTable = require("./ServiceTasksTable");

var ServiceTasksView = React.createClass({

  displayName: "ServiceTasksView",

  propTypes: {
    serviceName: React.PropTypes.string.isRequired
  },

  tasks: null,

  getInitialState: function () {
    return {
      mesosStateErrorCount: 0
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
      return this.getTasksTable(this.tasks);
    } else {
      return this.getLoadingScreen();
    }
  },

  render: function () {
    var hasLoadingError = this.hasLoadingError();
    var errorMsg = null;

    if (hasLoadingError) {
      errorMsg = <RequestErrorMsg />
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
