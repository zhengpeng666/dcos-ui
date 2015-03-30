/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Link = require("react-router").Link;
var State = require("react-router").State;

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarStore = require("../stores/SidebarStore");

var MENU_ITEMS = {
  dashboard: {label: "Dashboard"},
  services: {label: "Services"},
  datacenter: {label: "Datacenter"}
};

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

  getMenuItems: function () {
    return _.map(MENU_ITEMS, function (val, key) {
      var isActive = this.isActive(key);
      var iconClasses = {
        "sidebar-menu-item-icon icon icon-medium": true,
        "icon-medium-color": isActive,
        "icon-medium-black": !isActive
      };

      iconClasses["icon-" + key] = true;

      var itemClassSet = React.addons.classSet({
        "sidebar-menu-item h3": true,
        "selected": isActive
      });
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <li className={itemClassSet} key={key}>
          <Link to={key}>
            <i className={React.addons.classSet(iconClasses)}></i>
            <span className="sidebar-menu-item-label">
              {val.label}
            </span>
          </Link>
        </li>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }, this);
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
      <div className="sidebar flex-container-col">
        <div className="sidebar-header">
          <div className="container container-fluid container-fluid-narrow container-pod">
            <div className="sidebar-header-image">
              <img className="sidebar-header-image-inner" src="/img/layout/sidebar/sidebar-dcos-icon-medium.png" alt="sidebar header image"/>
            </div>
            <h2 className="sidebar-header-label flush-top text-align-center short-bottom">
              {this.state.mesosInfo.cluster}
            </h2>
            <p className="sidebar-header-sublabel text-align-center flush-bottom">
              {this.state.mesosInfo.hostname}
            </p>
          </div>
        </div>
        <div className="sidebar-content container-scrollable">
          <nav>
            <div className="container container-fluid container-fluid-narrow">
              <ul className="sidebar-menu list-unstyled">
                {this.getMenuItems()}
              </ul>
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="container container-fluid container-fluid-narrow container-pod container-pod-short-bottom">
            <img src="/img/layout/sidebar/sidebar-logo.png" className="sidebar-footer-image" alt="sidebar footer image" />
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
