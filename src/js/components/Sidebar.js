/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Link = require("react-router").Link;
var State = require("react-router").State;

var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var Config = require("../utils/Config");

var MENU_ITEMS = {
  dashboard: {label: "Dashboard", icon: "dashboard"},
  services: {label: "Services", icon: "services"},
  nodes: {label: "Nodes", icon: "datacenter"}
};

function getMesosInfo() {
  return {
    mesosInfo: MesosStateStore.getLatest()
  };
}

var Sidebar = React.createClass({

  displayName: "Sidebar",

  mixins: [State, InternalStorageMixin],

  componentWillMount: function () {
    this.internalStorage_set(getMesosInfo());
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
  },

  onMesosStateChange: function () {
    this.internalStorage_set(getMesosInfo());
    this.forceUpdate();

    // Datacenter info won't change often
    // so let's not constantly update
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
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

      iconClasses["icon-" + val.icon] = true;

      var itemClassSet = React.addons.classSet({
        "sidebar-menu-item h3": true,
        "selected": isActive
      });

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

    }, this);
  },

  render: function () {
    var data = this.internalStorage_get();

    return (
      <div className="sidebar flex-container-col">
        <div className="sidebar-header">
          <div className="container container-fluid container-fluid-narrow container-pod">
            <div className="sidebar-header-image">
              <img className="sidebar-header-image-inner" src="/img/layout/sidebar/sidebar-dcos-icon-medium.png" alt="sidebar header image"/>
            </div>
            <h2 className="sidebar-header-label flush-top text-align-center short-bottom">
              {data.mesosInfo.cluster}
            </h2>
            <p className="sidebar-header-sublabel text-align-center flush-bottom">
              {data.mesosInfo.hostname}
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
              Mesosphere DCOS v.{Config.version}
            </p>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Sidebar;
