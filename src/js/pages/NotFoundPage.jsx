/** @jsx React.DOM */

var Link = require("react-router").Link;
var React = require("react/addons");

var AlertPanel = require("../components/AlertPanel");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");

var NotFoundPage = React.createClass({

  displayName: "NotFoundPage",

  statics: {
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <div className="flex-container-col flex-item">
        <div className="page-header">
          <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
            <div className="page-header-context">
              <SidebarToggle />
            </div>
            <div className="page-header-navigation" />
          </div>
        </div>
        <div className="page-content container-scrollable">
          <AlertPanel
            title="Page Not Found">
            <p>
              The page you’ve requested cannot be found.
              It’s possible you copied the wrong link.
              Check again, or jump back to your&nbsp;
              <Link to="dashboard">Dashboard</Link>.
            </p>
          </AlertPanel>
        </div>
      </div>
    );
  }

});

module.exports = NotFoundPage;
