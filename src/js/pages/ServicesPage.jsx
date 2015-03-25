/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var FilterHealth = require("../components/FilterHealth");
var FilterInputText = require("../components/FilterInputText");
var ServiceTable = require("../components/ServiceTable");

function getMesosServices(filterOptions) {
  var frameworks = MesosStateStore.getFrameworks(filterOptions);
  return {
    frameworks: frameworks,
    countByHealth: MesosStateStore.getCountByHealth(),
    refreshRate: MesosStateStore.getRefreshRate(),
    totalFrameworks: MesosStateStore.getLatest().frameworks.length,
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
    filterOptions.healthFilter = healthFilter;
    this.setState(getMesosServices(filterOptions));
  },

  resetFilter: function (e) {
    e.preventDefault();
    var filterOptions = _.clone(DEFAULT_FILTER_OPTIONS);
    this.setState(getMesosServices(filterOptions));
  },

  getServiceStats: function () {
    var state = this.state;
    var filteredLength = state.frameworks.length;
    var totalLength = state.totalFrameworks;

    var filteredClassSet = React.addons.classSet({
      "h4": true,
      "hidden": filteredLength === totalLength
    });

    var unfilteredClassSet = React.addons.classSet({
      "h4": true,
      "hidden": filteredLength !== totalLength
    });

    var anchorClassSet = React.addons.classSet({
      "clickable": true,
      "hidden": filteredLength === totalLength
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <p>
        <span className={filteredClassSet}>
          Showing {filteredLength} of {totalLength} Services
        </span>&nbsp;
        <a className={anchorClassSet} onClick={this.resetFilter}>
          Show all
        </a>
        <span className={unfilteredClassSet}>
          {totalLength} Services
        </span>
      </p>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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
            {this.getServiceStats()}
            <ul className="list list-unstyled list-inline flush-bottom">
              <li>
                <FilterHealth
                  countByHealth={state.countByHealth}
                  healthFilter={state.healthFilter}
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
