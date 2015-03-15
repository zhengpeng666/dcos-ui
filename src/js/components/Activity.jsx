/** @jsx React.DOM */

var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var ServiceList = require("./ServiceList");
var MesosStateStore = require("../stores/MesosStateStore");
var Panel = require("./Panel");
var ResourceChart = require("./charts/ResourceChart");
var TasksChart = require("./charts/TasksChart");

function getMesosState() {
  return {
    tasks: MesosStateStore.getTasks(),
    totalResources: MesosStateStore.getTotalResources(),
    allocResources: MesosStateStore.getAllocResources(),
    servicesHealth: MesosStateStore.getFrameworkHealth()
  };
}

var Activity = React.createClass({

  displayName: "Activity",

  getInitialState: function () {
    return getMesosState();
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onChange
    );
    this.onChange();
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onChange
    );
  },

  onChange: function () {
    this.setState(getMesosState());
  },

  render: function () {
    var state = this.state;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="row">
        <div className="column-small-6 column-large-4">
          <Panel title="Services Health" className="services-panel">
            <ServiceList servicesHealth={state.servicesHealth} />
          </Panel>
        </div>
        <div className="column-small-6 column-large-4">
          <Panel title="CPU Allocation" className="services-panel">
            <ResourceChart
              allocResources={state.allocResources}
              totalResources={state.totalResources}
              mode="cpus" />
          </Panel>
        </div>
        <div className="column-small-6 column-large-4">
          <Panel title="Memory Allocation" className="services-panel">
            <ResourceChart
              allocResources={state.allocResources}
              totalResources={state.totalResources}
              mode="mem" />
          </Panel>
        </div>
        <div className="column-small-6 column-large-4">
          <Panel title="Tasks" className="services-panel">
            <TasksChart tasks={state.tasks} />
          </Panel>
        </div>
      </div>
    );
  }

});

module.exports = Activity;
