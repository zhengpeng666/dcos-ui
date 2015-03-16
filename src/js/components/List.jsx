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

  getListItems: function () {
    var order = this.props.order;
    return _.map(this.props.list, function (item, key) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <ListItem key={key} data={item} order={order} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <ul className="list list-unstyled">
        {this.getListItems()}
      </ul>
    );
  }
});

module.exports = List;
