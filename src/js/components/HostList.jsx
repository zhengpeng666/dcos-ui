/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var HostItem = require("./HostItem");

var HostList = React.createClass({

  displayName: "HostList",

  propTypes: {
    hosts: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      hosts: []
    };
  },

  getHostItems: function () {
    return _.map(this.props.hosts, function (host) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <HostItem
            key={host.id}
            model={host} />
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
            <th className="grow">HOST NAME</th>
            <th className="align-right">TASKS</th>
            <th className="align-right">CPU</th>
            <th className="align-right">MEM</th>
            <th className="align-right">DISK</th>
          </tr>
        </thead>
        <tbody>
          {this.getHostItems()}
        </tbody>
      </table>
    );
  }
});

module.exports = HostList;
