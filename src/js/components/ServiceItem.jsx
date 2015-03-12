/** @jsx React.DOM */

var _ = require("underscore");
var Humanize = require("humanize");
var React = require("react");

var ServiceItem = React.createClass({

  displayName: "ServiceItem",

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

  getStatus: function () {
    var model = this.props.model;

    var status = "Active";
    if (model.active !== true) {
      status = "Inactive";
    }

    var statusClassSet = React.addons.classSet({
      "collection-item-content-status": true,
      "text-success": model.active,
      "text-danger": !model.active
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <span className={statusClassSet}>{status}</span>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getStatistics: function (resources, highlighted) {
    var labels = {
      cpus: "CPU",
      mem: "Mem",
      disk: "Disk"
    };

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return _.map(_.keys(labels), function (key, i) {
      var value = _.last(resources[key]).value;
      if (key !== "cpus") {
        value = Humanize.filesize(value * 1024 * 1024, 1024, 1);
      }

      return (
        <td key={key}
            className={"align-right mobile-hidden" + highlighted[i+3]}>
          {value}
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
            <i className="icon icon-small icon-small-white border-radius"></i>
            {model.name}
          </h5>
        </td>
        <td className={highlighted[1]}>{this.getStatus()}</td>
        <td className={"align-right" + highlighted[2]}>
          {model.tasks_size}
          <span className="mobile-displayed-text"> Tasks</span>
        </td>
        {this.getStatistics(model.used_resources, highlighted)}
      </tr>
    );
  }
});

module.exports = ServiceItem;
