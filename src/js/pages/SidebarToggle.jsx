/** @jsx React.DOM */

var React = require("react");

var SidebarToggle = React.createClass({

  displayName: "SidebarToggle",

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <div className="page-header-sidebar-toggle">
        <i className="page-header-sidebar-toggle-icon icon icon-medium icon-medium-white"></i>
        <span className="page-header-sidebar-toggle-label">
          Show/Hide Sidebar
        </span>
      </div>
    );
  }
});

module.exports = SidebarToggle;
