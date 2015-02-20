/** @jsx React.DOM */

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

  getStatistics: function () {
    var resources = this.props.model.resources;
    var totalResources = this.props.totalResources;

    var cpus = roundPercentage(resources.cpus / totalResources.cpus, 2);
    var mem = roundPercentage(resources.mem / totalResources.mem, 2);
    var disk = roundPercentage(resources.disk / totalResources.disk, 2);

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <ul className="list-unstyled list-inline inverse flush-top flush-bottom">
        <li><strong>{cpus}%</strong> CPU</li>
        <li><strong>{mem}%</strong> Mem</li>
        <li><strong>{disk}%</strong> Disk</li>
      </ul>
    );
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
          <i className="icon icon-medium icon-medium-white"></i>
        </div>
        <div className="collection-item-content">
          <h5
            className="collection-item-content-headline flush-top flush-bottom">
            {model.name}
          </h5>
          {this.getStatus()}
        </div>
        <div className="collection-item-footer">
          {this.getStatistics()}
        </div>
      </li>
    );
  }
});

module.exports = ServiceItem;
