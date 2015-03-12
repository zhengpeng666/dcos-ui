/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");

var HostItem = React.createClass({

  displayName: "HostItem",

  propTypes: {
    model: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      model: {}
    };
  },

  getStatistics: function (resources) {
    var labels = {
      cpus: "CPU",
      mem: "Mem",
      disk: "Disk"
    };

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return _.map(_.keys(labels), function (r) {
      return (
        <td key={r} className="align-right mobile-hidden">
          {_.last(resources[r]).percentage}%
        </td>
      );
    });
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    var model = this.props.model;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <tr title={model.id}>
        <td>
          <h5 className="flush-top flush-bottom">
            {model.hostname}
          </h5>
        </td>
        <td className="align-right">
          {model.tasks_size}
          <span className="mobile-displayed-text"> Tasks</span>
        </td>
        {this.getStatistics(model.used_resources)}
      </tr>
    );
  }
});

module.exports = HostItem;
