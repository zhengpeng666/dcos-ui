/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Dropdown = require("./Dropdown");

var defaultId = "default";

var FilterByService = React.createClass({

  displayName: "FilterByService",

  propTypes: {
    byServiceFilter: React.PropTypes.string,
    services: React.PropTypes.array.isRequired,
    totalHostsCount: React.PropTypes.number.isRequired,
    handleFilterChange: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      byServiceFilter: defaultId,
      services: [],
      totalHostsCount: 0,
      handleFilterChange: _.noop
    };
  },

  handleItemSelection: function (obj) {
    if (obj.id === defaultId) {
      this.props.handleFilterChange(null);
    } else {
      this.props.handleFilterChange(obj.id);
    }
  },

  selectedRender: function () {
    return (
      <span className="badge-container">
        <span>Filter by Service</span>
      </span>
    );
  },

  itemRender: function(obj) {
    return (
      <span className="badge-container">
        <span>{obj.name}</span>
        <span className="badge">{obj.slaves_count}</span>
      </span>
    );
  },

  getDropdownItems: function () {
    var items = [
      {
        id: defaultId,
        name: "All Services",
        slaves_count: this.props.totalHostsCount
      }
    ].concat(this.props.services);

    var itemRender = this.itemRender;
    return _.map(items, function (service) {
      var selectedRender;
      if (service.id === defaultId) {
        selectedRender = this.selectedRender;
      }

      return {
        id: service.id,
        name: service.name,
        render: itemRender,
        selectedRender: selectedRender,
        slaves_count: service.slaves_count
      };
    }, this);
  },

  getSelectedId: function (id) {
    if (id == null) {
      return defaultId;
    }

    return id;
  },

  render: function () {
    return (
      <Dropdown
        selectedId={this.getSelectedId(this.props.byServiceFilter)}
        handleItemSelection={this.handleItemSelection}
        items={this.getDropdownItems()} />
    );
  }
});

module.exports = FilterByService;
