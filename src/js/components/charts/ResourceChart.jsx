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
    allocResources: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string
  },

  getData: function () {
    var props = this.props;
    return [{
        name: "Alloc",
        colorIndex: 0,
        values: props.allocResources[props.mode],
      }];
  },

  getLatestPercent: function (values) {
    return _.last(values).percentage;
  },

  getHeadline: function (values) {
    var value = _.last(values).value;
    if (this.props.mode === "cpus") {
      return value + " CPU";
    } else {
      return Humanize.filesize(value * 1024 * 1024, 1024, 0);
    }
  },

  getChart: function () {
    var props = this.props;
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Chart calcHeight={function (w) { return w/2; }}>
        <TimeSeriesChart
          data={this.getData()}
          maxY={this.getLatestPercent(props.totalResources[props.mode])}
          y="percentage" />
      </Chart>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    var props = this.props;


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
              <p className="h1-jumbo unit">
                {this.getLatestPercent(props.totalResources[props.mode])}
                <sup>%</sup>
              </p>
              <p className="h4 unit-label path-color-6">
                {this.getHeadline(props.totalResources[props.mode])} Total
              </p>
            </div>
            <div className="column-small-4">
              <p className="h1-jumbo unit">
                {this.getLatestPercent(props.allocResources[props.mode])}
                <sup>%</sup>
              </p>
              <p className="h4 unit-label path-color-0">
                {this.getHeadline(props.allocResources[props.mode])} Alloc
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
