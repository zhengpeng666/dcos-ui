/** @jsx React.DOM */

var ListItem = require("./ListItem");

var _ = require("underscore");
var React = require("react");

var List = React.createClass({

  displayName: "List",

  propTypes: {
    list: React.PropTypes.array.isRequired,
    order: React.PropTypes.array.isRequired
  },

  getListItems: function (list) {
    var order = this.props.order;
    return _.map(list, function (item, key) {
      return (
        <ListItem key={key} data={item} order={order} />
      );
    });
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <ul className="list-component list-unstyled">
        {this.getListItems(this.props.list)}
      </ul>
    );
  }
});

module.exports = List;
