/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Link = require("react-router").Link;
var State = require("react-router").State;

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarStore = require("../stores/SidebarStore");

function getMesosInfo() {
  return {
    mesosInfo: MesosStateStore.getLatest()
  };
}

function getSidebarState() {
  return {
    isOpen: SidebarStore.isOpen()
  };
}

var Sidebar = React.createClass({

  displayName: "Sidebar",

  mixins: [State],

  getInitialState: function () {
    return _.extend(getMesosInfo(), getSidebarState());
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onChange
    );

    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSidebarChange
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onChange
    );

    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSidebarChange
    );
  },

  getItemClassSet: function (routeName) {
    return React.addons.classSet({
      "sidebar-menu-item h3": true,
      "selected": this.isActive(routeName)
    });
  },

  onChange: function () {
    this.setState(getMesosInfo());
  },

  onSidebarChange: function () {
    this.setState(getSidebarState());
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="container container-fluid container-fluid-narrow container-pod">
            <div className="sidebar-header-image">
              <img className="sidebar-header-image-inner" src="http://placehold.it/64x64" />
            </div>
            <h2 className="sidebar-header-label flush-top text-align-center short-bottom">
              {this.state.cluster}
            </h2>
            <p className="sidebar-header-sublabel text-align-center flush-bottom">
              {this.state.hostname}
            </p>
          </div>
        </div>
        <div className="sidebar-content container-scrollable">
          <nav className="sidebar-navigation">
            <div className="container container-fluid container-fluid-narrow">
              <ul className="sidebar-menu list-unstyled">
                <li className={this.getItemClassSet("activity")}>
                  <Link to="activity">
                    <i className="sidebar-menu-item-icon icon icon-medium icon-medium-white"></i>
                    <span className="sidebar-menu-item-label">
                      Activity
                    </span>
                  </Link>
                </li>
                <li className={this.getItemClassSet("services")}>
                  <Link to="services">
                    <i className="sidebar-menu-item-icon icon icon-medium icon-medium-white"></i>
                    <span className="sidebar-menu-item-label">
                      Services
                    </span>
                  </Link>
                </li>
                <li className={this.getItemClassSet("datacenter")}>
                  <Link to="datacenter">
                    <i className="sidebar-menu-item-icon icon icon-medium icon-medium-white"></i>
                    <span className="sidebar-menu-item-label">
                      Datacenter
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="container container-fluid container-fluid-narrow container-pod container-pod-short-bottom">
            <p className="text-align-center flush-top flush-bottom">
              Mesosphere DCOS v.0.0.1
            </p>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Sidebar;
