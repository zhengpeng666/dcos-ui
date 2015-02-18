/** @jsx React.DOM */

var React = require("react/addons");
var RouteHandler = require("react-router").RouteHandler;

var SidebarToggle = require("../components/SidebarToggle");

var ServicesPage = React.createClass({

  displayName: "ServicesPage",

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    return (
      <div id="page-content" className="container-scrollable">
        <div className="container container-fluid container-pod">
          <div id="page-header">
            <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
              <div id="page-header-context">
                <SidebarToggle />
                <h1 className="page-header-title flush-top flush-bottom">
                  Services
                </h1>
              </div>
            </div>
          </div>
          <RouteHandler/>
        </div>
      </div>
    );
  }

});

module.exports = ServicesPage;
