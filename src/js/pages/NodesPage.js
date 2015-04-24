/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var AlertPanel = require("../components/AlertPanel");
var EventTypes = require("../constants/EventTypes");
var FilterByService = require("../components/FilterByService");
var FilterInputText = require("../components/FilterInputText");
var FilterHeadline = require("../components/FilterHeadline");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var Page = require("../components/Page");
var MesosStateStore = require("../stores/MesosStateStore");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var HostTable = require("../components/HostTable");
var SidebarActions = require("../events/SidebarActions");

function getMesosHosts(state) {
  var filters = _.pick(state, "searchString", "byServiceFilter");
  var hosts = MesosStateStore.getHosts(filters);
  var allHosts = MesosStateStore.getLatest().slaves;

  return {
    hosts: hosts,
    statesProcessed: MesosStateStore.isStatesProcessed(),
    services: MesosStateStore.getFrameworksWithHostsCount(allHosts),
    refreshRate: MesosStateStore.getRefreshRate(),
    allHosts: allHosts,
    totalHostsResources: MesosStateStore.getTotalHostsResources(hosts),
    totalResources: MesosStateStore.getTotalResources()
  };
}

var DEFAULT_FILTER_OPTIONS = {
  searchString: "",
  byServiceFilter: null
};

var NodesPage = React.createClass({

  displayName: "NodesPage",

  mixins: [InternalStorageMixin],

  statics: {
    // Static life cycle method from react router, that will be called
    // "when a handler is about to render", i.e. on route change:
    // https://github.com/rackt/react-router/
    // blob/master/docs/api/components/RouteHandler.md
    willTransitionTo: function () {

      SidebarActions.close();
    }
  },

  getInitialState: function () {
    return _.clone(DEFAULT_FILTER_OPTIONS);
  },

  componentWillMount: function () {
    this.internalStorage_set(getMesosHosts(this.state));
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

  onMesosStateChange: function () {
    this.internalStorage_set(getMesosHosts(this.state));
    this.forceUpdate();
  },

  resetFilter: function () {
    var state = _.clone(DEFAULT_FILTER_OPTIONS);
    this.internalStorage_set(getMesosHosts(state));
    this.setState(state);
  },

  handleSearchStringChange: function (searchString) {
    var stateChanges = _.extend({}, this.state, {
      searchString: searchString
    });

    this.internalStorage_set(getMesosHosts(stateChanges));
    this.setState({searchString: searchString});
  },

  handleByServiceFilterChange: function (byServiceFilter) {
    if (byServiceFilter === "") {
      byServiceFilter = null;
    }

    var stateChanges = _.extend({}, this.state, {
      byServiceFilter: byServiceFilter
    });

    this.internalStorage_set(getMesosHosts(stateChanges));
    this.setState({byServiceFilter: byServiceFilter});
  },

  getHostsPageContent: function () {
    var data = this.internalStorage_get();
    var state = this.state;

    return (
      <div>
        <ResourceBarChart
          data={data.hosts}
          resources={data.totalHostsResources}
          totalResources={data.totalResources}
          refreshRate={data.refreshRate}
          resourceType="Nodes" />
        <FilterHeadline
          onReset={this.resetFilter}
          name="Nodes"
          currentLength={data.hosts.length}
          totalLength={data.allHosts.length} />
        <ul className="list list-unstyled list-inline flush-bottom">
          <li>
            <FilterByService
              byServiceFilter={state.byServiceFilter}
              services={data.services}
              totalHostsCount={data.allHosts.length}
              handleFilterChange={this.handleByServiceFilterChange} />
          </li>
          <li>
            <FilterInputText
              searchString={state.searchString}
              handleFilterChange={this.handleSearchStringChange} />
          </li>
        </ul>
        <HostTable hosts={data.hosts} />
      </div>
    );
  },

  getEmptyHostsPageContent: function () {
    return (
      <AlertPanel title="Empty Datacenter">
        <p>Your datacenter is looking pretty empty.
        We don't see any nodes other than your master.</p>
      </AlertPanel>
    );
  },

  getContents: function (isEmpty) {
    if (isEmpty) {
      return this.getEmptyHostsPageContent();
    } else {
      return this.getHostsPageContent();
    }
  },

  render: function () {
    var data = this.internalStorage_get();
    var isEmpty = data.statesProcessed && data.allHosts.length === 0;

    return (
      <Page title="Nodes">
       {this.getContents(isEmpty)}
      </Page>
    );
  }

});

module.exports = NodesPage;
