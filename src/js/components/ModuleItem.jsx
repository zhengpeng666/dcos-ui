/** @jsx React.DOM */

var React = require("react");
var _ = require("underscore");

var ModuleItem = React.createClass({

  displayName: "ModuleItem",

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

module.exports = ModuleItem;
