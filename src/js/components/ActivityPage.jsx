/** @jsx React.DOM */

var React = require("react/addons");
var Link = require("react-router").Link;
var RouteHandler = require("react-router").RouteHandler;

var ActivityPage = React.createClass({

  displayName: "ActivityPage",

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    return (
      <div id="page-content" className="container-scrollable">
        <div className="container container-fluid container-pod">
          <div id="page-header">
            <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
              <div id="page-header-context">
                <div className="page-header-sidebar-toggle">
                  <i className="page-header-sidebar-toggle-icon icon icon-medium icon-medium-white"></i>
                  <span className="page-header-sidebar-toggle-label">
                    Show/Hide Sidebar
                  </span>
                </div>
                <h1 className="page-header-title flush-top flush-bottom">
                  Activity
                </h1>
              </div>
              <div id="page-header-actions">
                <div className="button-collection flush-bottom">
                  <Link to="home" className="button button-large button-primary">
                    Primary Button
                  </Link>
                  <Link to="home" className="button button-large">
                    Default Button
                  </Link>
                </div>
              </div>
              <div id="page-header-navigation">
                <ul className="list-unstyled list-inline flush-bottom">
                  <li className="selected">
                    <Link to="activity">
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link to="services">
                      Services
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <RouteHandler/>
        </div>
      </div>
    );
  }

});

module.exports = ActivityPage;
