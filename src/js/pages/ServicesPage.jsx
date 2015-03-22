/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarToggle = require("./SidebarToggle");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var FilterHealth = require("../components/FilterHealth");
var FilterInputText = require("../components/FilterInputText");
var ServiceTable = require("../components/ServiceTable");

function getMesosServices(filterOptions) {
  var frameworks = MesosStateStore.getFrameworks(filterOptions);
  return {
    frameworks: frameworks,
    healthHash: MesosStateStore.getFrameworksHealthHash(),
    refreshRate: MesosStateStore.getRefreshRate(),
    totalFrameworks: MesosStateStore.getLatest().frameworks.length,
    totalFrameworksResources:
      MesosStateStore.getTotalFrameworksResources(frameworks),
    totalResources: MesosStateStore.getTotalResources()
  };
}

var _filterOptions = {
  searchString: "",
  healthFilter: null
};

var ServicesPage = React.createClass({

  displayName: "ServicesPage",

  getInitialState: function () {
    return _.extend(getMesosServices(_filterOptions), _filterOptions);
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

  extendFilterOptions: function (options) {
    options = options || {};

    return _.extend(_.reduce(_filterOptions, function (obj, val, key) {
      obj[key] = this.state[key];
      return obj;
    }.bind(this), {}), options);
  },

  onChange: function (searchString) {
    var state;
    if (searchString != null) {
      var filterOptions = this.extendFilterOptions({
        searchString: searchString
      });
      state = _.extend(getMesosServices(filterOptions), filterOptions);
    } else {
      state = getMesosServices(this.extendFilterOptions());
    }
    this.setState(state);
  },

  onChangeHealthFilter: function (healthFilter) {
    var filterOptions = this.extendFilterOptions({
      healthFilter: healthFilter
    });
    var state = _.extend(getMesosServices(filterOptions), filterOptions);
    this.setState(state);
  },

  getServiceStats: function () {
    var state = this.state;
    var filteredLength = state.frameworks.length;
    var totalLength = state.totalFrameworks;

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

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    var state = this.state;

    return (
      <div>
        <div id="page-header">
          <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
            <div id="page-header-context">
              <SidebarToggle />
              <h1 className="page-header-title flush-top flush-bottom">
                Services
              </h1>
            </div>
            <div id="page-header-navigation" />
          </div>
        </div>
        <div id="page-content" className="container-scrollable">
          <div className="container container-fluid container-pod">
            <ResourceBarChart
              data={state.frameworks}
              resources={state.totalFrameworksResources}
              totalResources={state.totalResources}
              refreshRate={state.refreshRate} />
            {this.getServiceStats()}
            <ul className="list list-unstyled list-inline flush-bottom">
              <li>
                <FilterHealth
                  healthHash={state.healthHash}
                  healthFilter={state.healthFilter}
                  onSubmit={this.onChangeHealthFilter} />
              </li>
              <li>
                <FilterInputText
                  searchString={state.searchString}
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
