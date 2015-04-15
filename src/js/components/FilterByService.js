/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Dropdown = require("./Dropdown");

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

  handleItemSelection: function (service) {
    if (service.id.length > 0 && service.id !== "default") {
      this.props.handleFilterChange(service.id);
    }
  },

  renderItem: function (service) {
    return (
      <span key={service.id}>
        <span>{service.name}</span>
        <span className="badge">{service.slaves_count}</span>
      </span>
    );
  },

  getDropdownItems: function () {
    // var serviceId = this.props.byServiceFilter;
            // value={service.id}
            // selected={serviceId === service.id}
            // title={service.name}
    return _.map(this.props.services, function (service) {
      return {
        id: service.id,
        name: service.name,
        render: this.renderItem.bind(null, service)
      };
    }, this);
  },

  getResetElement: function () {
    return (
      <span key="default" title="All Services">
        <span>All Services</span>
        <span className="badge">{this.props.totalHostsCount}</span>
      </span>
    );
  },

  render: function () {
    var resetElement = {
      id: "default",
      name: "All Services",
      render: this.getResetElement
    };

    return (
      <Dropdown caption="Filter by Service"
        resetElement={resetElement}
        handleItemSelection={this.handleItemSelection}
        items={this.getDropdownItems()} />
    );
  }
});

module.exports = FilterByService;
