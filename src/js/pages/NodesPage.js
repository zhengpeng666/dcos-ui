/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;
var RouterLocation = Router.HashLocation;
var Link = Router.Link;

var AlertPanel = require("../components/AlertPanel");
var EventTypes = require("../constants/EventTypes");
var FilterByService = require("../components/FilterByService");
var FilterInputText = require("../components/FilterInputText");
var FilterHeadline = require("../components/FilterHeadline");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var Page = require("../components/Page");
var ResourceBarChart = require("../components/charts/ResourceBarChart");
var SidebarActions = require("../events/SidebarActions");

var NODES_DISPLAY_LIMIT = 300;

function getMesosHosts(state) {
  var filters = _.pick(state, "searchString", "byServiceFilter");
  var hosts = MesosStateStore.getHosts(filters);
  var allHosts = MesosStateStore.getLatest().slaves;

  return {
    allHosts: allHosts,
    hosts: hosts,
    refreshRate: MesosStateStore.getRefreshRate(),
    services: MesosStateStore.getFrameworksWithHostsCount(allHosts),
    statesProcessed: MesosStateStore.isStatesProcessed(),
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
    return _.extend({selectedResource: "cpus"}, DEFAULT_FILTER_OPTIONS);
  },

  componentWillMount: function () {
    this.internalStorage_set(getMesosHosts(this.state));
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
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

  onResourceSelectionChange: function (selectedResource) {
    if (this.state.selectedResource !== selectedResource) {
      this.setState({selectedResource: selectedResource});
    }
  },

  getFilterInputText: function() {
    var isVisible = /\/nodes\/list\/?/i.test(RouterLocation.getCurrentPath());
    var style;

    if (isVisible) {
      style = {
        visibility: "visible"
      };
    } else {
      style = {
        visibility: "hidden"
      };
    }

    return (
      <div style={style}>
        <FilterInputText
          searchString={this.state.searchString}
          handleFilterChange={this.handleSearchStringChange} />
      </div>
    );
  },

  getViewTypeRadioButtons: function (resetFilter) {
    var buttonClasses = {
      "button button-small button-stroke button-inverse": true
    };

    var listClassSet = React.addons.classSet(_.extend({
      "active": /\/nodes\/list\/?/i.test(RouterLocation.getCurrentPath())
    }, buttonClasses));

    var gridClassSet = React.addons.classSet(_.extend({
      "active": /\/nodes\/grid\/?/i.test(RouterLocation.getCurrentPath())
    }, buttonClasses));

    return (
      <div className="button-group">
        <Link className={listClassSet} onClick={resetFilter} to="nodes-list">List</Link>
        <Link className={gridClassSet} onClick={resetFilter} to="nodes-grid">Grid</Link>
      </div>
    );
  },

  getHostsPageContent: function () {
    var data = this.internalStorage_get();
    var state = this.state;
    var hostList = _.first(data.hosts, NODES_DISPLAY_LIMIT);
    var currentLength = Math.min(data.hosts.length, NODES_DISPLAY_LIMIT);

    return (
      <div>
        <ResourceBarChart
          itemCount={data.hosts.length}
          resources={data.totalHostsResources}
          totalResources={data.totalResources}
          refreshRate={data.refreshRate}
          resourceType="Nodes"
          selectedResource={this.state.selectedResource}
          onResourceSelectionChange={this.onResourceSelectionChange} />
        <FilterHeadline
          onReset={this.resetFilter}
          name="Nodes"
          currentLength={currentLength}
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
            {this.getFilterInputText()}
          </li>
          <li className="list-item-aligned-right">
            {this.getViewTypeRadioButtons(this.resetFilter)}
          </li>
        </ul>
        <RouteHandler
          selectedResource={this.state.selectedResource}
          hosts={hostList}
          services={data.services} />
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
