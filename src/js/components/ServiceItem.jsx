/** @jsx React.DOM */

var _ = require("underscore");
var Humanize = require("humanize");
var React = require("react");

var ServiceItem = React.createClass({

  displayName: "ServiceItem",

  propTypes: {
    model: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      model: {}
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

  getStatistics: function (resources) {
    var labels = {
      cpus: "CPU",
      mem: "Mem",
      disk: "Disk"
    };

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return _.map(_.keys(labels), function (key) {
      var value = _.last(resources[key]).value;
      if (key !== "cpus") {
        value = Humanize.filesize(value * 1024 * 1024, 1024, 1);
      }

      return (
        <td key={key} className="align-right mobile-hidden">{value}</td>
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
            <i className="icon icon-small icon-small-white border-radius"></i>
            {model.name}
          </h5>
        </td>
        <td>{this.getStatus()}</td>
        <td className="align-right">
          {model.tasks.length}
          <span className="mobile-displayed-text"> Tasks</span>
        </td>
        {this.getStatistics(model.used_resources)}
      </tr>
    );
  }
});

module.exports = ServiceItem;
