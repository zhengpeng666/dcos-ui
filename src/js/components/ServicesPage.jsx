/** @jsx React.DOM */

var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateActions = require("../actions/MesosStateActions");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarToggle = require("./SidebarToggle");
var ServicesChart = require("./ServicesChart");
var ServicesFilter = require("./ServicesFilter");
var ServiceList = require("./ServiceList");

function getMesosServices() {
  return {
    filterString: MesosStateStore.getFilterOptions().searchString,
    frameworks: MesosStateStore.getFrameworks(),
    totalResources: MesosStateStore.getTotalResources(),
    usedResources: MesosStateStore.getUsedResources()
  };
}

var ServicesPage = React.createClass({

  displayName: "ServicesPage",

  getInitialState: function () {
    MesosStateActions.setPageType(ServicesPage.displayName);
    return getMesosServices();
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

  onChange: function () {
    this.setState(getMesosServices());
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
              <h1 className="page-header-title flush-top flush-bottom">
                Services
              </h1>
              <SidebarToggle />
            </div>
          </div>
        </div>
        <div id="page-content" className="container-scrollable">
          <div className="container container-fluid container-pod">
            <ServicesChart
              data={state.frameworks}
              totalResources={state.totalResources}
              usedResources={state.usedResources}
              stacked={true} />
            <ServicesFilter
                filterString={state.filterString} />
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
