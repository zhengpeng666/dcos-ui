/** @jsx React.DOM */

var _ = require ("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var Link = require("react-router").Link;
var MesosStateStore = require("../stores/MesosStateStore");
var Panel = require("../components/Panel");
var ResourceTimeSeriesChart =
  require("../components/charts/ResourceTimeSeriesChart");
var TaskFailureTimeSeriesChart =
  require("../components/charts/TaskFailureTimeSeriesChart");
var ServiceList = require("../components/ServiceList");
var TasksChart = require("../components/charts/TasksChart");

function getMesosState() {
  return {
    allocResources: MesosStateStore.getAllocResources(),
    services: MesosStateStore.getLatest().frameworks,
    tasks: MesosStateStore.getTasks(),
    totalResources: MesosStateStore.getTotalResources(),
    failureRate: MesosStateStore.getTaskFailureRate()
  };
}

var SORT_ORDER = {
  UNHEALTHY: 0,
  HEALTHY: 1,
  IDLE: 2,
  NA: 3
};

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

  getServicesList: function (services) {
    var sortedServices = _.sortBy(services, function (service) {
      return SORT_ORDER[service.health.key];
    });

    return _.first(sortedServices, this.props.servicesListLength);
  },

  getViewAllServicesBtn: function () {
    var servicesCount = this.state.services.length;
    if (!servicesCount) {
      return;
    }

    var textContent = "View all ";
    if (servicesCount > this.props.servicesListLength) {
      textContent += servicesCount + " ";
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
      <div className="grid row">
        <div className="grid-item column-small-6 column-large-4">
          <Panel title="Services Health">
            <ServiceList services={this.getServicesList(this.state.services)} />
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
          <Panel title="Task Failure Rate">
            <TaskFailureTimeSeriesChart
              data={state.failureRate} />
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
