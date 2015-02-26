/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var ServiceItem = require("./ServiceItem");

var ServicesList = React.createClass({

  displayName: "ServicesList",

  propTypes: {
    frameworks: React.PropTypes.array.isRequired,
    totalResources: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      frameworks: [],
      totalResources: {}
    };
  },

  getServiceItems: function () {
    var totalResources = this.props.totalResources;

    return _.map(this.props.frameworks, function (service) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <ServiceItem
            key={service.id}
            model={service}
            totalResources={totalResources} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <ul className="collection-list list-unstyled inverse">
        {this.getServiceItems()}
      </ul>
    );
  }
});

module.exports = ServicesList;
