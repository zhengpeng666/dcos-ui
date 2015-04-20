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

  itemHtml: function(service) {
    return (
      <span className="badge-container">
        <span>{service.name}</span>
        <span className="badge">{service.slaves_count}</span>
      </span>
    );
  },

  getDropdownItems: function () {
    var items = [{
      id: defaultId,
      name: "All Services",
      slaves_count: this.props.totalHostsCount
    }].concat(this.props.services);

    return _.map(items, function (service) {
      var itemHtml = this.itemHtml(service);

      var item = {
        id: service.id,
        name: service.name,
        html: itemHtml,
        slaves_count: service.slaves_count
      };

      if (service.id === defaultId) {
        item.selectedHtml = (
          <span className="badge-container">
            <span>Filter by Service</span>
          </span>
        );
      }

      return item;
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
        analyticsName={this.constructor.displayName}
        selectedId={this.getSelectedId(this.props.byServiceFilter)}
        onItemSelection={this.handleItemSelection}
        items={this.getDropdownItems()} />
    );
  }
});

module.exports = FilterByService;
