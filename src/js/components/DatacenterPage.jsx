/** @jsx React.DOM */

var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarToggle = require("./SidebarToggle");
var HostList = require("./HostList");

function getMesosHosts() {
  return {
    hosts: MesosStateStore.getHosts()
  };
}

var DatacenterPage = React.createClass({

  displayName: "DatacenterPage",

  getInitialState: function () {
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
    this.setState(getMesosHosts());
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

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
        <div id="page-header-navigation" />
        <div id="page-content" className="container-scrollable">
          <div className="container container-fluid container-pod">
            <HostList hosts={state.hosts} />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = DatacenterPage;
