/** @jsx React.DOM */

var React = require("react/addons");

var Dashboard = require("../pages/Dashboard");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");

var DashboardPage = React.createClass({

  displayName: "DashboardPage",

  statics: {
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    return (
      <div className="flex-container-col">
        <div className="page-header">
          <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
            <div className="page-header-context">
              <SidebarToggle />
              <h1 className="page-header-title flush-top flush-bottom">
                Dashboard
              </h1>
            </div>
            <div className="page-header-navigation" />
          </div>
        </div>
        <div className="page-content container-scrollable">
          <div className="container container-fluid container-pod">
            <Dashboard />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = DashboardPage;
