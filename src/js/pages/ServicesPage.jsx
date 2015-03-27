/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var AlertPanel = require("../components/AlertPanel");
var EventTypes = require("../constants/EventTypes");
var FilterHealth = require("../components/FilterHealth");
var FilterHeadline = require("../components/FilterHeadline");
var FilterInputText = require("../components/FilterInputText");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var ServiceTable = require("../components/ServiceTable");

var DEFAULT_FILTER_OPTIONS = {
  searchString: "",
  healthFilter: null
};

function getCountByHealth(frameworks) {
  return _.foldl(frameworks, function (acc, framework) {
    if (acc[framework.health.value] === undefined) {
      acc[framework.health.value] = 1;
    } else {
      acc[framework.health.value]++;
    }

    return acc;
  }, {});
}

function getMesosServices(state) {
  var filters = _.pick(state, "searchString", "healthFilter");
  var frameworks = MesosStateStore.getFrameworks(filters);
  var allFrameworks = MesosStateStore.getLatest().frameworks;

  return {
    frameworks: frameworks,
    statesProcessed: MesosStateStore.getStatesProcessed(),
    countByHealth: getCountByHealth(allFrameworks),
    refreshRate: MesosStateStore.getRefreshRate(),
    totalFrameworks: allFrameworks.length,
    totalFrameworksResources:
      MesosStateStore.getTotalFrameworksResources(frameworks),
    totalResources: MesosStateStore.getTotalResources()
  };
}

var ServicesPage = React.createClass({

  displayName: "ServicesPage",

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return _.clone(DEFAULT_FILTER_OPTIONS);
  },

  componentWillMount: function () {
    this.internalStorage_set(getMesosServices(this.state));
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

  statics: {
    willTransitionTo: function () {
      SidebarActions.close();
    }
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

    var filteredClassSet = React.addons.classSet({
      "hidden": filteredLength === totalLength
    });

    var unfilteredClassSet = React.addons.classSet({
      "hidden": filteredLength !== totalLength
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getServicesPageContent: function () {
    var state = this.state;
    var data = this.internalStorage_get();

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="container container-fluid container-pod">
        <ResourceBarChart
          data={data.frameworks}
          resources={data.totalFrameworksResources}
          totalResources={data.totalResources}
          refreshRate={data.refreshRate}
          resourceType="Services" />
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
              onSubmit={this.handleHealthFilterChange}
              servicesLength={data.totalFrameworks} />
          </li>
          <li>
            <FilterInputText
              searchString={state.searchString}
              onSubmit={this.handleSearchStringChange} />
          </li>
        </ul>
        <ServiceTable
          frameworks={data.frameworks}
          totalResources={data.totalResources} />
      </div>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getEmptyServicesPageContent: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <AlertPanel title="No Services Installed">
        <p>Use the DCOS command line tools to find and install services.</p>
      </AlertPanel>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="flex-container-col">
        <div className="page-header">
          <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
            <div className="page-header-context">
              <SidebarToggle />
              <h1 className="page-header-title flush-top flush-bottom">
                Services
              </h1>
            </div>
            <div className="page-header-navigation" />
          </div>
        </div>
        <div className="page-content container-scrollable">
          {this.getContents(isEmpty)}
        </div>
      </div>
    );
  }

});

module.exports = ServicesPage;
