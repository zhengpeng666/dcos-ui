var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var ServiceTasksTable = require("./ServiceTasksTable");

var ServiceTasksView = React.createClass({

  displayName: "ServiceTasksView",

  propTypes: {
    serviceName: React.PropTypes.string.isRequired
  },

  tasks: null,

  componentWillMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
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

  render: function () {
    if (this.tasks) {
      return this.getTasksTable(this.tasks);
    } else {
      return this.getLoadingScreen();
    }
  }
});

module.exports = ServiceTasksView;
