/** @jsx React.DOM */

var _ = require("underscore");
var GeminiScrollbar = require("react-gemini-scrollbar");
var Link = require("react-router").Link;
var React = require("react/addons");
var State = require("react-router").State;

// ReactZeroClipboard injects ZeroClipboard from a third-party server unless
// global.ZeroClipboard is already defined:
var ZeroClipboard = require("zeroclipboard");
global.ZeroClipboard = ZeroClipboard;
var ReactZeroClipboard = require("react-zeroclipboard");

var Actions = require("../actions/Actions");
var Config = require("../config/Config");
var EventTypes = require("../constants/EventTypes");
var IntercomActions = require("../events/IntercomActions");
var IntercomStore = require("../stores/IntercomStore");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var SidebarActions = require("../events/SidebarActions");
var TooltipMixin = require("../mixins/TooltipMixin");

var MENU_ITEMS = {
  dashboard: {label: "Dashboard", icon: "dashboard"},
  services: {label: "Services", icon: "services"},
  nodes: {label: "Nodes", icon: "datacenter"}
};

var Sidebar = React.createClass({

  displayName: "Sidebar",

  mixins: [State, InternalStorageMixin, TooltipMixin],

  componentWillMount: function () {
    this.internalStorage_set({
      showIntercom: IntercomStore.isOpen(),
      mesosInfo: MesosStateStore.getLatest()
    });
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
    IntercomStore.addChangeListener(
      EventTypes.INTERCOM_CHANGE,
      this.onIntercomChange
    );
  },

  componentWillUnmount: function () {
    this.removeMesosStateListener();

    IntercomStore.removeChangeListener(
      EventTypes.INTERCOM_CHANGE,
      this.onIntercomChange
    );
  },

  removeMesosStateListener: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
  },

  onMesosStateChange: function () {
    this.internalStorage_update({mesosInfo: MesosStateStore.getLatest()});
    this.forceUpdate();

    // Datacenter info won't change often
    // so let's not constantly update
    this.removeMesosStateListener();
  },

  onIntercomChange: function () {
    this.internalStorage_update({showIntercom: IntercomStore.isOpen()});
    this.forceUpdate();
  },

  handleShowCliInstructions: function () {
    SidebarActions.close();
    SidebarActions.openCliInstructions();
  },

  handleStartTour: function () {
    SidebarActions.close();
    SidebarActions.startTour();
  },

  handleToggleIntercom: function () {
    var data = this.internalStorage_get();
    if (data.showIntercom) {
      IntercomActions.close();
    } else {
      IntercomActions.open();
      SidebarActions.close();
    }
  },

  handleVersionClick: function () {
    SidebarActions.close();
    SidebarActions.showVersions();
  },

  handleMouseOverCopyIcon: function () {
    this.showToolTip("Copy to clipboard");
  },

  handleMouseOutCopyIcon: function () {
    this.hideToolTip();
  },

  handleCopy: function () {
    this.showToolTip("Copied!");
    Actions.log({description: "Copied hostname from sidebar"});
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

  showToolTip: function(text) {
    var tip = this.tip_showCustomTip({
      target: this.refs.copyButton.getDOMNode(),
      content: text
    });
    this.internalStorage_update({tip: tip});
  },

  hideToolTip: function () {
    var tip = this.internalStorage_get().tip;
    this.tip_hideCustomTip(tip);
  },

  render: function () {
    var data = this.internalStorage_get();

    var chatIconClassSet = React.addons.classSet({
      "clickable": true,
      "icon": true,
      "icon-chat": true,
      "icon-medium": true,
      "icon-medium-color": data.showIntercom
    });

    return (
      <div className="sidebar flex-container-col">
        <div className="sidebar-header">
          <div className="container container-fluid container-fluid-narrow container-pod">
            <div className="sidebar-header-image">
              <img className="sidebar-header-image-inner" src="./img/layout/sidebar/sidebar-dcos-icon-medium.png" alt="sidebar header image"/>
            </div>
            <h2 className="sidebar-header-label flush-top text-align-center text-overflow flush-bottom" title={data.mesosInfo.cluster}>
              {data.mesosInfo.cluster}
            </h2>
            <div className="sidebar-header-sublabel flush-bottom"
               title={data.mesosInfo.hostname}>
              <span className="hostname text-align-center text-overflow">
                {data.mesosInfo.hostname}
              </span>
              <div data-behavior="show-tip"
                    data-tip-place="bottom"
                    onMouseOver={this.handleMouseOverCopyIcon}
                    onMouseOut={this.handleMouseOutCopyIcon}
                    ref="copyButton">
                <ReactZeroClipboard
                  text={data.mesosInfo.hostname}
                  onAfterCopy={this.handleCopy}>
                  <i className="icon icon-mini icon-clipboard icon-mini-color clickable" />
                </ReactZeroClipboard>
              </div>
            </div>
          </div>
        </div>
        <GeminiScrollbar autoshow={true} className="sidebar-content container-scrollable">
          <nav>
            <div className="container container-fluid container-fluid-narrow">
              <ul className="sidebar-menu list-unstyled">
                {this.getMenuItems()}
              </ul>
            </div>
          </nav>
        </GeminiScrollbar>
        <div className="sidebar-footer">
          <div className="container container-fluid container-fluid-narrow container-pod container-pod-short-bottom logo-container">
            <img src="./img/layout/sidebar/sidebar-logo.png" className="sidebar-footer-image" alt="sidebar footer image" />
            <p className="text-align-center flush-top flush-bottom mute">
              <small>
                <span className="clickable" onClick={this.handleVersionClick}>
                  <span className="company-name">Mesosphere </span>
                  <span className="app-name">DCOS </span>
                  <span className="version-number">v.{Config.version}</span>
                </span>
              </small>
            </p>
          </div>
          <div className="icon-buttons">
            <button className="button button-smallbutton-link"
              data-behavior="show-tip"
              data-tip-place="top-right"
              data-tip-content="Install the Command Line"
              onClick={this.handleShowCliInstructions}>
                <i className="icon icon-cli icon-medium clickable"></i>
            </button>
            <button className="button button-smallbutton-link"
              data-behavior="show-tip"
              data-tip-content="Talk with us"
              onClick={this.handleToggleIntercom}>
                <i className={chatIconClassSet}></i>
            </button>
            <button className="button button-smallbutton-link"
              data-behavior="show-tip"
              data-tip-content="Start Tour"
              onClick={this.handleStartTour}>
                <i className="icon icon-tour icon-medium clickable"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Sidebar;
