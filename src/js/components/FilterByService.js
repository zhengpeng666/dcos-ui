/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Dropdown = require("./Dropdown");

var defaultKey = "default";

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
      byServiceFilter: null,
      services: [],
      totalHostsCount: 0,
      handleFilterChange: _.noop
    };
  },

  handleItemSelection: function (key) {
    if (key === defaultKey) {
      this.props.handleFilterChange(null);
    } else {
      this.props.handleFilterChange(key);
    }
  },

  getCurrentItem: function (key, children) {
    if (key === defaultKey) {
      return (
        <span>Filter by Service</span>
      );
    }

    return _.find(children, function (item) {
      return item.key === key;
    });
  },

  getDropdownItems: function () {
    var items = [
      {
        id: defaultKey,
        name: "All Services",
        slaves_count: this.props.totalHostsCount
      }
    ].concat(this.props.services);

    return _.map(items, function (service) {
      return (
        <span key={service.id}>
          <span>{service.name}</span>
          <span className="badge">{service.slaves_count}</span>
        </span>
      );
    }, this);
  },

  render: function () {

    return (
      <Dropdown
        defaultKey={defaultKey}
        handleItemSelection={this.handleItemSelection}
        getCurrentItem={this.getCurrentItem}>
        {this.getDropdownItems()}
      </Dropdown>
    );
  }
});

module.exports = FilterByService;
