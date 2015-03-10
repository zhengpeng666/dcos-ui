/** @jsx React.DOM */

var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var ResourceChart = require("./charts/ResourceChart");
var TasksChart = require("./charts/TasksChart");

function getMesosState() {
  return {
    tasks: MesosStateStore.getTasks(),
    totalResources: MesosStateStore.getTotalResources(),
    allocResources: MesosStateStore.getAllocResources()
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
          <ResourceChart
            allocResources={state.allocResources}
            totalResources={state.totalResources}
            mode="cpus" />
        </div>
        <div className="column-small-6 column-large-4">
          <ResourceChart
            allocResources={state.allocResources}
            totalResources={state.totalResources}
            mode="mem" />
        </div>
        <div className="column-small-6 column-large-4">
          <TasksChart tasks={state.tasks} />
        </div>
      </div>
    );
  }

});

module.exports = Activity;
