var _ = require("underscore");
var React = require("react/addons");

var Dropdown = require("reactjs-components/src/Dropdown/Dropdown");

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

  itemHtml: function (service, selected) {
    var html = (
      <span className="badge-container">
        <span>{service.name}</span>
        <span className="badge">{service.slaves_count}</span>
      </span>
    );

    if (selected) {
      return html;
    }

    return (
      <a>
        {html}
      </a>
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
      var selectedHtml = this.itemHtml(service, true);

      var item = {
        id: service.id,
        name: service.name,
        html: itemHtml,
        selectedHtml: selectedHtml,
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
        buttonClassName="button button-small button-inverse dropdown-toggle"
        dropdownMenuClassName="dropdown-menu inverse"
        dropdownMenuListClassName="dropdown-menu-list"
        wrapperClassName="dropdown"
        selectedID={this.getSelectedId(this.props.byServiceFilter)}
        onItemSelection={this.handleItemSelection}
        items={this.getDropdownItems()} />
    );
  }
});

module.exports = FilterByService;
