/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var ResourceChart = require("./ResourceChart");

function getMesosState() {
  return {
    frameworks: MesosStateStore.getFrameworks(),
    totalResources: MesosStateStore.getTotalResources(),
    usedResources: MesosStateStore.getUsedResources()
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
        <div className="column-small-4">
          <ResourceChart
            totalResources={state.totalResources}
            usedResources={state.usedResources}
            mode="cpus" />
        </div>
        <div className="column-small-4">
          <ResourceChart
            totalResources={state.totalResources}
            usedResources={state.usedResources}
            mode="mem" />
        </div>
        <div className="column-small-4">
          <ResourceChart
            totalResources={state.totalResources}
            usedResources={state.usedResources}
            mode="disk" />
        </div>
      </div>
    );
  }

});

module.exports = Activity;
