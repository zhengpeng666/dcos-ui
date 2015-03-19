/** @jsx React.DOM */

var React = require("react");

var SidebarActions = require("../events/SidebarActions");

var SidebarToggle = React.createClass({

  displayName: "SidebarToggle",

  onClick: function (e) {
    e.preventDefault();
    var isOpen = this.props.isOpen;
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
