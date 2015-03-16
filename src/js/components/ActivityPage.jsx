/** @jsx React.DOM */

var React = require("react/addons");

var Activity = require("./Activity");
var SidebarToggle = require("./SidebarToggle");

var ActivityPage = React.createClass({

  displayName: "ActivityPage",

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
                Activity
              </h1>
            </div>
            <div id="page-header-navigation" />
          </div>
        </div>
        <div id="page-content" className="container-scrollable">
          <div className="container container-fluid container-pod">
            <Activity />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = ActivityPage;
