/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var FilterInputText = require("../components/FilterInputText");
var MesosStateStore = require("../stores/MesosStateStore");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var SidebarToggle = require("./SidebarToggle");
var HostTable = require("../components/HostTable");

function getMesosHosts(filterOptions) {
  filterOptions = filterOptions || {searchString: ""};
  var hosts = MesosStateStore.getHosts(filterOptions);
  return _.extend({
    hosts: hosts,
    refreshRate: MesosStateStore.getRefreshRate(),
    totalHosts: MesosStateStore.getLatest().slaves.length,
    totalHostsResources: MesosStateStore.getTotalHostsResources(hosts),
    totalResources: MesosStateStore.getTotalResources()
  }, filterOptions);
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

  onChange: function () {
    this.setState(getMesosHosts({searchString: this.state.searchString}));
  },

  onFilterChange: function (searchString) {
    this.setState(getMesosHosts({searchString: searchString}));
  },

  getHostsStats: function () {
    var state = this.state;
    var filteredLength = state.hosts.length;
    var totalLength = state.totalHosts;

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
          Showing {filteredLength} of {totalLength} Hosts
        </h4>
        <h4 className={unfilteredClassSet}>
          {totalLength} Hosts
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
                Datacenter
              </h1>
            </div>
            <div id="page-header-navigation" />
          </div>
        </div>
        <div id="page-content" className="container-scrollable">
          <div className="container container-fluid container-pod">
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
