var _ = require("underscore");
var React = require("react/addons");
import {Link} from "react-router";

import Config from "../config/Config";
var EventTypes = require("../constants/EventTypes");
var HealthSorting = require("../constants/HealthSorting");
var HostTimeSeriesChart = require("../components/charts/HostTimeSeriesChart");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MarathonStore = require("../stores/MarathonStore");
var MesosSummaryStore = require("../stores/MesosSummaryStore");
var Page = require("../components/Page");
var Panel = require("../components/Panel");
var ResourceTimeSeriesChart = require("../components/charts/ResourceTimeSeriesChart");
var TaskFailureTimeSeriesChart = require("../components/charts/TaskFailureTimeSeriesChart");
var ServiceList = require("../components/ServiceList");
var TasksChart = require("../components/charts/TasksChart");
var SidebarActions = require("../events/SidebarActions");
import SidePanels from "../components/SidePanels";

function getMesosState() {
  let states = MesosSummaryStore.get("states");
  let last = states.lastSuccessful();

  return {
    // Need clone, modifying in place will make update components check for
    // change in the same array, in stead of two different references
    taskFailureRate: _.clone(MesosSummaryStore.get("taskFailureRate")),
    hostsCount: states.getActiveNodesByState(),
    refreshRate: Config.getRefreshRate(),
    services: last.getServiceList(),
    usedResourcesStates: states.getResourceStatesForNodeIDs(),
    usedResources: last.getSlaveUsedResources(),
    totalResources: last.getSlaveTotalResources(),
    activeSlaves: last.getActiveSlaves(),
    statesProcessed: MesosSummaryStore.get("statesProcessed")
  };
}

var DashboardPage = React.createClass({

  displayName: "DashboardPage",

  mixins: [InternalStorageMixin],

  statics: {
    routeConfig: {
      label: "Dashboard",
      icon: "dashboard",
      matches: /^\/dashboard/
    },

    // Static life cycle method from react router, that will be called
    // "when a handler is about to render", i.e. on route change:
    // https://github.com/rackt/react-router/
    // blob/master/docs/api/components/RouteHandler.md
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      servicesListLength: 5
    };
  },

  componentWillMount: function () {
    this.internalStorage_set({
      openServicePanel: false,
      openTaskPanel: false
    });
    this.internalStorage_update(getMesosState());
  },

  componentDidMount: function () {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_REQUEST_ERROR,
      this.onMesosStateChange
    );
    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonStateChange
    );

    this.internalStorage_update({
      openServicePanel: this.props.params.serviceName != null,
      openTaskPanel: this.props.params.taskID != null
    });
  },

  componentWillReceiveProps: function (nextProps) {
    this.internalStorage_update({
      openServicePanel: nextProps.params.serviceName != null,
      openTaskPanel: nextProps.params.taskID != null
    });
  },

  componentWillUnmount: function () {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_REQUEST_ERROR,
      this.onMesosStateChange
    );
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonStateChange
    );
  },

  onMarathonStateChange: function () {
    this.forceUpdate();
  },

  onMesosStateChange: function () {
    this.internalStorage_update(getMesosState());
    this.forceUpdate();
  },

  getServicesList: function (services) {
    // Pick out only the data we need.
    let servicesMap = services.map(function (service) {
      return {
        name: service.get("name"),
        webui_url: service.get("webui_url"),
        TASK_RUNNING: service.get("TASK_RUNNING"),
        id: service.get("id")
      };
    });

    let sortedServices = _.sortBy(servicesMap, function (service) {
      let health = MarathonStore.getServiceHealth(service.name);
      if (health && health.key) {
        return HealthSorting[health.key];
      } else {
        return HealthSorting.NA;
      }
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
        className="button button-wide button-inverse more-button">
        {textContent}
      </Link>
    );
  },

  render: function () {
    let data = this.internalStorage_get();
    let appsProcessed = MarathonStore.hasProcessedApps();

    return (
      <Page title="Dashboard">
        <div className="grid row">
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="CPU Allocation" className="dashboard-panel">
              <ResourceTimeSeriesChart
                colorIndex={0}
                usedResourcesStates={data.usedResourcesStates}
                usedResources={data.usedResources}
                totalResources={data.totalResources}
                mode="cpus"
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Memory Allocation" className="dashboard-panel">
              <ResourceTimeSeriesChart
                colorIndex={6}
                usedResourcesStates={data.usedResourcesStates}
                usedResources={data.usedResources}
                totalResources={data.totalResources}
                mode="mem"
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Task Failure Rate" className="dashboard-panel">
              <TaskFailureTimeSeriesChart
                data={data.taskFailureRate}
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Services Health" className="dashboard-panel">
              <ServiceList
                healthProcessed={appsProcessed}
                services={this.getServicesList(data.services.getItems())} />
              {this.getViewAllServicesBtn()}
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Tasks" className="dashboard-panel">
              <TasksChart tasks={data.services.sumTaskStates()} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Nodes" className="dashboard-panel">
              <HostTimeSeriesChart
                data={data.hostsCount}
                currentValue={data.activeSlaves.length}
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
        </div>
        <SidePanels params={this.props.params} />
      </Page>
    );
  }
});

module.exports = DashboardPage;
