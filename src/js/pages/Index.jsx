/** @jsx React.DOM */

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var EventTypes = require("../constants/EventTypes");
var Sidebar = require("../components/Sidebar");
var SidebarActions = require("../events/SidebarActions");
var SidebarStore = require("../stores/SidebarStore");
var MesosStateStore = require("../stores/MesosStateStore");

function getMesosState() {
  return {
    statesProcessed: MesosStateStore.getStatesProcessed()
  };
}

function getSidebarState() {
  return {
    isOpen: SidebarStore.isOpen()
  };
}

var Index = React.createClass({

  displayName: "Index",

  getDefaultProps: function () {
    return {
      statesProcessed: false
    };
  },

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

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onStateChange
    );
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onChange
    );
    window.removeEventListener("resize", SidebarActions.close);

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onStateChange
    );
  },

  onChange: function () {
    this.setState(getSidebarState());
  },

  onStateChange: function () {
    this.setState(getMesosState());
  },

  getContents: function (isLoading) {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    if (isLoading) {
      return (
        <div id="canvas">
          <div className="text-align-center vertical-center">
            <div className="ball-scale">
              <div />
            </div>
            <h4>Loading...</h4>
          </div>
        </div>
      );
    }

    var classSet = React.addons.classSet({
      "canvas-sidebar-open": this.state.isOpen
    });

    return (
      <div id="canvas" className={classSet}>
        <Sidebar />
        <RouteHandler />
      </div>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    var isLoading = !this.state.statesProcessed;

    return (
      <div>
        {this.getContents(isLoading)}
      </div>
    );
  }
});

module.exports = Index;
