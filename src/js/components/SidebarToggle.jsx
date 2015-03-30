/** @jsx React.DOM */

var React = require("react");

var SidebarActions = require("../events/SidebarActions");
var SidebarStore = require("../stores/SidebarStore");
var EventTypes = require("../constants/EventTypes");

function getSidebarState() {
  return {
    isOpen: SidebarStore.isOpen()
  };
}

var SidebarToggle = React.createClass({

  displayName: "SidebarToggle",

  getInitialState: function () {
    return getSidebarState();
  },

  componentDidMount: function () {
    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onChange
    );
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onChange
    );
  },

  onChange: function () {
    this.setState(getSidebarState());
  },

  onClick: function (e) {
    e.preventDefault();
    var isOpen = this.state.isOpen;
    if (isOpen) {
      SidebarActions.close();
    } else {
      SidebarActions.open();
    }
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <div className="page-header-sidebar-toggle" onClick={this.onClick}>
        <i className="page-header-sidebar-toggle-icon icon icon-medium icon-medium-white"></i>
        <span className="page-header-sidebar-toggle-label">
          Show/Hide Sidebar
        </span>
      </div>
    );
  }
});

module.exports = SidebarToggle;
