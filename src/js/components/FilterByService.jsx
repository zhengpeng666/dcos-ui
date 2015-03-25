/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Dropdown = require("./Dropdown");

var FilterByService = React.createClass({

  displayName: "FilterByService",

  propTypes: {
    byServiceFilter: React.PropTypes.string,
    services: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      byServiceFilter: null,
      services: [],
      onChange: _.noop
    };
  },

  getInitialState: function () {
    return {
      filter: this.props.byServiceFilter
    };
  },

  componentWillRecieveProps: function (props) {
    this.setState({
      filter: props.byServiceFilter
    });
  },

  handleChange: function (serviceId) {
    this.setState({filter: serviceId});
    this.props.onChange(serviceId);
  },

  getDropdownItems: function () {
    var serviceId = this.state.filter;
    return _.map(this.props.services, function (service) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return {
        value: service.id,
        selected: serviceId === service.id,
        innerContent: (
          <a className="dropdown-menuitem">
            <span>{service.name}</span>
            <span className="badge">{service.slaves_length}</span>
          </a>
        )
      };
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Dropdown
        defaultItem={
          <span className="dropdown-menuitem">Filter by Service</span>
        }
        items={this.getDropdownItems()}
        onChange={this.handleChange} />
    );
  }
});

module.exports = FilterByService;
