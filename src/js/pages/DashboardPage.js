/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Link = require("react-router").Link;

var EventTypes = require("../constants/EventTypes");
var HealthSorting = require("../constants/HealthSorting");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var Page = require("../components/Page");
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
    failureRate: MesosStateStore.getTaskFailureRate(),
    healthProcessed: MesosStateStore.getHealthProcessed(),
    services: MesosStateStore.getLatest().frameworks,
    tasks: MesosStateStore.getTasks(),
    totalResources: MesosStateStore.getTotalResources()
  };
}

var DashboardPage = React.createClass({

  displayName: "DashboardPage",

  mixins: [InternalStorageMixin],

  getDefaultProps: function () {
    return {
      servicesListLength: 5
    };
  },

  componentWillMount: function () {
    this.internalStorage_set(getMesosState());
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
  },

  onMesosStateChange: function () {
    this.internalStorage_set(getMesosState());
    this.forceUpdate();
  },

  getServicesList: function (services) {
    var sortedServices = _.sortBy(services, function (service) {
      return HealthSorting[service.health.key];
    });

    return _.first(sortedServices, this.props.servicesListLength);
  },

  getViewAllServicesBtn: function () {
    var data = this.internalStorage_get();
    var servicesCount = data.services.length;
    if (!servicesCount) {
      return null;
    }

    var textContent = "View all ";
    if (servicesCount > this.props.servicesListLength) {
      textContent += servicesCount + " ";
    }
    textContent += "Services >";

    return (
      <Link to="services" className="button button-wide more-button">
        {textContent}
      </Link>
    );
  },

  render: function () {
    var data = this.internalStorage_get();

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Page title="Dashboard">
        <div className="grid row">
          <div className="grid-item column-small-6 column-large-4">
            <Panel title="CPU Allocation">
              <ResourceTimeSeriesChart
                allocResources={data.allocResources}
                totalResources={data.totalResources}
                mode="cpus" />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4">
            <Panel title="Memory Allocation">
              <ResourceTimeSeriesChart
                colorIndex={3}
                allocResources={data.allocResources}
                totalResources={data.totalResources}
                mode="mem" />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4">
            <Panel title="Task Failure Rate">
              <TaskFailureTimeSeriesChart
                data={data.failureRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4">
            <Panel title="Services Health">
              <ServiceList
                healthProcessed={data.healthProcessed}
                services={this.getServicesList(data.services)} />
              {this.getViewAllServicesBtn()}
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4">
            <Panel title="Tasks">
              <TasksChart tasks={data.tasks} />
            </Panel>
          </div>
        </div>
      </Page>
    );
  }

});

module.exports = DashboardPage;
