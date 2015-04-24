/** @jsx React.DOM */

var React = require("react");

var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var SidebarActions = require("../events/SidebarActions");
var SidebarStore = require("../stores/SidebarStore");

function getSidebarState() {
  return {
    isOpen: SidebarStore.isOpen()
  };
}

var SidebarToggle = React.createClass({

  displayName: "SidebarToggle",

  mixins: [InternalStorageMixin],

  componentWillMount: function () {
    this.internalStorage_set(getSidebarState());
  },

  componentDidMount: function () {
    SidebarStore.addChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSidebarStateChange
    );
  },

  componentWillUnmount: function () {
    SidebarStore.removeChangeListener(
      EventTypes.SIDEBAR_CHANGE,
      this.onSidebarStateChange
    );
  },

  onSidebarStateChange: function () {
    this.internalStorage_set(getSidebarState());
    this.forceUpdate();
  },

  onClick: function (e) {
    var data = this.internalStorage_get();

    e.preventDefault();

    if (data.isOpen) {
      SidebarActions.close();
    } else {
      SidebarActions.open();
    }
  },

  render: function () {
    return (
      <div className="page-header-sidebar-toggle" onClick={this.onClick}>
        <i className="page-header-sidebar-toggle-icon icon icon-mini icon-mini-white icon-list"></i>
        <span className="page-header-sidebar-toggle-label">
          Show/Hide Sidebar
        </span>
      </div>
    );
  }
});

module.exports = SidebarToggle;
