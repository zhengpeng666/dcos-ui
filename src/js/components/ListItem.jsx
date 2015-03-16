/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var ListItem = React.createClass({

  displayName: "ListItem",

  propTypes: {
    data: React.PropTypes.object.isRequired,
    order: React.PropTypes.array.isRequired
  },

  getObjectItems: function (object, order) {
    return _.map(order, function (property, key) {
      var propertyData = object[property];
      var styles = _.omit(propertyData, "value", "classes");

      var classes = {h3: true};
      if (propertyData.classes) {
        _.extend(classes, propertyData.classes);
      }
      var classSet = React.addons.classSet(classes);

      return (
        <div key={key} style={styles} className={classSet}>
          {propertyData.value}
        </div>
      );
    });
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <li className="list-item">
        {this.getObjectItems(this.props.data, this.props.order)}
      </li>
    );
  }
});

module.exports = ListItem;
