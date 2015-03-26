/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var FilterHeadline = require("../components/FilterHeadline");
var FilterHealth = require("../components/FilterHealth");
var FilterInputText = require("../components/FilterInputText");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var ServiceTable = require("../components/ServiceTable");

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

function getMesosServices(filterOptions) {
  var frameworks = MesosStateStore.getFrameworks(filterOptions);
  var allFrameworks = MesosStateStore.getLatest().frameworks;

  return {
    frameworks: frameworks,
    countByHealth: getCountByHealth(allFrameworks),
    refreshRate: MesosStateStore.getRefreshRate(),
    totalFrameworks: allFrameworks.length,
    totalFrameworksResources:
      MesosStateStore.getTotalFrameworksResources(frameworks),
    totalResources: MesosStateStore.getTotalResources(),
    filterOptions: filterOptions
  };
}

var DEFAULT_FILTER_OPTIONS = {
  searchString: "",
  healthFilter: null
};

var ServicesPage = React.createClass({

  displayName: "ServicesPage",

  getInitialState: function () {
    var filterOptions = _.clone(DEFAULT_FILTER_OPTIONS);
    return getMesosServices(filterOptions);
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

  statics: {
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  onChange: function (searchString) {
    var state;
    if (searchString != null) {
      var filterOptions = this.state.filterOptions;
      filterOptions.searchString = searchString;
      state = getMesosServices(filterOptions);
    } else {
      state = getMesosServices(this.state.filterOptions);
    }
    this.setState(state);
  },

  onChangeHealthFilter: function (healthFilter) {
    var filterOptions = this.state.filterOptions;
    // reset filter on health filter change
    filterOptions = _.clone(DEFAULT_FILTER_OPTIONS);
    filterOptions.healthFilter = healthFilter;
    this.setState(getMesosServices(filterOptions));
  },

  resetFilter: function (e) {
    e.preventDefault();
    var filterOptions = _.clone(DEFAULT_FILTER_OPTIONS);
    this.setState(getMesosServices(filterOptions));
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    var state = this.state;

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
          <div className="container container-fluid container-pod">
            <ResourceBarChart
              data={state.frameworks}
              resources={state.totalFrameworksResources}
              totalResources={state.totalResources}
              refreshRate={state.refreshRate}
              resourceType="Services" />
            <FilterHeadline
              onReset={this.resetFilter}
              name="Services"
              currentLength={state.frameworks.length}
              totalLength={state.totalFrameworks} />
            <ul className="list list-unstyled list-inline flush-bottom">
              <li>
                <FilterHealth
                  countByHealth={state.countByHealth}
                  healthFilter={state.filterOptions.healthFilter}
                  onSubmit={this.onChangeHealthFilter}
                  servicesLength={state.totalFrameworks} />
              </li>
              <li>
                <FilterInputText
                  searchString={state.filterOptions.searchString}
                  onSubmit={this.onChange} />
              </li>
            </ul>
            <ServiceTable
              frameworks={state.frameworks}
              totalResources={state.totalResources} />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = ServicesPage;
