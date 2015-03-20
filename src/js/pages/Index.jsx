/** @jsx React.DOM */

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var EventTypes = require("../constants/EventTypes");
var Sidebar = require("./Sidebar");
var SidebarActions = require("../events/SidebarActions");
var SidebarStore = require("../stores/SidebarStore");
var MesosStateStore = require("../stores/MesosStateStore");

function getSidebarState() {
  return {
    isOpen: SidebarStore.isOpen()
  };
}

var Index = React.createClass({

  displayName: "Index",

  getInitialState: function () {
    return getSidebarState();
  },

  componentWillMount: function () {
    MesosStateStore.init();
  },

  componentDidMount: function () {
    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onChange
    );
    window.addEventListener("resize", SidebarActions.close);
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onChange
    );
    window.removeEventListener("resize", SidebarActions.close);
  },

  onChange: function () {
    this.setState(getSidebarState());
  },

  getClassSet: function (isOpen) {
    return React.addons.classSet({
      "canvas-sidebar-open": isOpen
    });
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <div id="canvas" className={this.getClassSet(this.state.isOpen)}>
        <Sidebar isOpen={this.state.isOpen} />
        <div className="page">
          <RouteHandler />
        </div>
      </div>
    );
  }
});

module.exports = Index;
