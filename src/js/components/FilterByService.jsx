/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var FilterByService = React.createClass({

  displayName: "FilterByService",

  propTypes: {
    services: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      services: [],
      onChange: _.noop
    };
  },

  getInitialState: function () {
    return {
      filter: null
    };
  },

  handleChange: function (health) {
    var serviceId = this.refs.select.getDOMNode().value;
    this.setState({filter: serviceId});
    this.props.onChange(serviceId);
  },

  getSelectOptions: function () {
    var serviceId = this.state.filter;
    var defaultOption = [{
      id: "",
      name: "Filter By Service",
      slaves_length: ""
    }];
    return _.map(defaultOption.concat(this.props.services),
        function (service, key) {
      var selected;
      if (serviceId != null && serviceId === service.id) {
        selected = "selected";
      }
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <option key={"key"+service.id} value={service.id} selected={selected}>
          {service.name}
          <span className="badge">{service.slaves_length}</span>
        </option>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <span className="form-control form-control-select">
        <select ref="select" onChange={this.handleChange}>
          {this.getSelectOptions()}
        </select>
      </span>
    );
  }
});

module.exports = FilterByService;
