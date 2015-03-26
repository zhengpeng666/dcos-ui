/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var AlertPanel = require("../components/AlertPanel");
var EventTypes = require("../constants/EventTypes");
var FilterHeadline = require("../components/FilterHeadline");
var FilterInputText = require("../components/FilterInputText");
var MesosStateStore = require("../stores/MesosStateStore");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");
var Panel = require("../components/Panel");
var HostTable = require("../components/HostTable");


var DEFAULT_FILTER_OPTIONS = {searchString: ""};

function getMesosHosts(filterOptions) {
  filterOptions = filterOptions || _.clone(DEFAULT_FILTER_OPTIONS);
  var hosts = MesosStateStore.getHosts(filterOptions);
  return _.extend({
    hosts: hosts,
    statesProcessed: MesosStateStore.getStatesProcessed(),
    refreshRate: MesosStateStore.getRefreshRate(),
    totalHosts: MesosStateStore.getLatest().slaves.length,
    totalHostsResources: MesosStateStore.getTotalHostsResources(hosts),
    totalResources: MesosStateStore.getTotalResources()
  }, {filterOptions: filterOptions});
}

var DatacenterPage = React.createClass({

  displayName: "DatacenterPage",

  getInitialState: function () {
    return getMesosHosts();
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

  onChange: function () {
    this.setState(getMesosHosts(this.state.filterOptions));
  },

  onFilterChange: function (searchString) {
    var filterOptions = this.state.filterOptions;
    filterOptions.searchString = searchString;
    this.setState(getMesosHosts(filterOptions));
  },

  resetFilter: function () {
    var filterOptions = _.clone(DEFAULT_FILTER_OPTIONS);
    this.setState(getMesosHosts(filterOptions));
  },

  render: function () {
    var state = this.state;
    var datacenterIsEmpty = (state.statesProcessed && state.totalHosts === 0);

    var contentsClassSet = React.addons.classSet({
      "container container-fluid container-pod": true,
      "hidden": datacenterIsEmpty
    });

    var alertClassSet = React.addons.classSet({
      "hidden": !datacenterIsEmpty
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="flex-container-col">
        <div className="page-header">
          <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
            <div className="page-header-context">
              <SidebarToggle />
              <h1 className="page-header-title flush-top flush-bottom">
                Datacenter
              </h1>
            </div>
            <div className="page-header-navigation" />
          </div>
        </div>
        <div className="page-content container-scrollable">
          <AlertPanel
            className={alertClassSet}
            title="Empty Datacenter">
            <p>Your datacenter is looking pretty empty. We don't see any nodes other than your master.</p>
          </AlertPanel>
          <div className={contentsClassSet}>
            <ResourceBarChart
              data={state.hosts}
              resources={state.totalHostsResources}
              totalResources={state.totalResources}
              refreshRate={state.refreshRate} />
            {this.getHostsStats()}
            <FilterInputText
              searchString={this.state.searchString}
              onSubmit={this.onFilterChange} />
            <HostTable hosts={this.state.hosts} />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = DatacenterPage;
