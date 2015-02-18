/** @jsx React.DOM */

var React = require("react/addons");
var Link = require("react-router").Link;

var Sidebar = React.createClass({

  displayName: "Sidebar",

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    return (
      <div id="sidebar">
        <div id="sidebar-header">
          <div className="container container-fluid container-fluid-narrow container-pod">
            <div className="sidebar-header-image">
              <div className="sidebar-header-image-inner">
              </div>
            </div>
            <h2 className="sidebar-header-label flush-top text-align-center short-bottom">
              Datacenter Name
            </h2>
            <p className="sidebar-header-sublabel text-align-center flush-bottom">
              172.03.12.1
            </p>
          </div>
        </div>
        <div id="sidebar-content" className="container-scrollable">
          <nav id="sidebar-navigation">
            <div className="container container-fluid container-fluid-narrow">
              <ul className="sidebar-menu list-unstyled">
                <li className="sidebar-menu-item selected h3">
                  <Link to="activity">
                    <i className="sidebar-menu-item-icon icon icon-medium icon-medium-white"></i>
                    <span className="sidebar-menu-item-label">
                      Activity
                    </span>
                  </Link>
                </li>
                <li className="sidebar-menu-item h3">
                  <Link to="services">
                    <i className="sidebar-menu-item-icon icon icon-medium icon-medium-white"></i>
                    <span className="sidebar-menu-item-label">
                      Services
                    </span>
                  </Link>
                </li>
                <li className="sidebar-menu-item h3">
                  <Link to="modules">
                    <i className="sidebar-menu-item-icon icon icon-medium icon-medium-white"></i>
                    <span className="sidebar-menu-item-label">
                      Modules
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div id="sidebar-footer">
          <div className="container container-fluid container-fluid-narrow container-pod container-pod-short-bottom">
            <p className="text-align-center flush-top flush-bottom">
              Mesosphere DCOS v.1.0
            </p>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Sidebar;
