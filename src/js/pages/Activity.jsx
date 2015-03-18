/** @jsx React.DOM */

var _ = require ("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var Link = require("react-router").Link;
var MesosStateStore = require("../stores/MesosStateStore");
var Panel = require("../components/Panel");
var ResourceTimeSeriesChart =
  require("../components/charts/ResourceTimeSeriesChart");
var ServiceList = require("../components/ServiceList");
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

  getDefaultProps: function () {
    return {
      servicesListLength: 5
    };
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

  getServicesList: function () {
    return _.first(this.state.servicesHealth, this.props.servicesListLength);
  },

  getViewAllServicesBtn: function () {
    var serviceHealthCount = this.state.servicesHealth.length;
    if (!serviceHealthCount) {
      return;
    }

    var textContent = "View all ";
    if (serviceHealthCount > this.props.servicesListLength) {
      textContent += serviceHealthCount + " ";
    }
    textContent += "Services >";

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Link to="services" className="button button-wide more-button">
        {textContent}
      </Link>
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    );
  },

  render: function () {
    var state = this.state;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="grid">
        <div className="grid-item column-small-6 column-large-4">
          <Panel title="Services Health">
            <ServiceList servicesHealth={this.getServicesList()} />
            {this.getViewAllServicesBtn()}
          </Panel>
        </div>
        <div className="grid-item column-small-6 column-large-4">
          <Panel title="CPU Allocation">
            <ResourceTimeSeriesChart
              allocResources={state.allocResources}
              totalResources={state.totalResources}
              mode="cpus" />
          </Panel>
        </div>
        <div className="grid-item column-small-6 column-large-4">
          <Panel title="Memory Allocation">
            <ResourceTimeSeriesChart
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
