/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");

var HostItem = React.createClass({

  displayName: "HostItem",

  propTypes: {
    model: React.PropTypes.object.isRequired,
    columnHighlighted: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      model: {},
      columnHighlighted: []
    };
  },

  getStatistics: function (resources, highlighted) {
    var labels = {
      cpus: "CPU",
      mem: "Mem",
      disk: "Disk"
    };

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return _.map(_.keys(labels), function (r, i) {
      return (
        <td key={r} className={"align-right mobile-hidden" + highlighted[i+2]}>
          {_.last(resources[r]).percentage}%
        </td>
      );
    });
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    var highlighted = this.props.columnHighlighted;
    var model = this.props.model;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <tr title={model.id}>
        <td className={highlighted[0]}>
          <h5 className="flush-top flush-bottom">
            {model.hostname}
          </h5>
        </td>
        <td className={"align-right" + highlighted[1]}>
          {model.tasks_size}
          <span className="mobile-displayed-text"> Tasks</span>
        </td>
        {this.getStatistics(model.used_resources, highlighted)}
      </tr>
    );
  }
});

module.exports = HostItem;
