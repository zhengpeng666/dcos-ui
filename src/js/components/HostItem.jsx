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
        <li key={r}>
          <strong className="fixed-width">
            {_.last(resources[r]).percentage}%
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
        </div>
        <div className="collection-item-content">
          <ul className="list-unstyled list-inline inverse flush-top flush-bottom">
            <li>
              <h5 className="collection-item-content-headline flush-top flush-bottom">
                {model.hostname}
              </h5>
            </li>
            <li>
              <span>{_.size(model.tasks)} Tasks</span>
            </li>
          </ul>
        </div>
        <div className="collection-item-footer">
          <ul className="list-unstyled list-inline inverse flush-top flush-bottom">
            {this.getStatistics(model.used_resources)}
          </ul>
        </div>
      </li>
    );
  }
});

module.exports = HostItem;
