/** @jsx React.DOM */

var React = require("react/addons");
var Link = require("react-router").Link;
var State = require("react-router").State;

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");

function getMesosInfo() {
  return MesosStateStore.getLatest();
}

var Sidebar = React.createClass({

  displayName: "Sidebar",

  mixins: [State],

  getInitialState: function () {
    return getMesosInfo();
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
    this.setState(getMesosInfo());
  },

  getItemClassSet: function (routeName) {
    return React.addons.classSet({
      "sidebar-menu-item h3": true,
      "selected": this.isActive(routeName)
    });
  },

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
              {this.state.cluster}
            </h2>
            <p className="sidebar-header-sublabel text-align-center flush-bottom">
              {this.state.hostname}
            </p>
          </div>
        </div>
        <div id="sidebar-content" className="container-scrollable">
          <nav id="sidebar-navigation">
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
              </ul>
            </div>
          </nav>
        </div>
        <div id="sidebar-footer">
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
