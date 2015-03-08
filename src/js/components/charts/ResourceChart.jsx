/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var Humanize = require("humanize");

var Chart = require("./Chart");
var TimeSeriesChart = require("./TimeSeriesChart");

var labelMap = {
  mem: "Memory",
  cpus: "CPU",
  disk: "Disk"
};

var ResourceChart = React.createClass({

  displayName: "ResourceChart",

  propTypes: {
    totalResources: React.PropTypes.object.isRequired,
    usedResources: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string
  },

  getData: function () {
    var props = this.props;
    return [{
      name: "All",
      colorIndex: 0,
      values: props.usedResources[props.mode],
    }];
  },

  getMaxY: function () {
    var props = this.props;
    return _.last(props.totalResources[props.mode]).percentage;
  },

  getUsed: function () {
    var props = this.props;
    return _.last(props.usedResources[props.mode]).percentage;
  },

  getTotalHeadline: function () {
    var props = this.props;
    var total = _.last(props.totalResources[props.mode]).value;
    if (props.mode === "cpus") {
      return total + " CPU";
    } else {
      return Humanize.filesize(total * 1024 * 1024, 1024, 0);
    }
  },

  getUsedHeadline: function () {
    var props = this.props;
    var value = _.last(props.usedResources[props.mode]).value;
    if (this.props.mode === "cpus") {
      return "(" + value + " CPU)";
    } else {
      return "(" + Humanize.filesize(value * 1024 * 1024, 1024, 0) + ")";
    }
  },

  getChart: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Chart calcHeight={function (w) { return w/2; }}>
        <TimeSeriesChart
          data={this.getData()}
          maxY={this.getMaxY()}
          y="percentage" />
      </Chart>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    var totalHeadline = this.getTotalHeadline().split(" ");

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="panel">
        <div className="panel-heading text-align-center">
          <h3 className="panel-title">
            {labelMap[this.props.mode]} Overview
          </h3>
        </div>
        <div className="panel-content">
          <div className="row text-align-center">
            <div className="column-small-offset-2 column-small-4">
              <p className="h1-jumbo unit">{totalHeadline[0]}</p>
              <p className="h4 unit-label text-muted">{totalHeadline[1]} Total</p>
            </div>
            <div className="column-small-4">
              <p className="h1-jumbo unit">
                {this.getUsed()}<sup>%</sup>
              </p>
              <p className="h4 unit-label">
                {this.getUsedHeadline()} Used
              </p>
            </div>
          </div>
          {this.getChart()}
        </div>
      </div>
    );
  }
});

module.exports = ResourceChart;
