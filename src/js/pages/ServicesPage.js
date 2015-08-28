var _ = require("underscore");
var classNames = require("classnames");
var React = require("react/addons");

var AlertPanel = require("../components/AlertPanel");
var EventTypes = require("../constants/EventTypes");
var FilterHealth = require("../components/FilterHealth");
var FilterHeadline = require("../components/FilterHeadline");
var FilterInputText = require("../components/FilterInputText");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var Page = require("../components/Page");
var MarathonStore = require("../stores/MarathonStore");
var MesosSummaryStore = require("../stores/MesosSummaryStore");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var ServiceTable = require("../components/ServiceTable");
var SidebarActions = require("../events/SidebarActions");
var RouteHandler = require("react-router").RouteHandler;

function getCountByHealth(frameworks) {
  return _.foldl(frameworks, function (acc, framework) {
    let appHealth = MarathonStore.getServiceHealth(framework.name);
    if (acc[appHealth.value] === undefined) {
      acc[appHealth.value] = 1;
    } else {
      acc[appHealth.value]++;
    }
    return acc;
  }, {});
}

function getMesosServices(state) {
  var filters = _.pick(state, "searchString", "healthFilter");
  var frameworks = MesosSummaryStore.getFrameworks(filters);
  var allFrameworks = MesosSummaryStore.getLatest().frameworks;

  return {
    frameworks: frameworks,
    statesProcessed: MesosSummaryStore.get("statesProcessed"),
    countByHealth: getCountByHealth(allFrameworks),
    refreshRate: MesosSummaryStore.getRefreshRate(),
    totalFrameworks: allFrameworks.length,
    totalFrameworksResources:
      MesosSummaryStore.getTotalFrameworksResources(frameworks),
    totalResources: MesosSummaryStore.getTotalResources()
  };
}

var DEFAULT_FILTER_OPTIONS = {
  searchString: "",
  healthFilter: null
};

var ServicesPage = React.createClass({

  displayName: "ServicesPage",

  mixins: [InternalStorageMixin],

  statics: {
    routeConfig: {
      label: "Services",
      icon: "services",
      matches: /^\/services/
    },

    // Static life cycle method from react router, that will be called
    // "when a handler is about to render", i.e. on route change:
    // https://github.com/rackt/react-router/
    // blob/master/docs/api/components/RouteHandler.md
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  getInitialState: function () {
    return _.extend({selectedResource: "cpus"}, DEFAULT_FILTER_OPTIONS);
  },

  componentWillMount: function () {
    this.internalStorage_set(getMesosServices(this.state));
  },

  componentDidMount: function () {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
  },

  componentWillUnmount: function () {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
  },

  onMesosStateChange: function () {
    this.internalStorage_set(getMesosServices(this.state));
    this.forceUpdate();
  },

  handleHealthFilterChange: function (healthFilter) {
    var stateChanges = _.clone(DEFAULT_FILTER_OPTIONS);
    stateChanges.healthFilter = healthFilter;

    this.internalStorage_set(getMesosServices(stateChanges));
    this.setState(stateChanges);
  },

  onResourceSelectionChange: function (selectedResource) {
    if (this.state.selectedResource !== selectedResource) {
      this.setState({selectedResource: selectedResource});
    }
  },

  handleSearchStringChange: function (searchString) {
    var data = getMesosServices({
      searchString: searchString,
      healthFilter: this.state.healthFilter
    });

    this.internalStorage_set(data);
    this.setState({searchString: searchString});
  },

  resetFilter: function () {
    var state = _.clone(DEFAULT_FILTER_OPTIONS);
    this.internalStorage_set(getMesosServices(state));
    this.setState(state);
  },

  getServiceStats: function () {
    var data = this.internalStorage_get();
    var filteredLength = data.frameworks.length;
    var totalLength = data.totalFrameworks;

    var filteredClassSet = classNames({
      "hidden": filteredLength === totalLength
    });

    var unfilteredClassSet = classNames({
      "hidden": filteredLength !== totalLength
    });

    return (
      <div>
        <h4 className={filteredClassSet}>
          Showing {filteredLength} of {totalLength} Services
        </h4>
        <h4 className={unfilteredClassSet}>
          {totalLength} Services
        </h4>
      </div>
    );
  },

  getServicesPageContent: function () {
    var state = this.state;
    var data = this.internalStorage_get();
    let appsProcessed = !!Object.keys(MarathonStore.get("apps")).length;

    return (
      <div>
        <ResourceBarChart
          itemCount={data.frameworks.length}
          resources={data.totalFrameworksResources}
          totalResources={data.totalResources}
          refreshRate={data.refreshRate}
          resourceType="Services"
          selectedResource={this.state.selectedResource}
          onResourceSelectionChange={this.onResourceSelectionChange} />
        <FilterHeadline
          onReset={this.resetFilter}
          name="Services"
          currentLength={data.frameworks.length}
          totalLength={data.totalFrameworks} />
        <ul className="list list-unstyled list-inline flush-bottom">
          <li>
            <FilterHealth
              countByHealth={data.countByHealth}
              healthFilter={state.healthFilter}
              handleFilterChange={this.handleHealthFilterChange}
              servicesLength={data.totalFrameworks} />
          </li>
          <li>
            <FilterInputText
              searchString={state.searchString}
              handleFilterChange={this.handleSearchStringChange} />
          </li>
        </ul>
        <ServiceTable
          services={data.frameworks}
          healthProcessed={appsProcessed} />
      </div>
    );
  },

  getEmptyServicesPageContent: function () {
    return (
      <AlertPanel title="No Services Installed">
        <p>Use the DCOS command line tools to find and install services.</p>
      </AlertPanel>
    );
  },

  getContents: function (isEmpty) {
    if (isEmpty) {
      return this.getEmptyServicesPageContent();
    } else {
      return this.getServicesPageContent();
    }
  },

  render: function () {
    var data = this.internalStorage_get();
    var isEmpty = data.statesProcessed && data.totalFrameworks === 0;

    return (
      <Page title="Services">
        {this.getContents(isEmpty)}
        <RouteHandler />
      </Page>
    );
  }

});

module.exports = ServicesPage;
