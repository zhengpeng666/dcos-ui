/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarToggle = require("./SidebarToggle");
var ServicesChart = require("./charts/ServicesChart");
var ServicesFilter = require("./ServicesFilter");
var ServiceList = require("./ServiceList");

function getMesosServices(options) {
  return {
    frameworks: MesosStateStore.getFilteredFrameworks(options),
    totalFrameworks: MesosStateStore.getLatest().frameworks.length,
    totalResources: MesosStateStore.getTotalResources(),
    usedResources: MesosStateStore.getUsedResources()
  };
}

var ServicesPage = React.createClass({

  displayName: "ServicesPage",

  getInitialState: function () {
    var filterOptions = {searchString: ""};
    return _.extend(getMesosServices(filterOptions), filterOptions);
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

  onChange: function (searchString) {
    var state;
    if (searchString != null) {
      var filterOptions = {searchString: searchString};
      state = _.extend(getMesosServices(filterOptions), filterOptions);
    } else {
      state = getMesosServices({searchString: this.state.searchString});
    }
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

    return (
      <div className="services-stats">
        <h4 className={filteredClassSet}>
          Showing {filteredLength} of {totalLength} Total Services
        </h4>
        <h4 className={unfilteredClassSet}>
          {totalLength} Total Services
        </h4>
      </div>
    );
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
        <div id="page-header-navigation" />
        <div id="page-content" className="container-scrollable">
          <div className="container container-fluid container-pod">
            <ServicesChart
              data={state.frameworks}
              totalResources={state.totalResources}
              usedResources={state.usedResources}
              width={this.state.width} />
            {this.getServiceStats()}
            <ServicesFilter
              searchString={this.state.searchString}
              onSubmit={this.onChange} />
            <ServiceList
              frameworks={state.frameworks}
              totalResources={state.totalResources} />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = ServicesPage;
