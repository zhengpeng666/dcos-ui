/** @jsx React.DOM */

var React = require("react");
var _ = require("underscore");

function length(val, key) {
  return <td key={key}>{val.length}</td>;
}

var displayValues = {
  "active": function (val, key) {
    return <td key={key}>{val ? "Active" : "Inactive"}</td>;
  },
  "completed_tasks": length,
  "offers": length,
  "tasks": length
};

var ServiceItem = React.createClass({

  displayName: "ServiceItem",

  propTypes: {
    model: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      model: {}
    };
  },

  getDisplayNodes: function () {
    return _.map(this.props.model, function (value, key) {
      if (_.isFunction(displayValues[key])) {
        return displayValues[key](value, key);
      }
      return <td key={key}>{value}</td>;
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <tr>
        {this.getDisplayNodes()}
      </tr>
    );
  }
});

module.exports = ServiceItem;
