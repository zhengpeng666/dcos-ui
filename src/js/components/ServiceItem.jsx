/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");

var roundPercentage = function (value, decimalPlaces) {
  var factor = Math.pow(10, decimalPlaces);
  return Math.round(value * 100 * factor) / factor;
};

var ServiceItem = React.createClass({

  displayName: "ServiceItem",

  propTypes: {
    model: React.PropTypes.object.isRequired,
    totalResources: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      model: {},
      totalResources: {cpus: 0, mem: 0, disk: 0}
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
      <span className={statusClassSet}>{status} ({model.tasks.length} Tasks)</span>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getStatistics: function (resources, totalResources) {
    var labels = {
      cpus: "CPU",
      mem: "Mem",
      disk: "Disk"
    };
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return _.map(_.keys(labels), function (r) {
      return (
        <li key={r}>
          <strong className="fixed-width">
            {roundPercentage(_.last(resources[r]).y / totalResources[r], 2)}%
          </strong> {labels[r]}
        </li>
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
      <li className="collection-item" title={model.id}>
        <div className="collection-item-header">
          <i className="icon icon-medium icon-medium-white border-radius"></i>
        </div>
        <div className="collection-item-content">
          <h5 className="collection-item-content-headline flush-top flush-bottom">
            {model.name}
          </h5>
          {this.getStatus()}
        </div>
        <div className="collection-item-footer">
          <ul className="list-unstyled list-inline inverse flush-top flush-bottom">
            {this.getStatistics(model["used_resources"], this.props.totalResources)}
          </ul>
        </div>
      </li>
    );
  }
});

module.exports = ServiceItem;
