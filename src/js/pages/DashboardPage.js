var _ = require("underscore");
var React = require("react/addons");
var Link = require("react-router").Link;

var EventTypes = require("../constants/EventTypes");
var HealthSorting = require("../constants/HealthSorting");
var HostTimeSeriesChart = require("../components/charts/HostTimeSeriesChart");
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
var SidebarActions = require("../events/SidebarActions");
var ServiceOverlay = require("../components/ServiceOverlay");

function getMesosState() {
  return {
    allocResources: MesosStateStore.getAllocResources(),
    appsProcessed: MesosStateStore.isAppsProcessed(),
    // Need clone, modifying in place will make update components check for
    // change in the same array, in stead of two different references
    failureRate: _.clone(MesosStateStore.getTaskFailureRate()),
    hostsCount: MesosStateStore.getActiveHostsCount(),
    refreshRate: MesosStateStore.getRefreshRate(),
    services: MesosStateStore.getLatest().frameworks,
    tasks: MesosStateStore.getTaskTotals(),
    totalResources: MesosStateStore.getTotalResources()
  };
}

var DashboardPage = React.createClass({

  displayName: "DashboardPage",

  mixins: [InternalStorageMixin],

  statics: {
    // Static life cycle method from react router, that will be called
    // "when a handler is about to render", i.e. on route change:
    // https://github.com/rackt/react-router/
    // blob/master/docs/api/components/RouteHandler.md
    willTransitionTo: function () {

      SidebarActions.close();
    }
  },

  getDefaultProps: function () {
    return {
      servicesListLength: 5
    };
  },

  getInitialState: function () {
    return {
      openedService: false
    };
  },

  componentWillMount: function () {
    this.internalStorage_set(getMesosState());
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
  },

  openService: function (service) {
    this.setState({
      openedService: service
    });
  },

  onServiceClose: function () {
    if (this.isMounted()) {
      this.setState({
        openedService: null
      });
    }
  },

  onMesosStateChange: function () {
    this.internalStorage_set(getMesosState());
    this.forceUpdate();
  },

  getServicesList: function (_services) {
    // Pick out only the data we need.
    var services = _.map(_services, function (service) {
      return _.pick(service, "name", "health", "webui_url");
    });

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
      <Link to="services"
          className="button button-small button-wide button-inverse more-button">
        {textContent}
      </Link>
    );
  },

  render: function () {
    var data = this.internalStorage_get();
    var state = this.state;

    return (
      <Page title="Dashboard">
        <div className="grid row">
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="CPU Allocation" className="dashboard-panel">
              <ResourceTimeSeriesChart
                allocResources={data.allocResources}
                totalResources={data.totalResources}
                mode="cpus"
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Memory Allocation" className="dashboard-panel">
              <ResourceTimeSeriesChart
                colorIndex={3}
                allocResources={data.allocResources}
                totalResources={data.totalResources}
                mode="mem"
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Task Failure Rate" className="dashboard-panel">
              <TaskFailureTimeSeriesChart
                data={data.failureRate}
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Services Health" className="dashboard-panel">
              <ServiceList
                healthProcessed={data.appsProcessed}
                services={this.getServicesList(data.services)}
                onOpen={this.openService} />
              {this.getViewAllServicesBtn()}
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Tasks" className="dashboard-panel">
              <TasksChart tasks={data.tasks} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Nodes" className="dashboard-panel">
              <HostTimeSeriesChart
                data={data.hostsCount}
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
        </div>

        <ServiceOverlay
          service={state.openedService}
          shouldOpen={!!state.openedService}
          onServiceClose={this.onServiceClose}/>
      </Page>
    );
  }

});

module.exports = DashboardPage;
