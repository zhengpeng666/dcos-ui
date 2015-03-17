/** @jsx React.DOM */

var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var ServiceList = require("../components/ServiceList");
var MesosStateStore = require("../stores/MesosStateStore");
var Panel = require("../components/Panel");
var ResourceChart = require("../components/charts/ResourceChart");
var TasksChart = require("../components/charts/TasksChart");

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
      <div className="grid">
        <div className="grid-item column-small-6 column-large-4">
          <Panel title="Services Health">
            <ServiceList servicesHealth={state.servicesHealth} />
          </Panel>
        </div>
        <div className="grid-item column-small-6 column-large-4">
          <Panel title="CPU Allocation">
            <ResourceChart
              allocResources={state.allocResources}
              totalResources={state.totalResources}
              mode="cpus" />
          </Panel>
        </div>
        <div className="grid-item column-small-6 column-large-4">
          <Panel title="Memory Allocation">
            <ResourceChart
              allocResources={state.allocResources}
              totalResources={state.totalResources}
              mode="mem" />
          </Panel>
        </div>
        <div className="grid-item column-small-6 column-large-4">
          <Panel title="Tasks">
            <TasksChart tasks={state.tasks} />
          </Panel>
        </div>
      </div>
    );
  }

});

module.exports = Activity;
