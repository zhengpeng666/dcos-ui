/** @jsx React.DOM */

var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateActions = require("../actions/MesosStateActions");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarToggle = require("./SidebarToggle");


function getMesosServices() {
  return {

  };
}

var DatacenterPage = React.createClass({

  displayName: "DatacenterPage",

  getInitialState: function () {
    MesosStateActions.setPageType(DatacenterPage.displayName);
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

          </div>
        </div>
      </div>
    );
  }

});

module.exports = DatacenterPage;
