/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Dropdown = require("./Dropdown");
var DropdownItem = require("./DropdownItem");

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

  handleItemSelection: function (serviceId) {
    this.props.handleFilterChange(serviceId);
  },

  getDropdownItems: function () {
    var serviceId = this.props.byServiceFilter;
    return _.map(this.props.services, function (service) {
      return (
        <DropdownItem key={service.id}
            value={service.id}
            selected={serviceId === service.id}
            title={service.name}>
          <span>{service.name}</span>
          <span className="badge">{service.slaves_count}</span>
        </DropdownItem>
      );
    });
  },

  getResetElement: function () {
    return (
      <DropdownItem key="default" title="All Services">
        <span>All Services</span>
        <span className="badge">{this.props.totalHostsCount}</span>
      </DropdownItem>
    );
  },

  render: function () {
    return (
      <Dropdown caption="Filter by Service"
          resetElement={this.getResetElement()}
          handleItemSelection={this.handleItemSelection}>
        {this.getDropdownItems()}
      </Dropdown>
    );
  }
});

module.exports = FilterByService;
