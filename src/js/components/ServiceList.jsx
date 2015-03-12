/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var ServiceItem = require("./ServiceItem");

var ServicesList = React.createClass({

  displayName: "ServicesList",

  propTypes: {
    frameworks: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      frameworks: []
    };
  },

  getServiceItems: function () {
    return _.map(this.props.frameworks, function (service) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <ServiceItem
            key={service.id}
            model={service} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="grow">SERVICE NAME</th>
            <th>HEALTH</th>
            <th className="align-right">TASKS</th>
            <th className="align-right">CPU</th>
            <th className="align-right">MEM</th>
            <th className="align-right">DISK</th>
          </tr>
        </thead>
        <tbody>
          {this.getServiceItems()}
        </tbody>
      </table>
    );
  }
});

module.exports = ServicesList;
